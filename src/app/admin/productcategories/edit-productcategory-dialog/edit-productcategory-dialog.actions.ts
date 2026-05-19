"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { ProductCategory, ProductCategoryDocument } from "src/server/productcategories";

/**
 * Server action to update an existing product category
 */
export async function updateProductCategory(formData: FormData): Promise<FormResult> {
	try {
		const productCategoryId = formData.get("productCategoryId") as string;
		const productCategoryNameEn = formData.get("productCategoryNameEn") as string;
		const productCategoryNameVi = formData.get("productCategoryNameVi") as string;

		if (!productCategoryId) {
			return {
				success: false,
				error: "Product Category ID is required",
			};
		}

		const missingFields: string[] = [];

		if (!productCategoryNameEn) {
			missingFields.push("Product Category Name (English)");
		}

		if (!productCategoryNameVi) {
			missingFields.push("Product Category Name (Vietnamese)");
		}

		if (missingFields.length > 0) {
			return {
				success: false,
				error: `Please fill in the following required fields: ${missingFields.join(", ")}`,
			};
		}

		const updatedProductCategory: Partial<ProductCategory> = {
			name: {
				en: productCategoryNameEn,
				vi: productCategoryNameVi,
			},
			updatedAt: new Date(),
		};

		const db = await getDatabase();
		const result = await db.collection<ProductCategoryDocument>("productCategories").updateOne(
			{ id: productCategoryId },
			{
				$set: updatedProductCategory,
			},
		);

		if (result.matchedCount === 0) {
			return {
				success: false,
				error: "Product category not found",
			};
		}

		revalidateTag(CACHE_TAGS.PRODUCT_CATEGORIES, "max");
		revalidatePath("/admin/productcategories");

		return {
			success: true,
			refresh: true,
		};
	} catch {
		return {
			success: false,
			error: "An unexpected error occurred while updating the product category",
		};
	}
}