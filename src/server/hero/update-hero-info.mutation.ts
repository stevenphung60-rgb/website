/**
 * Database mutation to update hero information
 * Updates the hero information in the database
 */

import type {
	HeroInfoDocument,
	HeroInfoFormData,
} from "src/app/admin/hero/hero.type";
import { getDatabase } from "src/lib/database";

export async function updateHeroInfo(
	data: HeroInfoFormData,
): Promise<{ success: boolean; error?: string }> {
	try {
		const db = await getDatabase();

		const heroInfoDoc: Omit<HeroInfoDocument, "_id"> = {
			id: "hero-info",

			title: data.title,
			description: data.description,
			gallery: data.gallery ?? [],

			productitle: data.productitle,
			productdescription: data.productdescription,

			servicetitle: data.servicetitle,
			servicedesription: data.servicedesription,

			machinetitle: data.machinetitle,
			machinedescription: data.machinedescription,
			machinebackgroundimage: data.machinebackgroundimage,

			machine1title: data.machine1title,
			machine1subtitle: data.machine1subtitle,
			machine1description: data.machine1description,
			machine1image: data.machine1image,

			machine2title: data.machine2title,
			machine2subtitle: data.machine2subtitle,
			machine2description: data.machine2description,
			machine2image: data.machine2image,

			machine3title: data.machine3title,
			machine3subtitle: data.machine3subtitle,
			machine3description: data.machine3description,
			machine3image: data.machine3image,

			clienttitle: data.clienttitle,
			clientdescription: data.clientdescription,
			clientimagegallery: data.clientimagegallery ?? [],

			projecttitle: data.projecttitle,

			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = await db
			.collection<HeroInfoDocument>("heroInfo")
			.replaceOne({ id: "hero-info" }, heroInfoDoc, { upsert: true });

		if (result.acknowledged) {
			return { success: true };
		}

		return { success: false, error: "Failed to update hero information" };
	} catch (error) {
		console.error("Error updating hero info:", error);

		return {
			success: false,
			error: "An unexpected error occurred while updating hero information",
		};
	}
}