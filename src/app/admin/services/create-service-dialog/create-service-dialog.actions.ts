"use server";

import { randomUUID } from "crypto";
import { chunk } from "lodash";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { S3UploadResult } from "src/lib/s3";
import { deleteFromS3, uploadToS3 } from "src/lib/s3";
import type { ServiceDocument, ServiceImage } from "src/server/services";
import { ServiceStatus } from "src/server/services";

interface CreateServiceInput {
	serviceNameVi: string;
	serviceNameEn: string;
	serviceDescriptionVi: string;
	serviceDescriptionEn: string;
	serviceStatus: ServiceStatus;
}

interface UploadedServiceImageWithIndex extends ServiceImage {
	index: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const BATCH_SIZE = 10;

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const createServiceSchema = z.object({
	serviceNameVi: z.string().trim().min(1, "Tên dịch vụ tiếng Việt là bắt buộc"),
	serviceNameEn: z.string().trim().optional().default(""),
	serviceDescriptionVi: z.string().trim().min(1, "Mô tả tiếng Việt là bắt buộc"),
	serviceDescriptionEn: z.string().trim().optional().default(""),
	serviceStatus: z.nativeEnum(ServiceStatus, {
		errorMap: () => ({ message: "Trạng thái dịch vụ không hợp lệ" }),
	}),
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
 * Generate service image storage key
 * @param serviceId - Service ID
 * @param fileName - Uploaded file name
 * @param index - File index in gallery
 * @returns Storage key for the service image
 */
function generateServiceS3Key(serviceId: string, fileName: string, index: number): string {
	const timestamp = Date.now();
	const fileExtension = fileName.split(".").pop() || "jpg";

	return `services/${serviceId}/${timestamp}-${index}.${fileExtension}`;
}

/**
 * Parse service form data
 * @param formData - Submitted form data
 * @returns Parsed and validated service input
 */
function parseServiceInput(formData: FormData): CreateServiceInput {
	return createServiceSchema.parse({
		serviceNameVi: getFormString(formData, "serviceNameVi"),
		serviceNameEn: getFormString(formData, "serviceNameEn"),
		serviceDescriptionVi: getFormString(formData, "serviceDescriptionVi"),
		serviceDescriptionEn: getFormString(formData, "serviceDescriptionEn"),
		serviceStatus: getFormString(formData, "serviceStatus"),
	});
}

/**
 * Get service image files from form data
 * @param formData - Submitted form data
 * @returns Valid file objects from form data
 */
function getServiceImages(formData: FormData): File[] {
	return (formData.getAll("serviceImages") as File[]).filter((file) => file.size > 0);
}

/**
 * Validate uploaded service images
 * @param images - Service image files
 * @returns Error message when invalid, otherwise null
 */
function validateServiceImages(images: File[]): string | null {
	if (images.length === 0) {
		return "Vui lòng tải lên ít nhất 1 ảnh dịch vụ";
	}

	for (const image of images) {
		if (!allowedImageTypes.includes(image.type)) {
			return "Ảnh dịch vụ chỉ hỗ trợ JPG, PNG, WEBP hoặc GIF";
		}

		if (image.size > MAX_FILE_SIZE) {
			return "Mỗi ảnh dịch vụ không được vượt quá 5MB";
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
 * Delete uploaded images when service creation fails
 * @param images - Uploaded service images
 */
async function cleanupUploadedImages(images: ServiceImage[]): Promise<void> {
	await Promise.all(
		images.map(async (image) => {
			try {
				await deleteFromS3(image.key);
			} catch (error) {
				console.error(`Error cleaning up uploaded service image ${image.key}:`, error);
			}
		}),
	);
}

/**
 * Upload service images in batches
 * @param serviceId - Service ID
 * @param images - Image files to upload
 * @param mainImageIndex - Selected main image index
 * @returns Uploaded service image data
 */
async function uploadServiceImages(
	serviceId: string,
	images: File[],
	mainImageIndex: number,
): Promise<ServiceImage[]> {
	const imageBatches = chunk(images, BATCH_SIZE);
	const uploadedImages: ServiceImage[] = [];

	for (const [batchIndex, batchImages] of imageBatches.entries()) {
		const startIndex = batchIndex * BATCH_SIZE;

		try {
			const batchUploadPromises = batchImages.map(
				async (file, index): Promise<UploadedServiceImageWithIndex> => {
					const globalIndex = startIndex + index;
					const s3Key = generateServiceS3Key(serviceId, file.name, globalIndex);
					const uploadResult: S3UploadResult = await uploadToS3(file, s3Key);

					return {
						key: uploadResult.key,
						url: uploadResult.url,
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
 * Revalidate service-related pages after mutation
 */
function revalidateServicePages(): void {
	revalidateTag(CACHE_TAGS.SERVICES, "max");
	revalidatePath("/admin/services");
	revalidatePath("/vi/services");
	revalidatePath("/en/services");
}

/**
 * Create a service from admin form data
 * @param formData - Submitted service form data
 * @returns Form result for the admin UI
 */
export async function createService(formData: FormData): Promise<FormResult> {
	let uploadedImages: ServiceImage[] = [];

	try {
		const serviceInput = parseServiceInput(formData);
		const serviceImages = getServiceImages(formData);
		const imageError = validateServiceImages(serviceImages);

		if (imageError) {
			return {
				success: false,
				error: imageError,
			};
		}

		const serviceId = randomUUID();
		const mainImageIndex = getSelectedImageIndex(formData);
		uploadedImages = await uploadServiceImages(serviceId, serviceImages, mainImageIndex);

		const now = new Date();

		const service: ServiceDocument = {
			id: serviceId,
			name: {
				vi: serviceInput.serviceNameVi,
				en: serviceInput.serviceNameEn || serviceInput.serviceNameVi,
			},
			description: {
				vi: serviceInput.serviceDescriptionVi,
				en: serviceInput.serviceDescriptionEn || serviceInput.serviceDescriptionVi,
			},
			status: serviceInput.serviceStatus,
			gallery: uploadedImages,
			createdAt: now,
			updatedAt: now,
		};

		const db = await getDatabase();
		const result = await db.collection<ServiceDocument>("services").insertOne(service);

		if (!result.insertedId) {
			await cleanupUploadedImages(uploadedImages);

			return {
				success: false,
				error: "Không thể lưu dịch vụ vào cơ sở dữ liệu",
			};
		}

		revalidateServicePages();

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

		console.error("Error creating service:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi tạo dịch vụ. Vui lòng thử lại.",
		};
	}
}