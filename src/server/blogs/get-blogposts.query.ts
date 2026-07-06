import { cacheTag } from "next/cache";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { BlogPost, BlogPostDocument, BlogPostStatus } from "./blog.types";
import { normalizeBlogPostDocument } from "./normalize-blogpost";

interface GetBlogPostsInput {
	status?: BlogPostStatus;
	categoryId?: string | null;
	limit?: number;
}

export async function getBlogPosts(input: GetBlogPostsInput = {}): Promise<BlogPost[]> {
	"use cache";
	cacheTag(CACHE_TAGS.BLOG_POSTS);

	const query: Record<string, unknown> = {};

	if (input.status) {
		query.status = input.status;
	}

	if (input.categoryId) {
		query.categoryId = input.categoryId;
	}

	const db = await getDatabase();
	const cursor = db
		.collection<BlogPostDocument>("blogPosts")
		.find(query)
		.sort({ publishedAt: -1, updatedAt: -1 });

	if (input.limit && input.limit > 0) {
		cursor.limit(input.limit);
	}

	const documents = await cursor.toArray();

	return documents.map(normalizeBlogPostDocument);
}

export async function getPublishedBlogPosts(categoryId?: string | null) {
	return getBlogPosts({ status: "published", categoryId });
}
