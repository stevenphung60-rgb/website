/**
 * Query to get only product category IDs from the database
 * Used for checking if categories exist without fetching full data
 */

import { getDatabase } from "src/lib/database";

/**
 * Get all product category IDs from the database
 * @returns Promise that resolves to an array of category IDs
 */
export async function getProductCategoryIds(): Promise<string[]> {
	try {
		const db = await getDatabase();
		const categories = await db
			.collection("productCategories")
			.find<{ id: string }>({}, { projection: { id: 1 } })
			.toArray();

		return categories.map((doc) => doc.id);
	} catch (error) {
		console.error("Error fetching product category IDs:", error);
		throw new Error("Failed to fetch product category IDs");
	}
}

/**
 * Get active product category IDs
 * (hiện tại chưa có status → giống function trên)
 */
export async function getActiveProductCategoryIds(): Promise<string[]> {
	try {
		const db = await getDatabase();
		const categories = await db
			.collection("productCategories")
			.find<{ id: string }>({}, { projection: { id: 1 } })
			.toArray();

		return categories.map((doc) => doc.id);
	} catch (error) {
		console.error("Error fetching active product category IDs:", error);
		throw new Error("Failed to fetch active product category IDs");
	}
}