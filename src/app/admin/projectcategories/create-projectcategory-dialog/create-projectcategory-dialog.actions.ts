"use server";

import { randomUUID } from "crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { ProjectCategoryDocument } from "src/server/projectcategories";

interface CreateProjectCategoryInput {
	projectCategoryNameVi: string;
	projectCategoryNameEn: string;
}

const createProjectCategorySchema = z.object({
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
 * Parse project category form data
 * @param formData - Submitted form data
 * @returns Parsed and validated project category input
 */
function parseProjectCategoryInput(formData: FormData): CreateProjectCategoryInput {
	return createProjectCategorySchema.parse({
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
 * Create new project category
 * @param formData - Submitted project category form data
 * @returns Form result for the admin UI
 */
export async function createProjectCategory(formData: FormData): Promise<FormResult> {
	try {
		const categoryInput = parseProjectCategoryInput(formData);
		const db = await getDatabase();

		const fallbackEnglishName =
			categoryInput.projectCategoryNameEn || categoryInput.projectCategoryNameVi;

		const existingCategory = await db
			.collection<ProjectCategoryDocument>("projectCategories")
			.findOne({
				$or: [
					{ "name.vi": categoryInput.projectCategoryNameVi },
					{ "name.en": fallbackEnglishName },
				],
			});

		if (existingCategory) {
			return {
				success: false,
				error: "Loại dự án này đã tồn tại. Vui lòng nhập tên khác.",
			};
		}

		const now = new Date();

		const newCategory: ProjectCategoryDocument = {
			id: randomUUID(),
			name: {
				vi: categoryInput.projectCategoryNameVi,
				en: fallbackEnglishName,
			},
			createdAt: now,
			updatedAt: now,
		};

		await db.collection<ProjectCategoryDocument>("projectCategories").insertOne(newCategory);

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

		console.error("Error creating project category:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi tạo loại dự án. Vui lòng thử lại.",
		};
	}
}