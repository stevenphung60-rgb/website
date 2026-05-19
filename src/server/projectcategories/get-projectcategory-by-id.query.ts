import { cache } from "react";
import { getDatabase } from "src/lib/database";
import type { ProjectCategory, ProjectCategoryDocument } from "./projectcategory.type";

export const getProjectCategoryById = cache(
	async (id: string): Promise<ProjectCategory | null> => {
		const db = await getDatabase();

		const category = await db
			.collection<ProjectCategoryDocument>("projectCategories")
			.findOne({ id });

		if (!category) return null;

		return {
			id: category.id,
			name: category.name,
			createdAt: category.createdAt,
			updatedAt: category.updatedAt,
		};
	},
);