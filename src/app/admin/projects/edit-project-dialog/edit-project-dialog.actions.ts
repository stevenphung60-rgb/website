"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { ProjectDocument } from "src/server/projects";
import {
	ProjectCompletionStatus,
	ProjectVisibilityStatus,
} from "src/server/projects";

interface ProjectSpecInput {
	vi: string;
	en: string;
}

interface UpdateProjectInput {
	projectId: string;
	projectNameVi: string;
	projectNameEn: string;
	projectCategoryId?: string;
	projectLocationVi: string;
	projectLocationEn: string;
	projectYearVi: string;
	projectYearEn: string;
	projectDescriptionVi: string;
	projectDescriptionEn: string;
	projectVisibilityStatus: ProjectVisibilityStatus;
	projectCompletionStatus: ProjectCompletionStatus;
	projectSpecs: ProjectSpecInput[];
}

const projectSpecSchema = z.object({
	vi: z.string().trim().optional().default(""),
	en: z.string().trim().optional().default(""),
});

const updateProjectSchema = z.object({
	projectId: z.string().trim().min(1, "Không tìm thấy ID dự án"),
	projectNameVi: z.string().trim().min(1, "Tên dự án tiếng Việt là bắt buộc"),
	projectNameEn: z.string().trim().optional().default(""),
	projectCategoryId: z.string().trim().optional().default(""),
	projectLocationVi: z.string().trim().min(1, "Địa điểm tiếng Việt là bắt buộc"),
	projectLocationEn: z.string().trim().optional().default(""),
	projectYearVi: z.string().trim().min(1, "Năm tiếng Việt là bắt buộc"),
	projectYearEn: z.string().trim().optional().default(""),
	projectDescriptionVi: z.string().trim().min(1, "Mô tả tiếng Việt là bắt buộc"),
	projectDescriptionEn: z.string().trim().optional().default(""),
	projectVisibilityStatus: z.nativeEnum(ProjectVisibilityStatus, {
		errorMap: () => ({ message: "Trạng thái hiển thị không hợp lệ" }),
	}),
	projectCompletionStatus: z.nativeEnum(ProjectCompletionStatus, {
		errorMap: () => ({ message: "Tiến độ dự án không hợp lệ" }),
	}),
	projectSpecs: z.array(projectSpecSchema).optional().default([]),
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
 * Parse project specifications from form data
 * @param value - Project specifications JSON string
 * @returns Project specification array
 */
function parseProjectSpecs(value: string): ProjectSpecInput[] {
	if (!value) {
		return [];
	}

	try {
		const parsed = JSON.parse(value);
		const result = z.array(projectSpecSchema).safeParse(parsed);

		if (!result.success) {
			return [];
		}

		return result.data;
	} catch {
		return [];
	}
}

/**
 * Normalize project specs and fallback missing translations
 * @param specs - Raw project specs
 * @returns Valid project specs for database
 */
function normalizeProjectSpecs(specs: ProjectSpecInput[]): ProjectSpecInput[] {
	return specs
		.map((spec) => {
			const vi = spec.vi.trim();
			const en = spec.en.trim();

			return {
				vi: vi || en,
				en: en || vi,
			};
		})
		.filter((spec) => spec.vi || spec.en);
}

/**
 * Parse and validate project update form data
 * @param formData - Submitted form data
 * @returns Validated project update input
 */
function parseProjectInput(formData: FormData): UpdateProjectInput {
	const parsed = updateProjectSchema.parse({
		projectId: getFormString(formData, "projectId"),
		projectNameVi: getFormString(formData, "projectNameVi"),
		projectNameEn: getFormString(formData, "projectNameEn"),
		projectCategoryId: getFormString(formData, "projectCategoryId"),
		projectLocationVi: getFormString(formData, "projectLocationVi"),
		projectLocationEn: getFormString(formData, "projectLocationEn"),
		projectYearVi: getFormString(formData, "projectYearVi"),
		projectYearEn: getFormString(formData, "projectYearEn"),
		projectDescriptionVi: getFormString(formData, "projectDescriptionVi"),
		projectDescriptionEn: getFormString(formData, "projectDescriptionEn"),
		projectVisibilityStatus: getFormString(formData, "projectVisibilityStatus"),
		projectCompletionStatus: getFormString(formData, "projectCompletionStatus"),
		projectSpecs: parseProjectSpecs(getFormString(formData, "projectSpecs")),
	});

	return {
		...parsed,
		projectSpecs: normalizeProjectSpecs(parsed.projectSpecs),
	};
}

/**
 * Revalidate project-related pages after mutation
 * @param projectId - Updated project ID
 */
function revalidateProjectPages(projectId: string): void {
	revalidateTag(CACHE_TAGS.PROJECTS, "max");
	revalidatePath("/admin/projects");
	revalidatePath("/vi/projects");
	revalidatePath("/en/projects");
	revalidatePath(`/vi/projects/${projectId}`);
	revalidatePath(`/en/projects/${projectId}`);
}

/**
 * Update an existing project from admin form data
 * @param formData - Submitted project form data
 * @returns Form result for the admin UI
 */
export async function updateProject(formData: FormData): Promise<FormResult> {
	try {
		const projectInput = parseProjectInput(formData);
		const db = await getDatabase();
		const projectsCollection = db.collection<ProjectDocument>("projects");

		const existingProject = await projectsCollection.findOne({
			id: projectInput.projectId,
		});

		if (!existingProject) {
			return {
				success: false,
				error: "Không tìm thấy dự án cần cập nhật",
			};
		}

		const result = await projectsCollection.updateOne(
			{ id: projectInput.projectId },
			{
				$set: {
					name: {
						vi: projectInput.projectNameVi,
						en: projectInput.projectNameEn || projectInput.projectNameVi,
					},
					categoryId: projectInput.projectCategoryId || null,
					location: {
						vi: projectInput.projectLocationVi,
						en:
							projectInput.projectLocationEn ||
							projectInput.projectLocationVi,
					},
					year: {
						vi: projectInput.projectYearVi,
						en: projectInput.projectYearEn || projectInput.projectYearVi,
					},
					description: {
						vi: projectInput.projectDescriptionVi,
						en:
							projectInput.projectDescriptionEn ||
							projectInput.projectDescriptionVi,
					},
					specs: projectInput.projectSpecs,
					visibilityStatus: projectInput.projectVisibilityStatus,
					completionStatus: projectInput.projectCompletionStatus,
					updatedAt: new Date(),
				},
			},
		);

		if (result.matchedCount === 0) {
			return {
				success: false,
				error: "Không tìm thấy dự án cần cập nhật",
			};
		}

		revalidateProjectPages(projectInput.projectId);

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

		console.error("Error updating project:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi cập nhật dự án. Vui lòng thử lại.",
		};
	}
}