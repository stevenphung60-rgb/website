import { cacheTag } from "next/cache";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { BlogPostDocument, BlogPostStatus } from "./blog.types";

export async function getBlogPostIds(status?: BlogPostStatus): Promise<string[]> {
	"use cache";
	cacheTag(CACHE_TAGS.BLOG_POSTS);

	const query = status ? { status } : {};
	const db = await getDatabase();
	const documents = await db
		.collection<BlogPostDocument>("blogPosts")
		.find(query, { projection: { id: 1 } })
		.sort({ publishedAt: -1, updatedAt: -1 })
		.toArray();

	return documents.map((document) => document.id);
}
