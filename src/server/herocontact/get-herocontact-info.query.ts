/**
 * Database query to get hero information
 * Retrieves the current hero information from the database
 */

import { cacheTag } from "next/cache";
import type { HeroContactInfo, HeroContactInfoDocument } from "src/app/admin/herocontact/herocontact.type";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";

export async function getHeroContactInfo(): Promise<HeroContactInfo> {
	"use cache";
	cacheTag(CACHE_TAGS.HEROSERVICE);

	const emptyHeroContactInfo: HeroContactInfo = {
		title: {
			en: "",
			vi: "",
		},
		description: {
			en: "",
			vi: "",
		},
		gallery: [], // ✅ THÊM
	};

	const db = await getDatabase();

	const document = await db
		.collection<HeroContactInfoDocument>("heroContactInfo")
		.findOne({ id: "herocontact-info" });

	if (!document) {
		return emptyHeroContactInfo;
	}

	return {
		title: document.title ?? emptyHeroContactInfo.title,
		description: document.description ?? emptyHeroContactInfo.description,
		gallery: document.gallery ?? emptyHeroContactInfo.gallery, // ✅ THÊM
	};
}