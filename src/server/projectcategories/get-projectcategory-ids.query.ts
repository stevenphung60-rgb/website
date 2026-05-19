/**
 * Query to get only project category IDs from the database
 * Used for checking if categories exist without fetching full data
 */

import { getDatabase } from "src/lib/database";

/**
 * Get all project category IDs from the database
 * @returns Promise that resolves to an array of category IDs
 */
export async function getProjectCategoryIds(): Promise<string[]> {
	try {
		const db = await getDatabase();
		const categories = await db
			.collection("projectCategories")
			.find<{ id: string }>({}, { projection: { id: 1 } })
			.toArray();

		return categories.map((doc) => doc.id);
	} catch (error) {
		console.error("Error fetching project category IDs:", error);
		throw new Error("Failed to fetch project category IDs");
	}
}

/**
 * Get active project category IDs
 * (hiện tại chưa có status → giống function trên)
 */
export async function getActiveProjectCategoryIds(): Promise<string[]> {
	try {
		const db = await getDatabase();
		const categories = await db
			.collection("projectCategories")
			.find<{ id: string }>({}, { projection: { id: 1 } })
			.toArray();

		return categories.map((doc) => doc.id);
	} catch (error) {
		console.error("Error fetching active project category IDs:", error);
		throw new Error("Failed to fetch active project category IDs");
	}
}