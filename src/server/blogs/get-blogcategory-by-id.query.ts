import { cacheTag } from "next/cache";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { BlogCategory, BlogCategoryDocument } from "./blog.types";

export async function getBlogCategoryById(id: string): Promise<BlogCategory | null> {
	"use cache";
	cacheTag(CACHE_TAGS.BLOG_CATEGORIES);

	const db = await getDatabase();
	const document = await db
		.collection<BlogCategoryDocument>("blogCategories")
		.findOne({ id });

	if (!document) return null;

	const { _id, ...category } = document;
	return category;
}
