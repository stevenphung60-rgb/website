"use server";

import { nanoid } from "nanoid";
import { revalidatePath, revalidateTag } from "next/cache";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { ProductCategoryDocument } from "src/server/productcategories";

/**
 * Create new product category
 */
export async function createProductCategory(formData: FormData): Promise<FormResult> {
	try {
		const productCategoryNameEn = formData.get("productCategoryNameEn") as string;
		const productCategoryNameVi = formData.get("productCategoryNameVi") as string;

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

		const db = await getDatabase();

		const newCategory: ProductCategoryDocument = {
			id: nanoid(),
			name: {
				en: productCategoryNameEn,
				vi: productCategoryNameVi,
			},
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		await db.collection<ProductCategoryDocument>("productCategories").insertOne(newCategory);

		revalidateTag(CACHE_TAGS.PRODUCT_CATEGORIES, "max");
		revalidatePath("/admin/productcategories");

		return {
			success: true,
			refresh: true,
		};
	} catch (error) {
		console.error("Error creating product category:", error);

		return {
			success: false,
			error: "An unexpected error occurred while creating the product category",
		};
	}
}