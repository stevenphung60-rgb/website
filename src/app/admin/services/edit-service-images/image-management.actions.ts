"use server";

import { chunk } from "lodash";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { S3UploadResult } from "src/lib/s3";
import { deleteFromS3, uploadToS3 } from "src/lib/s3";
import type { ServiceDocument, ServiceImage } from "src/server/services";

interface DeletedImageInput {
	id: string;
	name?: string;
}

interface UpdateServiceImagesInput {
	serviceId: string;
	newImages: File[];
	deletedImages: DeletedImageInput[];
	mainImageIndex: string;
}

interface UploadedServiceImageWithIndex extends ServiceImage {
	index: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const BATCH_SIZE = 10;

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const updateImagesSchema = z.object({
	serviceId: z.string().trim().min(1, "Không tìm thấy ID dịch vụ"),
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
 * Generate service image storage key
 * @param serviceId - Service ID
 * @param fileName - Uploaded file name
 * @param index - File index
 * @returns Storage key for service image
 */
function generateServiceS3Key(serviceId: string, fileName: string, index: number): string {
	const timestamp = Date.now();
	const fileExtension = fileName.split(".").pop() || "jpg";

	return `services/${serviceId}/${timestamp}-${index}.${fileExtension}`;
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
			return "Ảnh dịch vụ chỉ hỗ trợ JPG, PNG, WEBP hoặc GIF";
		}

		if (image.size > MAX_FILE_SIZE) {
			return "Mỗi ảnh dịch vụ không được vượt quá 10MB";
		}
	}

	return null;
}

/**
 * Extract and validate service image update input
 * @param formData - Submitted form data
 * @returns Parsed input or error result
 */
function extractUpdateServiceImagesInput(
	formData: FormData,
): FormResult & { data?: UpdateServiceImagesInput } {
	const parsedFields = updateImagesSchema.safeParse({
		serviceId: getFormString(formData, "serviceId"),
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
			serviceId: parsedFields.data.serviceId,
			newImages,
			deletedImages: parseDeletedImages(getFormString(formData, "deletedImages")),
			mainImageIndex: parsedFields.data.mainImageIndex,
		},
	};
}

/**
 * Upload service images in batches
 * @param serviceId - Service ID
 * @param images - Image files to upload
 * @returns Uploaded service image records
 */
async function uploadServiceImages(serviceId: string, images: File[]): Promise<ServiceImage[]> {
	if (images.length === 0) {
		return [];
	}

	const imageBatches = chunk(images, BATCH_SIZE);
	const uploadedImages: ServiceImage[] = [];

	for (const [batchIndex, batchImages] of imageBatches.entries()) {
		const startIndex = batchIndex * BATCH_SIZE;

		const uploadPromises = batchImages.map(async (file, index): Promise<UploadedServiceImageWithIndex> => {
			const globalIndex = startIndex + index;
			const s3Key = generateServiceS3Key(serviceId, file.name, globalIndex);
			const uploadResult: S3UploadResult = await uploadToS3(file, s3Key);

			return {
				key: uploadResult.key,
				url: uploadResult.url,
				isMain: false,
				uploadedAt: new Date(),
				index: globalIndex,
			};
		});

		const batchResults = await Promise.all(uploadPromises);
		const sortedBatchResults = batchResults
			.sort((a, b) => a.index - b.index)
			.map(({ index, ...image }) => image);

		uploadedImages.push(...sortedBatchResults);
	}

	return uploadedImages;
}

/**
 * Delete service images from storage
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
					console.error(`Error deleting service image ${key}:`, error);
				}
			}),
		);
	}
}

/**
 * Cleanup newly uploaded images when database update fails
 * @param images - Uploaded service images
 * @returns Promise that resolves after cleanup attempts
 */
async function cleanupUploadedImages(images: ServiceImage[]): Promise<void> {
	await deleteImagesFromStorage(images.map((image) => image.key));
}

/**
 * Set main image by index
 * @param images - Service image list
 * @param mainImageIndex - Main image index from form data
 */
function setMainImage(images: ServiceImage[], mainImageIndex: string): void {
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
 * Revalidate service pages after image changes
 * @param serviceId - Service ID
 */
function revalidateServiceImages(serviceId: string): void {
	revalidateTag(CACHE_TAGS.SERVICES, "max");
	revalidatePath("/admin/services");
	revalidatePath("/vi/services");
	revalidatePath("/en/services");
	revalidatePath(`/vi/services/${serviceId}`);
	revalidatePath(`/en/services/${serviceId}`);
}

/**
 * Update service images with new uploads, deletions, and main image selection
 * @param formData - Form data containing service ID, new images, deleted images, and main image index
 * @returns Form result for the admin UI
 */
export async function updateServiceImages(formData: FormData): Promise<FormResult> {
	const inputResult = extractUpdateServiceImagesInput(formData);

	if (!inputResult.success || !inputResult.data) {
		return inputResult;
	}

	const { serviceId, newImages, deletedImages, mainImageIndex } = inputResult.data;
	const db = await getDatabase();
	const servicesCollection = db.collection<ServiceDocument>("services");
	let uploadedNewImages: ServiceImage[] = [];

	try {
		const existingService = await servicesCollection.findOne({ id: serviceId });

		if (!existingService) {
			return {
				success: false,
				error: "Không tìm thấy dịch vụ cần cập nhật ảnh",
			};
		}

		const deletedImageKeys = deletedImages.map((image) => image.id);
		const remainingExistingImages = (existingService.gallery || []).filter(
			(image) => !deletedImageKeys.includes(image.key),
		);

		uploadedNewImages = await uploadServiceImages(serviceId, newImages);
		const updatedImages: ServiceImage[] = [...remainingExistingImages, ...uploadedNewImages];

		if (updatedImages.length === 0) {
			await cleanupUploadedImages(uploadedNewImages);

			return {
				success: false,
				error: "Dịch vụ cần ít nhất 1 ảnh. Vui lòng giữ lại hoặc tải thêm ảnh mới.",
			};
		}

		setMainImage(updatedImages, mainImageIndex);

		const updateResult = await servicesCollection.updateOne(
			{ id: serviceId },
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
				error: "Không tìm thấy dịch vụ cần cập nhật ảnh",
			};
		}

		await deleteImagesFromStorage(deletedImageKeys);
		revalidateServiceImages(serviceId);

		return {
			success: true,
			refresh: true,
		};
	} catch (error) {
		if (uploadedNewImages.length > 0) {
			await cleanupUploadedImages(uploadedNewImages);
		}

		console.error("Error updating service images:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi cập nhật ảnh dịch vụ. Vui lòng thử lại.",
		};
	}
}