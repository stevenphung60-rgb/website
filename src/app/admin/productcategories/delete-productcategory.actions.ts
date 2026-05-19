"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { ProductCategoryDocument } from "src/server/productcategories";

/**
 * Delete a product category by ID
 */
export async function deleteProductCategoryAction(formData: FormData): Promise<FormResult> {
	try {
		const productCategoryId = formData.get("productCategoryId") as string;

		if (!productCategoryId) {
			return {
				success: false,
				error: "Product Category ID is required",
			};
		}

		const db = await getDatabase();
		const productCategoriesCollection =
			db.collection<ProductCategoryDocument>("productCategories");

		const existingProductCategory = await productCategoriesCollection.findOne({
			id: productCategoryId,
		});

		if (!existingProductCategory) {
			return {
				success: false,
				error: "Product category not found",
			};
		}

		const result = await productCategoriesCollection.deleteOne({
			id: productCategoryId,
		});

		if (result.deletedCount === 0) {
			return {
				success: false,
				error: "Failed to delete product category",
			};
		}

		revalidateTag(CACHE_TAGS.PRODUCT_CATEGORIES, "max");
		revalidatePath("/admin/productcategories");

		return {
			success: true,
			refresh: true,
		};
	} catch (error) {
		console.error("Error deleting product category:", error);
		return {
			success: false,
			error: "An unexpected error occurred while deleting the product category",
		};
	}
}