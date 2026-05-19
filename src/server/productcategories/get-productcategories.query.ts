import { getDatabase } from "src/lib/database";
import type { ProductCategoryDocument, ProductCategory } from "./productcategory.type";

export async function getProductCategories(): Promise<ProductCategory[]> {
	const db = await getDatabase();

	const categories = await db
		.collection<ProductCategoryDocument>("productCategories")
		.find({})
		.sort({ createdAt: -1 })
		.toArray();

	return categories.map((category) => ({
		id: category.id,
		name: category.name,
		createdAt: category.createdAt,
		updatedAt: category.updatedAt,
	}));
}