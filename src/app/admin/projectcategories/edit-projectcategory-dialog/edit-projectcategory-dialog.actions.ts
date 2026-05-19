"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { ProjectCategory, ProjectCategoryDocument } from "src/server/projectcategories";

/**
 * Server action to update an existing project category
 */
export async function updateProjectCategory(formData: FormData): Promise<FormResult> {
	try {
		const projectCategoryId = formData.get("projectCategoryId") as string;
		const projectCategoryNameEn = formData.get("projectCategoryNameEn") as string;
		const projectCategoryNameVi = formData.get("projectCategoryNameVi") as string;

		if (!projectCategoryId) {
			return {
				success: false,
				error: "Project Category ID is required",
			};
		}

		const missingFields: string[] = [];

		if (!projectCategoryNameEn) {
			missingFields.push("Project Category Name (English)");
		}

		if (!projectCategoryNameVi) {
			missingFields.push("Project Category Name (Vietnamese)");
		}

		if (missingFields.length > 0) {
			return {
				success: false,
				error: `Please fill in the following required fields: ${missingFields.join(", ")}`,
			};
		}

		const updatedProjectCategory: Partial<ProjectCategory> = {
			name: {
				en: projectCategoryNameEn,
				vi: projectCategoryNameVi,
			},
			updatedAt: new Date(),
		};

		const db = await getDatabase();
		const result = await db.collection<ProjectCategoryDocument>("projectCategories").updateOne(
			{ id: projectCategoryId },
			{
				$set: updatedProjectCategory,
			},
		);

		if (result.matchedCount === 0) {
			return {
				success: false,
				error: "Project category not found",
			};
		}

		revalidateTag(CACHE_TAGS.PROJECT_CATEGORIES, "max");
		revalidatePath("/admin/projectcategories");

		return {
			success: true,
			refresh: true,
		};
	} catch {
		return {
			success: false,
			error: "An unexpected error occurred while updating the project category",
		};
	}
}