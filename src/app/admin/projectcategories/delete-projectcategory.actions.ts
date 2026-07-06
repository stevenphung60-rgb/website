"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { ProjectCategoryDocument } from "src/server/projectcategories";
import type { ProjectDocument } from "src/server/projects";

const deleteProjectCategorySchema = z.object({
	projectCategoryId: z.string().trim().min(1, "Không tìm thấy ID loại dự án cần xóa"),
});

/**
 * Get a string value from form data
 * @param formData - Submitted form data
 * @param key - Field key
 * @returns String value from form data
 */
function getFormString(formData: FormData, key: string): string {
	return (formData.get(key) as string | null) || "";
}

/**
 * Revalidate project category related pages after mutation
 */
function revalidateProjectCategoryPages(): void {
	revalidateTag(CACHE_TAGS.PROJECT_CATEGORIES, "max");
	revalidateTag(CACHE_TAGS.PROJECTS, "max");
	revalidatePath("/admin/projectcategories");
	revalidatePath("/admin/projects");
	revalidatePath("/vi/projects");
	revalidatePath("/en/projects");
}

/**
 * Delete a project category by ID
 * @param formData - Submitted form data containing project category ID
 * @returns Form result for the admin UI
 */
export async function deleteProjectCategoryAction(
	formData: FormData,
): Promise<FormResult> {
	try {
		const parsedInput = deleteProjectCategorySchema.parse({
			projectCategoryId: getFormString(formData, "projectCategoryId"),
		});

		const db = await getDatabase();
		const projectCategoriesCollection =
			db.collection<ProjectCategoryDocument>("projectCategories");

		const existingProjectCategory = await projectCategoriesCollection.findOne({
			id: parsedInput.projectCategoryId,
		});

		if (!existingProjectCategory) {
			return {
				success: false,
				error: "Không tìm thấy loại dự án cần xóa",
			};
		}

		const result = await projectCategoriesCollection.deleteOne({
			id: parsedInput.projectCategoryId,
		});

		if (result.deletedCount === 0) {
			return {
				success: false,
				error: "Không thể xóa loại dự án. Vui lòng thử lại.",
			};
		}

		await db.collection<ProjectDocument>("projects").updateMany(
			{
				categoryId: parsedInput.projectCategoryId,
			},
			{
				$unset: {
					categoryId: "",
				},
				$set: {
					updatedAt: new Date(),
				},
			},
		);

		revalidateProjectCategoryPages();

		return {
			success: true,
			refresh: true,
		};
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.errors.map((item) => item.message).join(", "),
			};
		}

		console.error("Error deleting project category:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi xóa loại dự án. Vui lòng thử lại.",
		};
	}
}