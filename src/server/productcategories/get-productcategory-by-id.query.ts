import { cache } from "react";
import { getDatabase } from "src/lib/database";
import type { ProductCategory, ProductCategoryDocument } from "./productcategory.type";

export const getProductCategoryById = cache(
	async (id: string): Promise<ProductCategory | null> => {
		const db = await getDatabase();

		const category = await db
			.collection<ProductCategoryDocument>("productCategories")
			.findOne({ id });

		if (!category) return null;

		return {
			id: category.id,
			name: category.name,
			createdAt: category.createdAt,
			updatedAt: category.updatedAt,
		};
	},
);