"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { ProductCategoryDocument } from "src/server/productcategories";
import type { ProductDocument } from "src/server/products";

const deleteProductCategorySchema = z.object({
	productCategoryId: z.string().trim().min(1, "Không tìm thấy ID loại sản phẩm cần xóa"),
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
 * Revalidate product category related pages after mutation
 */
function revalidateProductCategoryPages(): void {
	revalidateTag(CACHE_TAGS.PRODUCT_CATEGORIES, "max");
	revalidateTag(CACHE_TAGS.PRODUCTS, "max");
	revalidatePath("/admin/productcategories");
	revalidatePath("/admin/products");
	revalidatePath("/vi/products");
	revalidatePath("/en/products");
}

/**
 * Delete a product category by ID
 * @param formData - Submitted form data containing product category ID
 * @returns Form result for the admin UI
 */
export async function deleteProductCategoryAction(
	formData: FormData,
): Promise<FormResult> {
	try {
		const parsedInput = deleteProductCategorySchema.parse({
			productCategoryId: getFormString(formData, "productCategoryId"),
		});

		const db = await getDatabase();
		const productCategoriesCollection =
			db.collection<ProductCategoryDocument>("productCategories");

		const existingProductCategory = await productCategoriesCollection.findOne({
			id: parsedInput.productCategoryId,
		});

		if (!existingProductCategory) {
			return {
				success: false,
				error: "Không tìm thấy loại sản phẩm cần xóa",
			};
		}

		const result = await productCategoriesCollection.deleteOne({
			id: parsedInput.productCategoryId,
		});

		if (result.deletedCount === 0) {
			return {
				success: false,
				error: "Không thể xóa loại sản phẩm. Vui lòng thử lại.",
			};
		}

		await db.collection<ProductDocument>("products").updateMany(
			{
				categoryId: parsedInput.productCategoryId,
			},
			{
				$unset: {
					categoryId: "",
				},
				$set: {
					updatedAt: new Date(),
				},
			},
		);

		revalidateProductCategoryPages();

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

		console.error("Error deleting product category:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi xóa loại sản phẩm. Vui lòng thử lại.",
		};
	}
}