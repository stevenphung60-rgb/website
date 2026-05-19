import { cache } from "react";
import type { MultilingualText } from "src/lib/types/common.type";
import {
	getActiveProjectCategoryIds,
	getProjectCategoryById,
} from "src/server/projectcategories";

/**
 * Retrieves active project categories from projectCategories collection
 * @returns Promise that resolves to an array of active multilingual categories
 */
export const getActiveProjectCategories = cache(async (): Promise<MultilingualText[]> => {
	try {
		const categoryIds = await getActiveProjectCategoryIds();

		const categories = (
			await Promise.all(categoryIds.map((id) => getProjectCategoryById(id)))
		).filter(
			(category): category is NonNullable<typeof category> => category !== null,
		);

		return categories.map((category) => category.name);
	} catch (error) {
		console.error("Error fetching project categories:", error);
		return [];
	}
});