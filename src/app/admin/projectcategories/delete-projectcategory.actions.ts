"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { ProjectCategoryDocument } from "src/server/projectcategories";

/**
 * Delete a project category by ID
 */
export async function deleteProjectCategoryAction(formData: FormData): Promise<FormResult> {
	try {
		const projectCategoryId = formData.get("projectCategoryId") as string;

		if (!projectCategoryId) {
			return {
				success: false,
				error: "Project Category ID is required",
			};
		}

		const db = await getDatabase();
		const projectCategoriesCollection =
			db.collection<ProjectCategoryDocument>("projectCategories");

		const existingProjectCategory = await projectCategoriesCollection.findOne({
			id: projectCategoryId,
		});

		if (!existingProjectCategory) {
			return {
				success: false,
				error: "Project category not found",
			};
		}

		const result = await projectCategoriesCollection.deleteOne({
			id: projectCategoryId,
		});

		if (result.deletedCount === 0) {
			return {
				success: false,
				error: "Failed to delete project category",
			};
		}

		revalidateTag(CACHE_TAGS.PROJECT_CATEGORIES, "max");
		revalidatePath("/admin/projectcategories");

		return {
			success: true,
			refresh: true,
		};
	} catch (error) {
		console.error("Error deleting project category:", error);
		return {
			success: false,
			error: "An unexpected error occurred while deleting the project category",
		};
	}
}