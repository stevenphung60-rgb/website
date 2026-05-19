/**
 * Database query to get hero brand information
 * Retrieves the current hero brand information from the database
 */

import { cacheTag } from "next/cache";
import type {
	HeroBrandInfo,
	HeroBrandInfoDocument,
} from "src/app/admin/herobrand/herobrand.type";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";

export async function getHeroBrandInfo(): Promise<HeroBrandInfo> {
	"use cache";
	cacheTag(CACHE_TAGS.HEROBRAND);

	const emptyHeroBrandInfo: HeroBrandInfo = {
		logo: {
			url: "",
		},
		companyName: {
			en: "",
			vi: "",
		},
	};

	const db = await getDatabase();

	const document = await db
		.collection<HeroBrandInfoDocument>("heroBrandInfo")
		.findOne({ id: "herobrand-info" });

	if (!document) {
		return emptyHeroBrandInfo;
	}

	return {
		logo: document.logo ?? emptyHeroBrandInfo.logo,
		companyName: document.companyName ?? emptyHeroBrandInfo.companyName,
	};
}