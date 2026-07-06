"use server";

import { chunk } from "lodash";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { S3UploadResult } from "src/lib/s3";
import { deleteFromS3, uploadToS3 } from "src/lib/s3";
import type { ProjectDocument, ProjectImageDocument } from "src/server/projects";

interface DeletedImageInput {
	id: string;
	name?: string;
}

interface UpdateProjectImagesInput {
	projectId: string;
	newImages: File[];
	deletedImages: DeletedImageInput[];
	mainImageIndex: string;
}

interface UploadedProjectImageWithIndex extends ProjectImageDocument {
	index: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const BATCH_SIZE = 10;

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const updateImagesSchema = z.object({
	projectId: z.string().trim().min(1, "Không tìm thấy ID dự án"),
	mainImageIndex: z.string().optional().default(""),
});

const deletedImagesSchema = z.array(
	z.object({
		id: z.string().trim().min(1),
		name: z.string().optional(),
	}),
);

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
 * @param index - File index
 * @returns Storage key for project image
 */
function generateProjectS3Key(projectId: string, fileName: string, index: number): string {
	const timestamp = Date.now();
	const fileExtension = fileName.split(".").pop() || "jpg";

	return `projects/${projectId}/${timestamp}-${index}.${fileExtension}`;
}

/**
 * Get new image files from submitted form data
 * @param formData - Submitted form data
 * @returns Valid file objects from form data
 */
function getNewImageFiles(formData: FormData): File[] {
	return (formData.getAll("newImages") as File[]).filter(
		(file) => file.size > 0 && file.name.trim() !== "",
	);
}

/**
 * Parse deleted image data from hidden form input
 * @param value - Deleted images JSON string
 * @returns Parsed deleted image records
 */
function parseDeletedImages(value: string): DeletedImageInput[] {
	if (!value) {
		return [];
	}

	try {
		const parsed = JSON.parse(value);
		const result = deletedImagesSchema.safeParse(parsed);

		if (!result.success) {
			return [];
		}

		return result.data;
	} catch {
		return [];
	}
}

/**
 * Validate new image files
 * @param images - Uploaded image files
 * @returns Error message when invalid, otherwise null
 */
function validateNewImages(images: File[]): string | null {
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
 * Extract and validate project image update input
 * @param formData - Submitted form data
 * @returns Parsed input or error result
 */
function extractUpdateProjectImagesInput(
	formData: FormData,
): FormResult & { data?: UpdateProjectImagesInput } {
	const parsedFields = updateImagesSchema.safeParse({
		projectId: getFormString(formData, "projectId"),
		mainImageIndex: getFormString(formData, "mainImageIndex"),
	});

	if (!parsedFields.success) {
		return {
			success: false,
			error: parsedFields.error.errors.map((item) => item.message).join(", "),
		};
	}

	const newImages = getNewImageFiles(formData);
	const imageError = validateNewImages(newImages);

	if (imageError) {
		return {
			success: false,
			error: imageError,
		};
	}

	return {
		success: true,
		refresh: true,
		data: {
			projectId: parsedFields.data.projectId,
			newImages,
			deletedImages: parseDeletedImages(getFormString(formData, "deletedImages")),
			mainImageIndex: parsedFields.data.mainImageIndex,
		},
	};
}

/**
 * Upload project images in batches
 * @param projectId - Project ID
 * @param images - Image files to upload
 * @returns Uploaded project image records
 */
async function uploadProjectImages(
	projectId: string,
	images: File[],
): Promise<ProjectImageDocument[]> {
	if (images.length === 0) {
		return [];
	}

	const imageBatches = chunk(images, BATCH_SIZE);
	const uploadedImages: ProjectImageDocument[] = [];

	for (const [batchIndex, batchImages] of imageBatches.entries()) {
		const startIndex = batchIndex * BATCH_SIZE;

		const uploadPromises = batchImages.map(
			async (file, index): Promise<UploadedProjectImageWithIndex> => {
				const globalIndex = startIndex + index;
				const s3Key = generateProjectS3Key(projectId, file.name, globalIndex);
				const uploadResult: S3UploadResult = await uploadToS3(file, s3Key);

				return {
					key: uploadResult.key,
					isMain: false,
					uploadedAt: new Date(),
					index: globalIndex,
				};
			},
		);

		const batchResults = await Promise.all(uploadPromises);
		const sortedBatchResults = batchResults
			.sort((a, b) => a.index - b.index)
			.map(({ index, ...image }) => image);

		uploadedImages.push(...sortedBatchResults);
	}

	return uploadedImages;
}

/**
 * Delete project images from storage
 * @param imageKeys - Image storage keys
 * @returns Promise that resolves after deletion attempts
 */
async function deleteImagesFromStorage(imageKeys: string[]): Promise<void> {
	if (imageKeys.length === 0) {
		return;
	}

	const imageKeyChunks = chunk(imageKeys, 5);

	for (const imageKeyChunk of imageKeyChunks) {
		await Promise.all(
			imageKeyChunk.map(async (key) => {
				try {
					await deleteFromS3(key);
				} catch (error) {
					console.error(`Error deleting project image ${key}:`, error);
				}
			}),
		);
	}
}

/**
 * Cleanup newly uploaded images when database update fails
 * @param images - Uploaded project images
 * @returns Promise that resolves after cleanup attempts
 */
async function cleanupUploadedImages(images: ProjectImageDocument[]): Promise<void> {
	await deleteImagesFromStorage(images.map((image) => image.key));
}

/**
 * Set main image by index
 * @param images - Project image list
 * @param mainImageIndex - Main image index from form data
 */
function setMainImage(images: ProjectImageDocument[], mainImageIndex: string): void {
	if (images.length === 0) {
		return;
	}

	const parsedIndex = Number.parseInt(mainImageIndex, 10);
	const safeIndex =
		Number.isNaN(parsedIndex) || parsedIndex < 0 || parsedIndex >= images.length
			? 0
			: parsedIndex;

	images.forEach((image, index) => {
		image.isMain = index === safeIndex;
	});
}

/**
 * Revalidate project pages after image changes
 * @param projectId - Project ID
 */
function revalidateProjectImages(projectId: string): void {
	revalidateTag(CACHE_TAGS.PROJECTS, "max");
	revalidatePath("/admin/projects");
	revalidatePath("/vi/projects");
	revalidatePath("/en/projects");
	revalidatePath(`/vi/projects/${projectId}`);
	revalidatePath(`/en/projects/${projectId}`);
}

/**
 * Update project images with new uploads, deletions, and main image selection
 * @param formData - Form data containing project ID, new images, deleted images, and main image index
 * @returns Form result for the admin UI
 */
export async function updateProjectImages(formData: FormData): Promise<FormResult> {
	const inputResult = extractUpdateProjectImagesInput(formData);

	if (!inputResult.success || !inputResult.data) {
		return inputResult;
	}

	const { projectId, newImages, deletedImages, mainImageIndex } = inputResult.data;
	const db = await getDatabase();
	const projectsCollection = db.collection<ProjectDocument>("projects");
	let uploadedNewImages: ProjectImageDocument[] = [];

	try {
		const existingProject = await projectsCollection.findOne({ id: projectId });

		if (!existingProject) {
			return {
				success: false,
				error: "Không tìm thấy dự án cần cập nhật ảnh",
			};
		}

		const deletedImageKeys = deletedImages.map((image) => image.id);
		const remainingExistingImages = (existingProject.gallery || []).filter(
			(image) => !deletedImageKeys.includes(image.key),
		);

		uploadedNewImages = await uploadProjectImages(projectId, newImages);
		const updatedImages: ProjectImageDocument[] = [
			...remainingExistingImages,
			...uploadedNewImages,
		];

		if (updatedImages.length === 0) {
			await cleanupUploadedImages(uploadedNewImages);

			return {
				success: false,
				error: "Dự án cần ít nhất 1 ảnh. Vui lòng giữ lại hoặc tải thêm ảnh mới.",
			};
		}

		setMainImage(updatedImages, mainImageIndex);

		const updateResult = await projectsCollection.updateOne(
			{ id: projectId },
			{
				$set: {
					gallery: updatedImages,
					updatedAt: new Date(),
				},
			},
		);

		if (updateResult.matchedCount === 0) {
			await cleanupUploadedImages(uploadedNewImages);

			return {
				success: false,
				error: "Không tìm thấy dự án cần cập nhật ảnh",
			};
		}

		await deleteImagesFromStorage(deletedImageKeys);
		revalidateProjectImages(projectId);

		return {
			success: true,
			refresh: true,
		};
	} catch (error) {
		if (uploadedNewImages.length > 0) {
			await cleanupUploadedImages(uploadedNewImages);
		}

		console.error("Error updating project images:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi cập nhật ảnh dự án. Vui lòng thử lại.",
		};
	}
}