import { randomUUID } from "crypto";
import { getDatabase } from "src/lib/database";
import type { BlogCategory, BlogCategoryDocument, LocalizedText } from "./blog.types";
import { slugify } from "./blog-utils";

interface UpdateBlogCategoryInput {
	id?: string;
	name: LocalizedText;
	slug?: LocalizedText;
	description?: LocalizedText;
}

export async function updateBlogCategory(input: UpdateBlogCategoryInput): Promise<BlogCategory> {
	const now = new Date();
	const db = await getDatabase();
	const id = input.id || randomUUID();
	const name = {
		vi: input.name.vi.trim(),
		en: input.name.en.trim() || input.name.vi.trim(),
	};
	const slug = {
		vi: input.slug?.vi?.trim() || slugify(name.vi),
		en: input.slug?.en?.trim() || slugify(name.en),
	};
	const description = {
		vi: input.description?.vi?.trim() || "",
		en: input.description?.en?.trim() || input.description?.vi?.trim() || "",
	};

	await db.collection<BlogCategoryDocument>("blogCategories").updateOne(
		{ id },
		{
			$set: {
				name,
				slug,
				description,
				updatedAt: now,
			},
			$setOnInsert: {
				id,
				createdAt: now,
			},
		},
		{ upsert: true },
	);

	return {
		id,
		name,
		slug,
		description,
		createdAt: now,
		updatedAt: now,
	};
}
