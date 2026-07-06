import { cacheTag } from "next/cache";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { BlogPost, BlogPostDocument } from "./blog.types";

export async function getFeaturedBlogPosts(limit = 3): Promise<BlogPost[]> {
	"use cache";
	cacheTag(CACHE_TAGS.BLOG_POSTS);

	const db = await getDatabase();
	const documents = await db
		.collection<BlogPostDocument>("blogPosts")
		.find({ status: "published", isFeatured: true })
		.sort({ publishedAt: -1, updatedAt: -1 })
		.limit(limit)
		.toArray();

	return documents.map(({ _id, ...blogPost }) => blogPost);
}
