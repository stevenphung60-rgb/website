import { cacheTag } from "next/cache";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { BlogCategoryDocument } from "./blog.types";

export async function getBlogCategoryIds(): Promise<string[]> {
	"use cache";
	cacheTag(CACHE_TAGS.BLOG_CATEGORIES);

	const db = await getDatabase();
	const documents = await db
		.collection<BlogCategoryDocument>("blogCategories")
		.find({}, { projection: { id: 1 } })
		.sort({ updatedAt: -1 })
		.toArray();

	return documents.map((document) => document.id);
}
