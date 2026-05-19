"use server";

import { nanoid } from "nanoid";
import { revalidatePath, revalidateTag } from "next/cache";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { ProjectCategoryDocument } from "src/server/projectcategories";

/**
 * Create new project category
 */
export async function createProjectCategory(formData: FormData): Promise<FormResult> {
	try {
		const projectCategoryNameEn = formData.get("projectCategoryNameEn") as string;
		const projectCategoryNameVi = formData.get("projectCategoryNameVi") as string;

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

		const db = await getDatabase();

		const newCategory: ProjectCategoryDocument = {
			id: nanoid(),
			name: {
				en: projectCategoryNameEn,
				vi: projectCategoryNameVi,
			},
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		await db.collection<ProjectCategoryDocument>("projectCategories").insertOne(newCategory);

		revalidateTag(CACHE_TAGS.PROJECT_CATEGORIES, "max");
		revalidatePath("/admin/projectcategories");

		return {
			success: true,
			refresh: true,
		};
	} catch (error) {
		console.error("Error creating project category:", error);

		return {
			success: false,
			error: "An unexpected error occurred while creating the project category",
		};
	}
}