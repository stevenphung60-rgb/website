import { cacheTag } from "next/cache";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import {
	normalizeSiteAppearance,
	SITE_APPEARANCE_ID,
	type SiteAppearance,
} from "src/lib/font-presets";

interface SiteAppearanceDocument extends SiteAppearance {
	_id?: unknown;
	/** Legacy field from when the site had separate heading and body fonts */
	bodyFontId?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

/**
 * Get current site appearance settings
 * @returns Site appearance settings
 */
export async function getSiteAppearance(): Promise<SiteAppearance> {
	"use cache";

	cacheTag(CACHE_TAGS.APPEARANCE);

	try {
		const db = await getDatabase();

		const document = await db
			.collection<SiteAppearanceDocument>("siteAppearance")
			.findOne({
				id: SITE_APPEARANCE_ID,
			});

		if (!document) {
			return normalizeSiteAppearance();
		}

		return normalizeSiteAppearance({
			fontId: document.fontId,
			bodyFontId: document.bodyFontId,
		});
	} catch (error) {
		console.error("Error getting site appearance:", error);

		return normalizeSiteAppearance();
	}
}