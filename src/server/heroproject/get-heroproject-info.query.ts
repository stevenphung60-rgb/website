/**
 * Database query to get hero information
 * Retrieves the current hero information from the database
 */

import { cacheTag } from "next/cache";
import type { HeroProjectInfo, HeroProjectInfoDocument } from "src/app/admin/heroproject/heroproject.type";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";

export async function getHeroProjectInfo(): Promise<HeroProjectInfo> {
	"use cache";
	cacheTag(CACHE_TAGS.HEROSERVICE);

	const emptyHeroProjectInfo: HeroProjectInfo = {
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
		.collection<HeroProjectInfoDocument>("heroProjectInfo")
		.findOne({ id: "heroproject-info" });

	if (!document) {
		return emptyHeroProjectInfo;
	}

	return {
		title: document.title ?? emptyHeroProjectInfo.title,
		description: document.description ?? emptyHeroProjectInfo.description,
		gallery: document.gallery ?? emptyHeroProjectInfo.gallery, // ✅ THÊM
	};
}