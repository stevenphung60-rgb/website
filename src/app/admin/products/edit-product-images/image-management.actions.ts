"use server";

import { chunk } from "lodash";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { S3UploadResult } from "src/lib/s3";
import { deleteFromS3, uploadToS3 } from "src/lib/s3";
import type { ProductDocument, ProductImage } from "src/server/products";

interface DeletedImageInput {
	id: string;
	name?: string;
}

interface UpdateImagesInput {
	productId: string;
	newImages: File[];
	deletedImages: DeletedImageInput[];
	mainImageIndex: string;
}

interface UploadedImageWithIndex extends ProductImage {
	index: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const BATCH_SIZE = 10;

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const updateImagesSchema = z.object({
	productId: z.string().trim().min(1, "Không tìm thấy ID sản phẩm"),
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
 * Generate product image storage key
 * @param productId - Product ID
 * @param fileName - Uploaded file name
 * @param index - File index
 * @returns Storage key for product image
 */
function generateProductS3Key(productId: string, fileName: string, index: number): string {
	const timestamp = Date.now();
	const fileExtension = fileName.split(".").pop() || "jpg";

	return `products/${productId}/${timestamp}-${index}.${fileExtension}`;
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
			return "Ảnh sản phẩm chỉ hỗ trợ JPG, PNG, WEBP hoặc GIF";
		}

		if (image.size > MAX_FILE_SIZE) {
			return "Mỗi ảnh sản phẩm không được vượt quá 10MB";
		}
	}

	return null;
}

/**
 * Extract and validate image update input
 * @param formData - Submitted form data
 * @returns Parsed input or error result
 */
function extractUpdateImagesInput(
	formData: FormData,
): FormResult & { data?: UpdateImagesInput } {
	const parsedFields = updateImagesSchema.safeParse({
		productId: getFormString(formData, "productId"),
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
			productId: parsedFields.data.productId,
			newImages,
			deletedImages: parseDeletedImages(getFormString(formData, "deletedImages")),
			mainImageIndex: parsedFields.data.mainImageIndex,
		},
	};
}

/**
 * Upload product images in batches
 * @param productId - Product ID
 * @param images - Image files to upload
 * @returns Uploaded product image records
 */
async function uploadProductImages(productId: string, images: File[]): Promise<ProductImage[]> {
	if (images.length === 0) {
		return [];
	}

	const imageBatches = chunk(images, BATCH_SIZE);
	const uploadedImages: ProductImage[] = [];

	for (const [batchIndex, batchImages] of imageBatches.entries()) {
		const startIndex = batchIndex * BATCH_SIZE;

		const uploadPromises = batchImages.map(async (file, index): Promise<UploadedImageWithIndex> => {
			const globalIndex = startIndex + index;
			const s3Key = generateProductS3Key(productId, file.name, globalIndex);
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
 * Delete product images from storage
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
					console.error(`Error deleting product image ${key}:`, error);
				}
			}),
		);
	}
}

/**
 * Cleanup newly uploaded images when database update fails
 * @param images - Uploaded product images
 * @returns Promise that resolves after cleanup attempts
 */
async function cleanupUploadedImages(images: ProductImage[]): Promise<void> {
	await deleteImagesFromStorage(images.map((image) => image.key));
}

/**
 * Set main image by index
 * @param images - Product image list
 * @param mainImageIndex - Main image index from form data
 */
function setMainImage(images: ProductImage[], mainImageIndex: string): void {
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
 * Revalidate product pages after image changes
 * @param productId - Product ID
 */
function revalidateProductImages(productId: string): void {
	revalidateTag(CACHE_TAGS.PRODUCTS, "max");
	revalidatePath("/admin/products");
	revalidatePath("/vi/products");
	revalidatePath("/en/products");
	revalidatePath(`/vi/products/${productId}`);
	revalidatePath(`/en/products/${productId}`);
}

/**
 * Update product images with new uploads, deletions, and main image selection
 * @param formData - Form data containing product ID, new images, deleted images, and main image index
 * @returns Form result for the admin UI
 */
export async function updateProductImages(formData: FormData): Promise<FormResult> {
	const inputResult = extractUpdateImagesInput(formData);

	if (!inputResult.success || !inputResult.data) {
		return inputResult;
	}

	const { productId, newImages, deletedImages, mainImageIndex } = inputResult.data;
	const db = await getDatabase();
	const productsCollection = db.collection<ProductDocument>("products");

	try {
		const existingProduct = await productsCollection.findOne({ id: productId });

		if (!existingProduct) {
			return {
				success: false,
				error: "Không tìm thấy sản phẩm cần cập nhật ảnh",
			};
		}

		const deletedImageKeys = deletedImages.map((image) => image.id);
		const remainingExistingImages = (existingProduct.gallery || []).filter(
			(image) => !deletedImageKeys.includes(image.key),
		);

		const uploadedNewImages = await uploadProductImages(productId, newImages);
		const updatedImages: ProductImage[] = [...remainingExistingImages, ...uploadedNewImages];

		if (updatedImages.length === 0) {
			await cleanupUploadedImages(uploadedNewImages);

			return {
				success: false,
				error: "Sản phẩm cần ít nhất 1 ảnh. Vui lòng giữ lại hoặc tải thêm ảnh mới.",
			};
		}

		setMainImage(updatedImages, mainImageIndex);

		const updateResult = await productsCollection.updateOne(
			{ id: productId },
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
				error: "Không tìm thấy sản phẩm cần cập nhật ảnh",
			};
		}

		await deleteImagesFromStorage(deletedImageKeys);
		revalidateProductImages(productId);

		return {
			success: true,
			refresh: true,
		};
	} catch (error) {
		console.error("Error updating product images:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi cập nhật ảnh sản phẩm. Vui lòng thử lại.",
		};
	}
}