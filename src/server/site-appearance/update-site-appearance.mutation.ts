import { getDatabase } from "src/lib/database";
import {
	normalizeSiteAppearance,
	SITE_APPEARANCE_ID,
	type SiteAppearance,
} from "src/lib/font-presets";

interface UpdateSiteAppearanceResult {
	success: boolean;
	error?: string;
}

interface SiteAppearanceDocument extends SiteAppearance {
	_id?: unknown;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Update site appearance settings
 * @param input - Site appearance input
 * @returns Update result
 */
export async function updateSiteAppearance(
	input: Partial<SiteAppearance>,
): Promise<UpdateSiteAppearanceResult> {
	try {
		const siteAppearance = normalizeSiteAppearance(input);
		const now = new Date();
		const db = await getDatabase();

		await db.collection<SiteAppearanceDocument>("siteAppearance").updateOne(
			{
				id: SITE_APPEARANCE_ID,
			},
			{
				$set: {
					fontPresetId: siteAppearance.fontPresetId,
					headingFontId: siteAppearance.headingFontId,
					bodyFontId: siteAppearance.bodyFontId,
					updatedAt: now,
				},
				$setOnInsert: {
					id: SITE_APPEARANCE_ID,
					createdAt: now,
				},
			},
			{
				upsert: true,
			},
		);

		return {
			success: true,
		};
	} catch (error) {
		console.error("Error updating site appearance:", error);

		return {
			success: false,
			error: "Không thể cập nhật giao diện website",
		};
	}
}