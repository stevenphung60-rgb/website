/**
 * Database query to get hero information
 * Retrieves the current hero information from the database
 */

import { cacheTag } from "next/cache";
import type { HeroServiceInfo, HeroServiceInfoDocument } from "src/app/admin/heroservice/heroservice.type";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";

export async function getHeroServiceInfo(): Promise<HeroServiceInfo> {
	"use cache";
	cacheTag(CACHE_TAGS.HEROSERVICE);

	const emptyHeroServiceInfo: HeroServiceInfo = {
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
		.collection<HeroServiceInfoDocument>("heroServiceInfo")
		.findOne({ id: "heroservice-info" });

	if (!document) {
		return emptyHeroServiceInfo;
	}

	return {	
		title: document.title ?? emptyHeroServiceInfo.title,
		description: document.description ?? emptyHeroServiceInfo.description,
		gallery: document.gallery ?? emptyHeroServiceInfo.gallery, // ✅ THÊM
	};
}