/**
 * Database mutation to update hero information
 * Updates the hero information in the database
 */

import type { HeroServiceInfoDocument, HeroServiceInfoFormData } from "src/app/admin/heroservice/heroservice.type";
import { getDatabase } from "src/lib/database";

export async function updateHeroServiceInfo(
	data: HeroServiceInfoFormData,
): Promise<{ success: boolean; error?: string }> {
	try {
		const db = await getDatabase();

		const heroServiceInfoDoc: Omit<HeroServiceInfoDocument, "_id"> = {
			id: "heroservice-info",
			title: data.title,
			description: data.description,
			gallery: data.gallery ?? [],
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = await db
			.collection<HeroServiceInfoDocument>("heroServiceInfo")
			.replaceOne({ id: "heroservice-info" }, heroServiceInfoDoc, { upsert: true });

		if (result.acknowledged) {
			return { success: true };
		}

		return { success: false, error: "Failed to update hero service information" };
	} catch (error) {
		console.error("Error updating hero service info:", error);
		return {
			success: false,
			error: "An unexpected error occurred while updating hero service information",
		};
	}
}