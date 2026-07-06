"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { ProjectCategoryDocument } from "src/server/projectcategories";

interface UpdateProjectCategoryInput {
	projectCategoryId: string;
	projectCategoryNameVi: string;
	projectCategoryNameEn: string;
}

const updateProjectCategorySchema = z.object({
	projectCategoryId: z.string().trim().min(1, "Không tìm thấy ID loại dự án"),
	projectCategoryNameVi: z
		.string()
		.trim()
		.min(1, "Tên loại dự án tiếng Việt là bắt buộc"),
	projectCategoryNameEn: z.string().trim().optional().default(""),
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
 * Parse project category update form data
 * @param formData - Submitted form data
 * @returns Parsed and validated project category input
 */
function parseProjectCategoryInput(formData: FormData): UpdateProjectCategoryInput {
	return updateProjectCategorySchema.parse({
		projectCategoryId: getFormString(formData, "projectCategoryId"),
		projectCategoryNameVi: getFormString(formData, "projectCategoryNameVi"),
		projectCategoryNameEn: getFormString(formData, "projectCategoryNameEn"),
	});
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
 * Update an existing project category
 * @param formData - Submitted project category form data
 * @returns Form result for the admin UI
 */
export async function updateProjectCategory(formData: FormData): Promise<FormResult> {
	try {
		const categoryInput = parseProjectCategoryInput(formData);
		const db = await getDatabase();
		const projectCategoriesCollection =
			db.collection<ProjectCategoryDocument>("projectCategories");

		const existingCategory = await projectCategoriesCollection.findOne({
			id: categoryInput.projectCategoryId,
		});

		if (!existingCategory) {
			return {
				success: false,
				error: "Không tìm thấy loại dự án cần cập nhật",
			};
		}

		const fallbackEnglishName =
			categoryInput.projectCategoryNameEn || categoryInput.projectCategoryNameVi;

		const duplicateCategory = await projectCategoriesCollection.findOne({
			id: { $ne: categoryInput.projectCategoryId },
			$or: [
				{ "name.vi": categoryInput.projectCategoryNameVi },
				{ "name.en": fallbackEnglishName },
			],
		});

		if (duplicateCategory) {
			return {
				success: false,
				error: "Tên loại dự án đã tồn tại. Vui lòng nhập tên khác.",
			};
		}

		const result = await projectCategoriesCollection.updateOne(
			{ id: categoryInput.projectCategoryId },
			{
				$set: {
					name: {
						vi: categoryInput.projectCategoryNameVi,
						en: fallbackEnglishName,
					},
					updatedAt: new Date(),
				},
			},
		);

		if (result.matchedCount === 0) {
			return {
				success: false,
				error: "Không tìm thấy loại dự án cần cập nhật",
			};
		}

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

		console.error("Error updating project category:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi cập nhật loại dự án. Vui lòng thử lại.",
		};
	}
}