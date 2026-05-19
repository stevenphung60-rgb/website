/**
 * Query to get product category counts
 */

import { getDatabase } from "src/lib/database";

/**
 * Get total product category count
 * @returns Promise that resolves to total number of categories
 */
export async function getProductCategoryCount(): Promise<number> {
	try {
		const db = await getDatabase();

		const count = await db.collection("productCategories").countDocuments();

		return count;
	} catch (error) {
		console.error("Error fetching product category count:", error);
		throw new Error("Failed to fetch product category count");
	}
}