/**
 * Database mutation to update hero about information
 * Updates the hero about information in the database
 */

import type {
	HeroAboutInfoDocument,
	HeroAboutInfoFormData,
} from "src/app/admin/heroabout/heroabout.type";
import { getDatabase } from "src/lib/database";

export async function updateHeroAboutInfo(
	data: HeroAboutInfoFormData,
): Promise<{ success: boolean; error?: string }> {
	try {
		const db = await getDatabase();

		const heroAboutInfoDoc: Omit<HeroAboutInfoDocument, "_id"> = {
			id: "heroabout-info",
			title: data.title,
			description: data.description,
			gallery: data.gallery ?? [],

			factoryaddress: data.factoryaddress,
			officeaddress: data.officeaddress,
			youtubelink: data.youtubelink,
			videotitle: data.videotitle,
			videodescription: data.videodescription,

			historytitle: data.historytitle,
			historydescription: data.historydescription,
			historytime1: data.historytime1,
			historytitle1: data.historytitle1,
			historydetail1: data.historydetail1,
			historytime2: data.historytime2,
			historytitle2: data.historytitle2,
			historydetail2: data.historydetail2,
			historytime3: data.historytime3,
			historytitle3: data.historytitle3,
			historydetail3: data.historydetail3,

			valuestatementtitle: data.valuestatementtitle,
			valuestatementtitle1: data.valuestatementtitle1,
			valuestatementdetail1: data.valuestatementdetail1,
			valuestatementtitle2: data.valuestatementtitle2,
			valuestatementdetail2: data.valuestatementdetail2,
			valuestatementtitle3: data.valuestatementtitle3,
			valuestatementdetail3: data.valuestatementdetail3,

			capacitytitle: data.capacitytitle,
			capacitydescription: data.capacitydescription,
			capacitytitle1: data.capacitytitle1,
			capacitydetail1: data.capacitydetail1,
			capacitytitle2: data.capacitytitle2,
			capacitydetail2: data.capacitydetail2,
			capacitytitle3: data.capacitytitle3,
			capacitydetail3: data.capacitydetail3,
			capacitytitle4: data.capacitytitle4,
			capacitydetail4: data.capacitydetail4,

			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = await db
			.collection<HeroAboutInfoDocument>("heroAboutInfo")
			.replaceOne({ id: "heroabout-info" }, heroAboutInfoDoc, { upsert: true });

		if (result.acknowledged) {
			return { success: true };
		}

		return { success: false, error: "Failed to update hero about information" };
	} catch (error) {
		console.error("Error updating hero about info:", error);

		return {
			success: false,
			error: "An unexpected error occurred while updating hero about information",
		};
	}
}