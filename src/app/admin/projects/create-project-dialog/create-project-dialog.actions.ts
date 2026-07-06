"use server";

import { randomUUID } from "crypto";
import { chunk } from "lodash";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import { deleteFromS3, uploadToS3 } from "src/lib/s3";
import type { ProjectDocument, ProjectImageDocument } from "src/server/projects";
import {
	ProjectCompletionStatus,
	ProjectVisibilityStatus,
} from "src/server/projects";

interface CreateProjectInput {
	projectNameVi: string;
	projectNameEn: string;
	projectCategoryId?: string;
	projectLocationVi: string;
	projectLocationEn: string;
	projectYearVi: string;
	projectYearEn: string;
	projectDescriptionVi: string;
	projectDescriptionEn: string;
	visibilityStatus: ProjectVisibilityStatus;
	completionStatus: ProjectCompletionStatus;
	projectSpecs: ProjectSpecInput[];
}

interface ProjectSpecInput {
	vi: string;
	en: string;
}

interface UploadedProjectImageWithIndex extends ProjectImageDocument {
	index: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const BATCH_SIZE = 10;

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const projectSpecSchema = z.object({
	vi: z.string().trim().optional().default(""),
	en: z.string().trim().optional().default(""),
});

const createProjectSchema = z.object({
	projectNameVi: z.string().trim().min(1, "Tên dự án tiếng Việt là bắt buộc"),
	projectNameEn: z.string().trim().optional().default(""),
	projectCategoryId: z.string().trim().optional().default(""),
	projectLocationVi: z.string().trim().min(1, "Địa điểm tiếng Việt là bắt buộc"),
	projectLocationEn: z.string().trim().optional().default(""),
	projectYearVi: z.string().trim().min(1, "Năm tiếng Việt là bắt buộc"),
	projectYearEn: z.string().trim().optional().default(""),
	projectDescriptionVi: z.string().trim().min(1, "Mô tả tiếng Việt là bắt buộc"),
	projectDescriptionEn: z.string().trim().optional().default(""),
	visibilityStatus: z.nativeEnum(ProjectVisibilityStatus, {
		errorMap: () => ({ message: "Trạng thái hiển thị không hợp lệ" }),
	}),
	completionStatus: z.nativeEnum(ProjectCompletionStatus, {
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
 * Generate project image storage key
 * @param projectId - Project ID
 * @param fileName - Uploaded file name
 * @param index - File index in gallery
 * @returns Storage key for the project image
 */
function generateProjectS3Key(projectId: string, fileName: string, index: number): string {
	const timestamp = Date.now();
	const fileExtension = fileName.split(".").pop() || "jpg";

	return `projects/${projectId}/${timestamp}-${index}.${fileExtension}`;
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
 * Parse project form data
 * @param formData - Submitted form data
 * @returns Parsed and validated project input
 */
function parseProjectInput(formData: FormData): CreateProjectInput {
	const parsed = createProjectSchema.parse({
		projectNameVi: getFormString(formData, "projectNameVi"),
		projectNameEn: getFormString(formData, "projectNameEn"),
		projectCategoryId: getFormString(formData, "projectCategoryId"),
		projectLocationVi: getFormString(formData, "projectLocationVi"),
		projectLocationEn: getFormString(formData, "projectLocationEn"),
		projectYearVi: getFormString(formData, "projectYearVi"),
		projectYearEn: getFormString(formData, "projectYearEn"),
		projectDescriptionVi: getFormString(formData, "projectDescriptionVi"),
		projectDescriptionEn: getFormString(formData, "projectDescriptionEn"),
		visibilityStatus: getFormString(formData, "visibilityStatus"),
		completionStatus: getFormString(formData, "completionStatus"),
		projectSpecs: parseProjectSpecs(getFormString(formData, "projectSpecs")),
	});

	return {
		...parsed,
		projectSpecs: normalizeProjectSpecs(parsed.projectSpecs),
	};
}

/**
 * Get project image files from form data
 * @param formData - Submitted form data
 * @returns Valid file objects from form data
 */
function getProjectImages(formData: FormData): File[] {
	return (formData.getAll("projectImages") as File[]).filter((file) => file.size > 0);
}

/**
 * Validate uploaded project images
 * @param images - Project image files
 * @returns Error message when invalid, otherwise null
 */
function validateProjectImages(images: File[]): string | null {
	if (images.length === 0) {
		return "Vui lòng tải lên ít nhất 1 ảnh dự án";
	}

	for (const image of images) {
		if (!allowedImageTypes.includes(image.type)) {
			return "Ảnh dự án chỉ hỗ trợ JPG, PNG, WEBP hoặc GIF";
		}

		if (image.size > MAX_FILE_SIZE) {
			return "Mỗi ảnh dự án không được vượt quá 10MB";
		}
	}

	return null;
}

/**
 * Parse selected main image index
 * @param formData - Submitted form data
 * @returns Main image index, defaults to 0
 */
function getSelectedImageIndex(formData: FormData): number {
	const selectedImageIndex = Number.parseInt(getFormString(formData, "selectedImageIndex"), 10);

	if (Number.isNaN(selectedImageIndex) || selectedImageIndex < 0) {
		return 0;
	}

	return selectedImageIndex;
}

/**
 * Delete uploaded project images when creation fails
 * @param images - Uploaded project images
 * @returns Promise that resolves after cleanup attempts
 */
async function cleanupUploadedImages(images: ProjectImageDocument[]): Promise<void> {
	await Promise.all(
		images.map(async (image) => {
			try {
				await deleteFromS3(image.key);
			} catch (error) {
				console.error(`Error cleaning up uploaded project image ${image.key}:`, error);
			}
		}),
	);
}

/**
 * Upload project images in batches
 * @param projectId - Project ID
 * @param images - Image files to upload
 * @param mainImageIndex - Selected main image index
 * @returns Uploaded project image data
 */
async function uploadProjectImages(
	projectId: string,
	images: File[],
	mainImageIndex: number,
): Promise<ProjectImageDocument[]> {
	const imageBatches = chunk(images, BATCH_SIZE);
	const uploadedImages: ProjectImageDocument[] = [];

	for (const [batchIndex, batchImages] of imageBatches.entries()) {
		const startIndex = batchIndex * BATCH_SIZE;

		try {
			const batchUploadPromises = batchImages.map(
				async (file, index): Promise<UploadedProjectImageWithIndex> => {
					const globalIndex = startIndex + index;
					const s3Key = generateProjectS3Key(projectId, file.name, globalIndex);
					const uploadResult = await uploadToS3(file, s3Key);

					return {
						key: uploadResult.key,
						isMain: globalIndex === mainImageIndex,
						uploadedAt: new Date(),
						index: globalIndex,
					};
				},
			);

			const batchResults = await Promise.all(batchUploadPromises);
			const sortedBatchResults = batchResults
				.sort((a, b) => a.index - b.index)
				.map(({ index, ...image }) => image);

			uploadedImages.push(...sortedBatchResults);
		} catch (error) {
			await cleanupUploadedImages(uploadedImages);
			throw error;
		}
	}

	if (!uploadedImages.some((image) => image.isMain) && uploadedImages[0]) {
		uploadedImages[0].isMain = true;
	}

	return uploadedImages;
}

/**
 * Revalidate project-related pages after mutation
 */
function revalidateProjectPages(): void {
	revalidateTag(CACHE_TAGS.PROJECTS, "max");
	revalidatePath("/admin/projects");
	revalidatePath("/vi/projects");
	revalidatePath("/en/projects");
}

/**
 * Create a project from admin form data
 * @param formData - Submitted project form data
 * @returns Form result for the admin UI
 */
export async function createProject(formData: FormData): Promise<FormResult> {
	let uploadedImages: ProjectImageDocument[] = [];

	try {
		const projectInput = parseProjectInput(formData);
		const projectImages = getProjectImages(formData);
		const imageError = validateProjectImages(projectImages);

		if (imageError) {
			return {
				success: false,
				error: imageError,
			};
		}

		const projectId = randomUUID();
		const mainImageIndex = getSelectedImageIndex(formData);
		uploadedImages = await uploadProjectImages(projectId, projectImages, mainImageIndex);

		const now = new Date();

		const projectDoc: ProjectDocument = {
			id: projectId,
			name: {
				vi: projectInput.projectNameVi,
				en: projectInput.projectNameEn || projectInput.projectNameVi,
			},
			categoryId: projectInput.projectCategoryId || null,
			location: {
				vi: projectInput.projectLocationVi,
				en: projectInput.projectLocationEn || projectInput.projectLocationVi,
			},
			year: {
				vi: projectInput.projectYearVi,
				en: projectInput.projectYearEn || projectInput.projectYearVi,
			},
			description: {
				vi: projectInput.projectDescriptionVi,
				en: projectInput.projectDescriptionEn || projectInput.projectDescriptionVi,
			},
			specs: projectInput.projectSpecs,
			visibilityStatus: projectInput.visibilityStatus,
			completionStatus: projectInput.completionStatus,
			gallery: uploadedImages,
			createdAt: now,
			updatedAt: now,
		};

		const db = await getDatabase();
		const result = await db.collection<ProjectDocument>("projects").insertOne(projectDoc);

		if (!result.insertedId) {
			await cleanupUploadedImages(uploadedImages);

			return {
				success: false,
				error: "Không thể lưu dự án vào cơ sở dữ liệu",
			};
		}

		revalidateProjectPages();

		return {
			success: true,
			refresh: true,
		};
	} catch (error) {
		if (uploadedImages.length > 0) {
			await cleanupUploadedImages(uploadedImages);
		}

		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.errors.map((item) => item.message).join(", "),
			};
		}

		console.error("Error creating project:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi tạo dự án. Vui lòng thử lại.",
		};
	}
}