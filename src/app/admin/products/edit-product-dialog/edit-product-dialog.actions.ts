"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { Product, ProductDocument } from "src/server/products";
import { ProductStatus } from "src/server/products";

/**
 * Server action to update an existing product (without image handling)
 * @param formData - Form data containing product information
 * @returns Promise that resolves to the update result
 */
export async function updateProduct(formData: FormData): Promise<FormResult> {
	try {
		// Extract form data
		const productId = formData.get("productId") as string;
		const productCode = formData.get("productCode") as string;
		const productNameEn = formData.get("productNameEn") as string;
		const productNameVi = formData.get("productNameVi") as string;
		const productDescriptionEn = formData.get("productDescriptionEn") as string;
		const productDescriptionVi = formData.get("productDescriptionVi") as string;
		const productStatus = formData.get("productStatus") as string;
		const productCategoryId = (formData.get("productCategoryId") as string) || "";

		// Validation phase
		if (!productId) {
			return {
				success: false,
				error: "Product ID is required",
			};
		}

		// Validate required fields and collect missing field names
		const missingFields: string[] = [];

		if (!productCode) {
			missingFields.push("Product Code");
		}
		if (!productNameEn) {
			missingFields.push("Product Name (English)");
		}
		if (!productNameVi) {
			missingFields.push("Product Name (Vietnamese)");
		}
		if (!productDescriptionEn) {
			missingFields.push("Product Description (English)");
		}
		if (!productDescriptionVi) {
			missingFields.push("Product Description (Vietnamese)");
		}
		if (!productStatus) {
			missingFields.push("Product Status");
		}

		if (missingFields.length > 0) {
			return {
				success: false,
				error: `Please fill in the following required fields: ${missingFields.join(", ")}`,
			};
		}

		if (!Object.values(ProductStatus).includes(productStatus as ProductStatus)) {
			throw new Error("Invalid product status");
		}

		const updatedProduct: Partial<Product> = {
			code: productCode,
			name: {
				en: productNameEn,
				vi: productNameVi,
			},
			description: {
				en: productDescriptionEn,
				vi: productDescriptionVi,
			},
			status: productStatus as ProductStatus,
			updatedAt: new Date(),
		};

		const db = await getDatabase();
		const result = await db.collection<ProductDocument>("products").updateOne(
			{ id: productId },
			{
				$set: {
					...updatedProduct,
					...(productCategoryId ? { categoryId: productCategoryId } : {}),
				},
				...(productCategoryId ? {} : { $unset: { categoryId: "" } }),
			},
		);

		if (result.matchedCount === 0) {
			return {
				success: false,
				error: "Product not found",
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
			error: "An unexpected error occurred while updating the product",
		};
	}
}