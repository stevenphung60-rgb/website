/**
 * Database mutation to update hero information
 * Updates the hero information in the database
 */

import type { HeroContactInfoDocument, HeroContactInfoFormData } from "src/app/admin/herocontact/herocontact.type";
import { getDatabase } from "src/lib/database";

export async function updateHeroContactInfo(
	data: HeroContactInfoFormData,
): Promise<{ success: boolean; error?: string }> {
	try {
		const db = await getDatabase();

		const heroContactInfoDoc: Omit<HeroContactInfoDocument, "_id"> = {
			id: "herocontact-info",
			title: data.title,
			description: data.description,
			gallery: data.gallery ?? [],
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = await db
			.collection<HeroContactInfoDocument>("heroContactInfo")
			.replaceOne({ id: "herocontact-info" }, heroContactInfoDoc, { upsert: true });

		if (result.acknowledged) {
			return { success: true };
		}

		return { success: false, error: "Failed to update hero contact information" };
	} catch (error) {
		console.error("Error updating hero contact info:", error);
		return {
			success: false,
			error: "An unexpected error occurred while updating hero contact information",
		};
	}
}