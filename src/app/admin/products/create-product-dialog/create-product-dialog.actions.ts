"use server";

import { randomUUID } from "crypto";
import { chunk } from "lodash";
import { revalidatePath, revalidateTag } from "next/cache";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { S3UploadResult } from "src/lib/s3";
import { uploadToS3 } from "src/lib/s3";
import type { ProductDocument, ProductImage } from "src/server/products";
import { ProductStatus } from "src/server/products";
import { z } from "zod";

interface CreateProductInput {
	productCode: string;
	productNameVi: string;
	productNameEn: string;
	productDescriptionVi: string;
	productDescriptionEn: string;
	productStatus: ProductStatus;
	productCategoryId?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const BATCH_SIZE = 10;

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const createProductSchema = z.object({
	productCode: z.string().trim().min(1, "Mã sản phẩm là bắt buộc"),
	productNameVi: z.string().trim().min(1, "Tên sản phẩm tiếng Việt là bắt buộc"),
	productNameEn: z.string().trim().optional().default(""),
	productDescriptionVi: z.string().trim().min(1, "Mô tả tiếng Việt là bắt buộc"),
	productDescriptionEn: z.string().trim().optional().default(""),
	productStatus: z.nativeEnum(ProductStatus, {
		errorMap: () => ({ message: "Trạng thái sản phẩm không hợp lệ" }),
	}),
	productCategoryId: z.string().trim().optional().default(""),
});

/**
 * Generate product image storage key
 * @param productId - Product ID
 * @param fileName - Uploaded file name
 * @param index - File index in gallery
 * @returns Storage key for the product image
 */
function generateProductS3Key(productId: string, fileName: string, index: number): string {
	const timestamp = Date.now();
	const fileExtension = fileName.split(".").pop() || "jpg";

	return `products/${productId}/${timestamp}-${index}.${fileExtension}`;
}

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
 * Parse product form data
 * @param formData - Submitted form data
 * @returns Parsed and validated product input
 */
function parseProductInput(formData: FormData): CreateProductInput {
	return createProductSchema.parse({
		productCode: getFormString(formData, "productCode"),
		productNameVi: getFormString(formData, "productNameVi"),
		productNameEn: getFormString(formData, "productNameEn"),
		productDescriptionVi: getFormString(formData, "productDescriptionVi"),
		productDescriptionEn: getFormString(formData, "productDescriptionEn"),
		productStatus: getFormString(formData, "productStatus"),
		productCategoryId: getFormString(formData, "productCategoryId"),
	});
}

/**
 * Get product image files from form data
 * @param formData - Submitted form data
 * @returns Valid file objects from form data
 */
function getProductImages(formData: FormData): File[] {
	return (formData.getAll("productImages") as File[]).filter((file) => file.size > 0);
}

/**
 * Validate uploaded product images
 * @param images - Product image files
 * @returns Error message when invalid, otherwise null
 */
function validateProductImages(images: File[]): string | null {
	if (images.length === 0) {
		return "Vui lòng tải lên ít nhất 1 ảnh sản phẩm";
	}

	for (const image of images) {
		if (!allowedImageTypes.includes(image.type)) {
			return "Ảnh sản phẩm chỉ hỗ trợ JPG, PNG, WEBP hoặc GIF";
		}

		if (image.size > MAX_FILE_SIZE) {
			return "Mỗi ảnh sản phẩm không được vượt quá 5MB";
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
 * Upload product images in batches
 * @param productId - Product ID
 * @param images - Image files to upload
 * @param mainImageIndex - Selected main image index
 * @returns Uploaded product image data
 */
async function uploadProductImages(
	productId: string,
	images: File[],
	mainImageIndex: number,
): Promise<ProductImage[]> {
	const imageBatches = chunk(images, BATCH_SIZE);
	const uploadedImages: ProductImage[] = [];

	for (const [batchIndex, batchImages] of imageBatches.entries()) {
		const startIndex = batchIndex * BATCH_SIZE;

		const batchUploadPromises = batchImages.map(async (file, index) => {
			const globalIndex = startIndex + index;
			const s3Key = generateProductS3Key(productId, file.name, globalIndex);
			const uploadResult: S3UploadResult = await uploadToS3(file, s3Key);

			return {
				key: uploadResult.key,
				url: uploadResult.url,
				isMain: globalIndex === mainImageIndex,
				uploadedAt: new Date(),
				index: globalIndex,
			};
		});

		const batchResults = await Promise.all(batchUploadPromises);
		const sortedBatchResults = batchResults
			.sort((a, b) => a.index - b.index)
			.map(({ index, ...image }) => image);

		uploadedImages.push(...sortedBatchResults);
	}

	if (!uploadedImages.some((image) => image.isMain) && uploadedImages[0]) {
		uploadedImages[0].isMain = true;
	}

	return uploadedImages;
}

/**
 * Create a product from admin form data
 * @param formData - Submitted product form data
 * @returns Form result for the admin UI
 */
export async function createProduct(formData: FormData): Promise<FormResult> {
	try {
		const productInput = parseProductInput(formData);
		const productImages = getProductImages(formData);
		const imageError = validateProductImages(productImages);

		if (imageError) {
			return {
				success: false,
				error: imageError,
			};
		}

		const db = await getDatabase();
		const existingProduct = await db.collection<ProductDocument>("products").findOne({
			code: productInput.productCode,
		});

		if (existingProduct) {
			return {
				success: false,
				error: "Mã sản phẩm đã tồn tại. Vui lòng nhập mã sản phẩm khác.",
			};
		}

		const productId = randomUUID();
		const mainImageIndex = getSelectedImageIndex(formData);
		const uploadedImages = await uploadProductImages(productId, productImages, mainImageIndex);
		const now = new Date();

		const product: ProductDocument = {
			id: productId,
			code: productInput.productCode,
			name: {
				vi: productInput.productNameVi,
				en: productInput.productNameEn || productInput.productNameVi,
			},
			categoryId: productInput.productCategoryId || undefined,
			description: {
				vi: productInput.productDescriptionVi,
				en: productInput.productDescriptionEn || productInput.productDescriptionVi,
			},
			status: productInput.productStatus,
			gallery: uploadedImages,
			createdAt: now,
			updatedAt: now,
		};

		const result = await db.collection<ProductDocument>("products").insertOne(product);

		if (!result.insertedId) {
			return {
				success: false,
				error: "Không thể lưu sản phẩm vào cơ sở dữ liệu",
			};
		}

		revalidateTag(CACHE_TAGS.PRODUCTS, "max");
		revalidatePath("/admin/products");

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

		console.error("Error creating product:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi tạo sản phẩm. Vui lòng thử lại.",
		};
	}
}