/**
 * Database query to get hero about information
 * Retrieves the current hero about information from the database
 */

import { cacheTag } from "next/cache";
import type {
	HeroAboutInfo,
	HeroAboutInfoDocument,
} from "src/app/admin/heroabout/heroabout.type";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";

export async function getHeroAboutInfo(): Promise<HeroAboutInfo> {
	"use cache";
	cacheTag(CACHE_TAGS.HEROABOUT);

	const emptyHeroAboutInfo: HeroAboutInfo = {
		title: {
			en: "",
			vi: "",
		},
		description: {
			en: "",
			vi: "",
		},
		gallery: [],

		factoryaddress: { en: "", vi: "" },
		officeaddress: { en: "", vi: "" },
		youtubelink: { en: "", vi: "" },
		videotitle: { en: "", vi: "" },
		videodescription: { en: "", vi: "" },

		historytitle: { en: "", vi: "" },
		historydescription: { en: "", vi: "" },
		historytime1: { en: "", vi: "" },
		historytitle1: { en: "", vi: "" },
		historydetail1: { en: "", vi: "" },
		historytime2: { en: "", vi: "" },
		historytitle2: { en: "", vi: "" },
		historydetail2: { en: "", vi: "" },
		historytime3: { en: "", vi: "" },
		historytitle3: { en: "", vi: "" },
		historydetail3: { en: "", vi: "" },

		valuestatementtitle: { en: "", vi: "" },
		valuestatementtitle1: { en: "", vi: "" },
		valuestatementdetail1: { en: "", vi: "" },
		valuestatementtitle2: { en: "", vi: "" },
		valuestatementdetail2: { en: "", vi: "" },
		valuestatementtitle3: { en: "", vi: "" },
		valuestatementdetail3: { en: "", vi: "" },

		capacitytitle: { en: "", vi: "" },
		capacitydescription: { en: "", vi: "" },
		capacitytitle1: { en: "", vi: "" },
		capacitydetail1: { en: "", vi: "" },
		capacitytitle2: { en: "", vi: "" },
		capacitydetail2: { en: "", vi: "" },
		capacitytitle3: { en: "", vi: "" },
		capacitydetail3: { en: "", vi: "" },
		capacitytitle4: { en: "", vi: "" },
		capacitydetail4: { en: "", vi: "" },
	};

	const db = await getDatabase();

	const document = await db
		.collection<HeroAboutInfoDocument>("heroAboutInfo")
		.findOne({ id: "heroabout-info" });

	if (!document) {
		return emptyHeroAboutInfo;
	}

	return {
		title: document.title ?? emptyHeroAboutInfo.title,
		description: document.description ?? emptyHeroAboutInfo.description,
		gallery: document.gallery ?? emptyHeroAboutInfo.gallery,

		factoryaddress: document.factoryaddress ?? emptyHeroAboutInfo.factoryaddress,
		officeaddress: document.officeaddress ?? emptyHeroAboutInfo.officeaddress,
		youtubelink: document.youtubelink ?? emptyHeroAboutInfo.youtubelink,
		videotitle: document.videotitle ?? emptyHeroAboutInfo.videotitle,
		videodescription:
			document.videodescription ?? emptyHeroAboutInfo.videodescription,

		historytitle: document.historytitle ?? emptyHeroAboutInfo.historytitle,
		historydescription:
			document.historydescription ?? emptyHeroAboutInfo.historydescription,
		historytime1: document.historytime1 ?? emptyHeroAboutInfo.historytime1,
		historytitle1: document.historytitle1 ?? emptyHeroAboutInfo.historytitle1,
		historydetail1:
			document.historydetail1 ?? emptyHeroAboutInfo.historydetail1,
		historytime2: document.historytime2 ?? emptyHeroAboutInfo.historytime2,
		historytitle2: document.historytitle2 ?? emptyHeroAboutInfo.historytitle2,
		historydetail2:
			document.historydetail2 ?? emptyHeroAboutInfo.historydetail2,
		historytime3: document.historytime3 ?? emptyHeroAboutInfo.historytime3,
		historytitle3: document.historytitle3 ?? emptyHeroAboutInfo.historytitle3,
		historydetail3:
			document.historydetail3 ?? emptyHeroAboutInfo.historydetail3,

		valuestatementtitle:
			document.valuestatementtitle ?? emptyHeroAboutInfo.valuestatementtitle,
		valuestatementtitle1:
			document.valuestatementtitle1 ?? emptyHeroAboutInfo.valuestatementtitle1,
		valuestatementdetail1:
			document.valuestatementdetail1 ??
			emptyHeroAboutInfo.valuestatementdetail1,
		valuestatementtitle2:
			document.valuestatementtitle2 ?? emptyHeroAboutInfo.valuestatementtitle2,
		valuestatementdetail2:
			document.valuestatementdetail2 ??
			emptyHeroAboutInfo.valuestatementdetail2,
		valuestatementtitle3:
			document.valuestatementtitle3 ?? emptyHeroAboutInfo.valuestatementtitle3,
		valuestatementdetail3:
			document.valuestatementdetail3 ??
			emptyHeroAboutInfo.valuestatementdetail3,

		capacitytitle: document.capacitytitle ?? emptyHeroAboutInfo.capacitytitle,
		capacitydescription:
			document.capacitydescription ?? emptyHeroAboutInfo.capacitydescription,
		capacitytitle1: document.capacitytitle1 ?? emptyHeroAboutInfo.capacitytitle1,
		capacitydetail1:
			document.capacitydetail1 ?? emptyHeroAboutInfo.capacitydetail1,
		capacitytitle2: document.capacitytitle2 ?? emptyHeroAboutInfo.capacitytitle2,
		capacitydetail2:
			document.capacitydetail2 ?? emptyHeroAboutInfo.capacitydetail2,
		capacitytitle3: document.capacitytitle3 ?? emptyHeroAboutInfo.capacitytitle3,
		capacitydetail3:
			document.capacitydetail3 ?? emptyHeroAboutInfo.capacitydetail3,
		capacitytitle4: document.capacitytitle4 ?? emptyHeroAboutInfo.capacitytitle4,
		capacitydetail4:
			document.capacitydetail4 ?? emptyHeroAboutInfo.capacitydetail4,
	};
}