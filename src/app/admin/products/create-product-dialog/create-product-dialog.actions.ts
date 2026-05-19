"use server";

import { chunk } from "lodash";
import { nanoid } from "nanoid";
import { revalidatePath, revalidateTag } from "next/cache";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { S3UploadResult } from "src/lib/s3";
import { uploadToS3 } from "src/lib/s3";
import type { Product, ProductDocument, ProductImage } from "src/server/products";
import { ProductStatus } from "src/server/products";

function generateProductS3Key(productId: string, fileName: string, index: number = 0): string {
	const timestamp = Date.now();
	const fileExtension = fileName.split(".").pop();
	const uniqueKey = `${timestamp}-${index}`;

	return `products/${productId}/${uniqueKey}.${fileExtension}`;
}

export async function createProduct(formData: FormData): Promise<FormResult> {
	try {
		const productCode = formData.get("productCode") as string;
		const productNameEn = formData.get("productNameEn") as string;
		const productNameVi = formData.get("productNameVi") as string;
		const productDescriptionEn = formData.get("productDescriptionEn") as string;
		const productDescriptionVi = formData.get("productDescriptionVi") as string;
		const productStatus = formData.get("productStatus") as string;
		const productCategoryId = (formData.get("productCategoryId") as string) || "";
		const productImages = formData.getAll("productImages") as File[];
		const selectedImageIndex = formData.get("selectedImageIndex") as string;

		if (productImages.length === 0) {
			return {
				success: false,
				error: "At least one product image is required",
			};
		}

		if (!selectedImageIndex) {
			return {
				success: false,
				error: "Select a main image",
			};
		}

		const missingFields: string[] = [];

		if (!productCode) missingFields.push("Product Code");
		if (!productNameEn) missingFields.push("Product Name (English)");
		if (!productNameVi) missingFields.push("Product Name (Vietnamese)");
		if (!productDescriptionEn) missingFields.push("Product Description (English)");
		if (!productDescriptionVi) missingFields.push("Product Description (Vietnamese)");
		if (!productStatus) missingFields.push("Product Status");

		if (missingFields.length > 0) {
			return {
				success: false,
				error: `Please fill in the following required fields: ${missingFields.join(", ")}`,
			};
		}

		if (!Object.values(ProductStatus).includes(productStatus as ProductStatus)) {
			throw new Error("Invalid product status");
		}

		const productId = nanoid();
		const batchSize = 10;
		const imageBatches = chunk(productImages, batchSize);
		const uploadedImages: ProductImage[] = [];

		for (const [batchIndex, batchImages] of imageBatches.entries()) {
			const startIndex = batchIndex * batchSize;

			const batchUploadPromises = batchImages.map(async (file, i) => {
				const globalIndex = startIndex + i;
				const s3Key = generateProductS3Key(productId, file.name, globalIndex);
				const uploadResult: S3UploadResult = await uploadToS3(file, s3Key);
				const mainImageIndex = parseInt(selectedImageIndex, 10);

				return {
					key: uploadResult.key,
					url: uploadResult.url,
					isMain: globalIndex === mainImageIndex,
					uploadedAt: new Date(),
					index: globalIndex,
				};
			});

			try {
				const batchResults = await Promise.all(batchUploadPromises);
				const sortedBatchResults = batchResults
					.sort((a, b) => a.index - b.index)
					.map(({ index, ...image }) => image);

				uploadedImages.push(...sortedBatchResults);
			} catch {
				return {
					success: false,
					error: "Failed to upload images",
				};
			}
		}

		const product: Product = {
			id: productId,
			code: productCode,
			name: {
				en: productNameEn,
				vi: productNameVi,
			},
			categoryId: productCategoryId || undefined,
			description: {
				en: productDescriptionEn,
				vi: productDescriptionVi,
			},
			status: productStatus as ProductStatus,
			gallery: uploadedImages,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const db = await getDatabase();
		const result = await db.collection<ProductDocument>("products").insertOne(product);

		if (!result.insertedId) {
			return {
				success: false,
				error: "Failed to save product to database",
			};
		}

		revalidateTag(CACHE_TAGS.PRODUCTS, "max");
		revalidatePath("/admin/products");

		return {
			success: true,
			refresh: true,
		};
	} catch {
		return {
			success: false,
			error: "An unexpected error occurred while creating the product",
		};
	}
}