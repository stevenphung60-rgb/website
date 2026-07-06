"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { ProductCategoryDocument } from "src/server/productcategories";

interface UpdateProductCategoryInput {
	productCategoryId: string;
	productCategoryNameVi: string;
	productCategoryNameEn: string;
}

const updateProductCategorySchema = z.object({
	productCategoryId: z.string().trim().min(1, "Không tìm thấy ID loại sản phẩm"),
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
 * Parse product category update form data
 * @param formData - Submitted form data
 * @returns Parsed and validated product category input
 */
function parseProductCategoryInput(formData: FormData): UpdateProductCategoryInput {
	return updateProductCategorySchema.parse({
		productCategoryId: getFormString(formData, "productCategoryId"),
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
 * Update an existing product category
 * @param formData - Submitted product category form data
 * @returns Form result for the admin UI
 */
export async function updateProductCategory(formData: FormData): Promise<FormResult> {
	try {
		const categoryInput = parseProductCategoryInput(formData);
		const db = await getDatabase();
		const productCategoriesCollection =
			db.collection<ProductCategoryDocument>("productCategories");

		const existingCategory = await productCategoriesCollection.findOne({
			id: categoryInput.productCategoryId,
		});

		if (!existingCategory) {
			return {
				success: false,
				error: "Không tìm thấy loại sản phẩm cần cập nhật",
			};
		}

		const fallbackEnglishName =
			categoryInput.productCategoryNameEn || categoryInput.productCategoryNameVi;

		const duplicateCategory = await productCategoriesCollection.findOne({
			id: { $ne: categoryInput.productCategoryId },
			$or: [
				{ "name.vi": categoryInput.productCategoryNameVi },
				{ "name.en": fallbackEnglishName },
			],
		});

		if (duplicateCategory) {
			return {
				success: false,
				error: "Tên loại sản phẩm đã tồn tại. Vui lòng nhập tên khác.",
			};
		}

		const result = await productCategoriesCollection.updateOne(
			{ id: categoryInput.productCategoryId },
			{
				$set: {
					name: {
						vi: categoryInput.productCategoryNameVi,
						en: fallbackEnglishName,
					},
					updatedAt: new Date(),
				},
			},
		);

		if (result.matchedCount === 0) {
			return {
				success: false,
				error: "Không tìm thấy loại sản phẩm cần cập nhật",
			};
		}

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

		console.error("Error updating product category:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi cập nhật loại sản phẩm. Vui lòng thử lại.",
		};
	}
}	