import { cacheTag } from "next/cache";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { BlogPost, BlogPostDocument } from "./blog.types";

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
	"use cache";
	cacheTag(CACHE_TAGS.BLOG_POSTS);

	const db = await getDatabase();
	const document = await db.collection<BlogPostDocument>("blogPosts").findOne({ id });

	if (!document) return null;

	const { _id, ...blogPost } = document;
	return blogPost;
}
