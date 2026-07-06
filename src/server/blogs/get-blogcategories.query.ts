import { cacheTag } from "next/cache";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { BlogCategory, BlogCategoryDocument } from "./blog.types";

export async function getBlogCategories(): Promise<BlogCategory[]> {
	"use cache";
	cacheTag(CACHE_TAGS.BLOG_CATEGORIES);

	const db = await getDatabase();
	const documents = await db
		.collection<BlogCategoryDocument>("blogCategories")
		.find({})
		.sort({ updatedAt: -1 })
		.toArray();

	return documents.map(({ _id, ...category }) => category);
}
