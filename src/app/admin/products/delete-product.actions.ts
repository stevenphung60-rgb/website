"use server";

import { chunk } from "lodash";
import { revalidatePath, revalidateTag } from "next/cache";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import { deleteFromS3 } from "src/lib/s3";
import type { ProductDocument, ProductImageDocument } from "src/server/products";
import { z } from "zod";

const deleteProductSchema = z.object({
	productId: z.string().trim().min(1, "Không tìm thấy ID sản phẩm cần xóa"),
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
 * Delete product images from storage
 * @param images - Product gallery images
 * @returns Promise that resolves when image deletion is attempted
 */
async function deleteProductImages(images: ProductImageDocument[]): Promise<void> {
	const imageKeys = images.map((image) => image.key).filter(Boolean);

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
 * Delete a product by ID
 * @param formData - Form data containing the product ID
 * @returns Form result for the admin UI
 */
export async function deleteProductAction(formData: FormData): Promise<FormResult> {
	try {
		const parsedInput = deleteProductSchema.parse({
			productId: getFormString(formData, "productId"),
		});

		const db = await getDatabase();
		const productsCollection = db.collection<ProductDocument>("products");

		const existingProduct = await productsCollection.findOne({
			id: parsedInput.productId,
		});

		if (!existingProduct) {
			return {
				success: false,
				error: "Không tìm thấy sản phẩm cần xóa",
			};
		}

		await deleteProductImages(existingProduct.gallery || []);

		const result = await productsCollection.deleteOne({
			id: parsedInput.productId,
		});

		if (result.deletedCount === 0) {
			return {
				success: false,
				error: "Không thể xóa sản phẩm. Vui lòng thử lại.",
			};
		}

		revalidateTag(CACHE_TAGS.PRODUCTS, "max");
		revalidatePath("/admin/products");
		revalidatePath("/vi/products");
		revalidatePath("/en/products");

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

		console.error("Error deleting product:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại.",
		};
	}
}