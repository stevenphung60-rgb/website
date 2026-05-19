/**
 * Database mutation to update hero information
 * Updates the hero information in the database
 */

import type { HeroProjectInfoDocument, HeroProjectInfoFormData } from "src/app/admin/heroproject/heroproject.type";
import { getDatabase } from "src/lib/database";

export async function updateHeroProjectInfo(
	data: HeroProjectInfoFormData,
): Promise<{ success: boolean; error?: string }> {
	try {
		const db = await getDatabase();

		const heroProjectInfoDoc: Omit<HeroProjectInfoDocument, "_id"> = {
			id: "heroproject-info",
			title: data.title,
			description: data.description,
			gallery: data.gallery ?? [],
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = await db
			.collection<HeroProjectInfoDocument>("heroProjectInfo")
			.replaceOne({ id: "heroproject-info" }, heroProjectInfoDoc, { upsert: true });

		if (result.acknowledged) {
			return { success: true };
		}

		return { success: false, error: "Failed to update hero project information" };
	} catch (error) {
		console.error("Error updating hero project info:", error);
		return {
			success: false,
			error: "An unexpected error occurred while updating hero project information",
		};
	}
}