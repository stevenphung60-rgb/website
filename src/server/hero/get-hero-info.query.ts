/**
 * Database query to get hero information
 * Retrieves the current hero information from the database
 */

import { cacheTag } from "next/cache";
import type { HeroInfo, HeroInfoDocument } from "src/app/admin/hero/hero.type";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";

const emptyLocalizedText = {
	en: "",
	vi: "",
};

const emptySingleImage = {
	url: "",
};

export async function getHeroInfo(): Promise<HeroInfo> {
	"use cache";
	cacheTag(CACHE_TAGS.HERO);

	const emptyHeroInfo: HeroInfo = {
		title: emptyLocalizedText,
		description: emptyLocalizedText,
		gallery: [],

		productitle: emptyLocalizedText,
		productdescription: emptyLocalizedText,

		servicetitle: emptyLocalizedText,
		servicedesription: emptyLocalizedText,

		machinetitle: emptyLocalizedText,
		machinedescription: emptyLocalizedText,
		machinebackgroundimage: emptySingleImage,

		machine1title: emptyLocalizedText,
		machine1subtitle: emptyLocalizedText,
		machine1description: emptyLocalizedText,
		machine1image: emptySingleImage,

		machine2title: emptyLocalizedText,
		machine2subtitle: emptyLocalizedText,
		machine2description: emptyLocalizedText,
		machine2image: emptySingleImage,

		machine3title: emptyLocalizedText,
		machine3subtitle: emptyLocalizedText,
		machine3description: emptyLocalizedText,
		machine3image: emptySingleImage,

		clienttitle: emptyLocalizedText,
		clientdescription: emptyLocalizedText,
		clientimagegallery: [],

		projecttitle: emptyLocalizedText,
	};

	const db = await getDatabase();

	const document = await db
		.collection<HeroInfoDocument>("heroInfo")
		.findOne({ id: "hero-info" });

	if (!document) {
		return emptyHeroInfo;
	}

	return {
		title: document.title ?? emptyHeroInfo.title,
		description: document.description ?? emptyHeroInfo.description,
		gallery: document.gallery ?? emptyHeroInfo.gallery,

		productitle: document.productitle ?? emptyHeroInfo.productitle,
		productdescription:
			document.productdescription ?? emptyHeroInfo.productdescription,

		servicetitle: document.servicetitle ?? emptyHeroInfo.servicetitle,
		servicedesription:
			document.servicedesription ?? emptyHeroInfo.servicedesription,

		machinetitle: document.machinetitle ?? emptyHeroInfo.machinetitle,
		machinedescription:
			document.machinedescription ?? emptyHeroInfo.machinedescription,
		machinebackgroundimage:
			document.machinebackgroundimage ?? emptyHeroInfo.machinebackgroundimage,

		machine1title: document.machine1title ?? emptyHeroInfo.machine1title,
		machine1subtitle:
			document.machine1subtitle ?? emptyHeroInfo.machine1subtitle,
		machine1description:
			document.machine1description ?? emptyHeroInfo.machine1description,
		machine1image: document.machine1image ?? emptyHeroInfo.machine1image,

		machine2title: document.machine2title ?? emptyHeroInfo.machine2title,
		machine2subtitle:
			document.machine2subtitle ?? emptyHeroInfo.machine2subtitle,
		machine2description:
			document.machine2description ?? emptyHeroInfo.machine2description,
		machine2image: document.machine2image ?? emptyHeroInfo.machine2image,

		machine3title: document.machine3title ?? emptyHeroInfo.machine3title,
		machine3subtitle:
			document.machine3subtitle ?? emptyHeroInfo.machine3subtitle,
		machine3description:
			document.machine3description ?? emptyHeroInfo.machine3description,
		machine3image: document.machine3image ?? emptyHeroInfo.machine3image,

		clienttitle: document.clienttitle ?? emptyHeroInfo.clienttitle,
		clientdescription:
			document.clientdescription ?? emptyHeroInfo.clientdescription,
		clientimagegallery:
			document.clientimagegallery ?? emptyHeroInfo.clientimagegallery,

		projecttitle: document.projecttitle ?? emptyHeroInfo.projecttitle,
	};
}