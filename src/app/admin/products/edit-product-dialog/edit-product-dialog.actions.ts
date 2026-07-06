"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { ProductDocument } from "src/server/products";
import { ProductStatus } from "src/server/products";
import { z } from "zod";

interface UpdateProductInput {
	productId: string;
	productCode: string;
	productNameVi: string;
	productNameEn: string;
	productDescriptionVi: string;
	productDescriptionEn: string;
	productStatus: ProductStatus;
	productCategoryId?: string;
}

const updateProductSchema = z.object({
	productId: z.string().trim().min(1, "Không tìm thấy ID sản phẩm"),
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
 * Get a string value from form data
 * @param formData - Submitted form data
 * @param key - Field key
 * @returns String value from form data
 */
function getFormString(formData: FormData, key: string): string {
	return (formData.get(key) as string | null) || "";
}

/**
 * Parse and validate product update form data
 * @param formData - Submitted form data
 * @returns Validated product update input
 */
function parseProductInput(formData: FormData): UpdateProductInput {
	return updateProductSchema.parse({
		productId: getFormString(formData, "productId"),
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
 * Update an existing product from admin form data
 * @param formData - Submitted product form data
 * @returns Form result for the admin UI
 */
export async function updateProduct(formData: FormData): Promise<FormResult> {
	try {
		const productInput = parseProductInput(formData);
		const db = await getDatabase();
		const productsCollection = db.collection<ProductDocument>("products");

		const existingProduct = await productsCollection.findOne({
			id: productInput.productId,
		});

		if (!existingProduct) {
			return {
				success: false,
				error: "Không tìm thấy sản phẩm cần cập nhật",
			};
		}

		const duplicateProduct = await productsCollection.findOne({
			code: productInput.productCode,
			id: { $ne: productInput.productId },
		});

		if (duplicateProduct) {
			return {
				success: false,
				error: "Mã sản phẩm đã tồn tại. Vui lòng nhập mã sản phẩm khác.",
			};
		}

		const result = await productsCollection.updateOne(
			{ id: productInput.productId },
			{
				$set: {
					code: productInput.productCode,
					name: {
						vi: productInput.productNameVi,
						en: productInput.productNameEn || productInput.productNameVi,
					},
					description: {
						vi: productInput.productDescriptionVi,
						en:
							productInput.productDescriptionEn ||
							productInput.productDescriptionVi,
					},
					status: productInput.productStatus,
					updatedAt: new Date(),
					...(productInput.productCategoryId
						? { categoryId: productInput.productCategoryId }
						: {}),
				},
				...(productInput.productCategoryId ? {} : { $unset: { categoryId: "" } }),
			},
		);

		if (result.matchedCount === 0) {
			return {
				success: false,
				error: "Không tìm thấy sản phẩm cần cập nhật",
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

		console.error("Error updating product:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại.",
		};
	}
}