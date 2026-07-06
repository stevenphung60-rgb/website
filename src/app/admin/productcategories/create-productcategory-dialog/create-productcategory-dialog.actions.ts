"use server";

import { randomUUID } from "crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { ProductCategoryDocument } from "src/server/productcategories";

interface CreateProductCategoryInput {
	productCategoryNameVi: string;
	productCategoryNameEn: string;
}

const createProductCategorySchema = z.object({
	productCategoryNameVi: z
		.string()
		.trim()
		.min(1, "Tên loại sản phẩm tiếng Việt là bắt buộc"),
	productCategoryNameEn: z.string().trim().optional().default(""),
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
 * Parse product category form data
 * @param formData - Submitted form data
 * @returns Parsed and validated product category input
 */
function parseProductCategoryInput(formData: FormData): CreateProductCategoryInput {
	return createProductCategorySchema.parse({
		productCategoryNameVi: getFormString(formData, "productCategoryNameVi"),
		productCategoryNameEn: getFormString(formData, "productCategoryNameEn"),
	});
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
 * Create new product category
 * @param formData - Submitted product category form data
 * @returns Form result for the admin UI
 */
export async function createProductCategory(formData: FormData): Promise<FormResult> {
	try {
		const categoryInput = parseProductCategoryInput(formData);
		const db = await getDatabase();

		const existingCategory = await db
			.collection<ProductCategoryDocument>("productCategories")
			.findOne({
				$or: [
					{ "name.vi": categoryInput.productCategoryNameVi },
					{
						"name.en":
							categoryInput.productCategoryNameEn ||
							categoryInput.productCategoryNameVi,
					},
				],
			});

		if (existingCategory) {
			return {
				success: false,
				error: "Loại sản phẩm này đã tồn tại. Vui lòng nhập tên khác.",
			};
		}

		const now = new Date();

		const newCategory: ProductCategoryDocument = {
			id: randomUUID(),
			name: {
				vi: categoryInput.productCategoryNameVi,
				en:
					categoryInput.productCategoryNameEn ||
					categoryInput.productCategoryNameVi,
			},
			createdAt: now,
			updatedAt: now,
		};

		await db.collection<ProductCategoryDocument>("productCategories").insertOne(newCategory);

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

		console.error("Error creating product category:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi tạo loại sản phẩm. Vui lòng thử lại.",
		};
	}
}