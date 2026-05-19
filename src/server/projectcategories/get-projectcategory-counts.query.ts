/**
 * Query to get project category counts
 */

import { getDatabase } from "src/lib/database";

/**
 * Get total project category count
 * @returns Promise that resolves to total number of categories
 */
export async function getProjectCategoryCount(): Promise<number> {
	try {
		const db = await getDatabase();

		const count = await db.collection("projectCategories").countDocuments();

		return count;
	} catch (error) {
		console.error("Error fetching project category count:", error);
		throw new Error("Failed to fetch project category count");
	}
}