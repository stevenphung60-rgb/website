/**
 * Database mutation to update hero brand information
 * Updates the hero brand information in the database
 */

import type {
	HeroBrandInfoDocument,
	HeroBrandInfoFormData,
} from "src/app/admin/herobrand/herobrand.type";
import { getDatabase } from "src/lib/database";

export async function updateHeroBrandInfo(
	data: HeroBrandInfoFormData,
): Promise<{ success: boolean; error?: string }> {
	try {
		const db = await getDatabase();

		const existingDocument = await db
			.collection<HeroBrandInfoDocument>("heroBrandInfo")
			.findOne({ id: "herobrand-info" });

		const heroBrandInfoDoc: Omit<HeroBrandInfoDocument, "_id"> = {
			id: "herobrand-info",

			logo: data.logo,
			companyName: data.companyName,

			createdAt: existingDocument?.createdAt ?? new Date(),
			updatedAt: new Date(),
		};

		const result = await db
			.collection<HeroBrandInfoDocument>("heroBrandInfo")
			.replaceOne({ id: "herobrand-info" }, heroBrandInfoDoc, {
				upsert: true,
			});

		if (result.acknowledged) {
			return { success: true };
		}

		return {
			success: false,
			error: "Failed to update hero brand information",
		};
	} catch (error) {
		console.error("Error updating hero brand info:", error);

		return {
			success: false,
			error:
				"An unexpected error occurred while updating hero brand information",
		};
	}
}