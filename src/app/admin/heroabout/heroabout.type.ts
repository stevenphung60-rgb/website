/**
 * HeroAbout information data types
 * Defines the structure for hero about information and related data
 */

export interface LocalizedText {
	en: string;
	vi: string;
}

export interface HeroAboutImage {
	url: string;
	order: number;
}

/**
 * HeroAbout information data structure
 */
export interface HeroAboutInfo {
	title: LocalizedText;
	description: LocalizedText;
	gallery: HeroAboutImage[];

	factoryaddress: LocalizedText;
	officeaddress: LocalizedText;
	youtubelink: LocalizedText;
	videotitle: LocalizedText;
	videodescription: LocalizedText;

	historytitle: LocalizedText;
	historydescription: LocalizedText;
	historytime1: LocalizedText;
	historytitle1: LocalizedText;
	historydetail1: LocalizedText;
	historytime2: LocalizedText;
	historytitle2: LocalizedText;
	historydetail2: LocalizedText;
	historytime3: LocalizedText;
	historytitle3: LocalizedText;
	historydetail3: LocalizedText;

	valuestatementtitle: LocalizedText;
	valuestatementtitle1: LocalizedText;
	valuestatementdetail1: LocalizedText;
	valuestatementtitle2: LocalizedText;
	valuestatementdetail2: LocalizedText;
	valuestatementtitle3: LocalizedText;
	valuestatementdetail3: LocalizedText;

	capacitytitle: LocalizedText;
	capacitydescription: LocalizedText;
	capacitytitle1: LocalizedText;
	capacitydetail1: LocalizedText;
	capacitytitle2: LocalizedText;
	capacitydetail2: LocalizedText;
	capacitytitle3: LocalizedText;
	capacitydetail3: LocalizedText;
	capacitytitle4: LocalizedText;
	capacitydetail4: LocalizedText;
}

/**
 * HeroAbout information database document
 */
export interface HeroAboutInfoDocument {
	_id?: unknown;
	id: string;
	title: LocalizedText;
	description: LocalizedText;
	gallery: HeroAboutImage[];

	factoryaddress: LocalizedText;
	officeaddress: LocalizedText;
	youtubelink: LocalizedText;
	videotitle: LocalizedText;
	videodescription: LocalizedText;

	historytitle: LocalizedText;
	historydescription: LocalizedText;
	historytime1: LocalizedText;
	historytitle1: LocalizedText;
	historydetail1: LocalizedText;
	historytime2: LocalizedText;
	historytitle2: LocalizedText;
	historydetail2: LocalizedText;
	historytime3: LocalizedText;
	historytitle3: LocalizedText;
	historydetail3: LocalizedText;

	valuestatementtitle: LocalizedText;
	valuestatementtitle1: LocalizedText;
	valuestatementdetail1: LocalizedText;
	valuestatementtitle2: LocalizedText;
	valuestatementdetail2: LocalizedText;
	valuestatementtitle3: LocalizedText;
	valuestatementdetail3: LocalizedText;

	capacitytitle: LocalizedText;
	capacitydescription: LocalizedText;
	capacitytitle1: LocalizedText;
	capacitydetail1: LocalizedText;
	capacitytitle2: LocalizedText;
	capacitydetail2: LocalizedText;
	capacitytitle3: LocalizedText;
	capacitydetail3: LocalizedText;
	capacitytitle4: LocalizedText;
	capacitydetail4: LocalizedText;

	createdAt: Date;
	updatedAt: Date;
}

/**
 * HeroAbout information form data
 */
export interface HeroAboutInfoFormData {
	title: LocalizedText;
	description: LocalizedText;
	gallery: HeroAboutImage[];

	factoryaddress: LocalizedText;
	officeaddress: LocalizedText;
	youtubelink: LocalizedText;
	videotitle: LocalizedText;
	videodescription: LocalizedText;

	historytitle: LocalizedText;
	historydescription: LocalizedText;
	historytime1: LocalizedText;
	historytitle1: LocalizedText;
	historydetail1: LocalizedText;
	historytime2: LocalizedText;
	historytitle2: LocalizedText;
	historydetail2: LocalizedText;
	historytime3: LocalizedText;
	historytitle3: LocalizedText;
	historydetail3: LocalizedText;

	valuestatementtitle: LocalizedText;
	valuestatementtitle1: LocalizedText;
	valuestatementdetail1: LocalizedText;
	valuestatementtitle2: LocalizedText;
	valuestatementdetail2: LocalizedText;
	valuestatementtitle3: LocalizedText;
	valuestatementdetail3: LocalizedText;

	capacitytitle: LocalizedText;
	capacitydescription: LocalizedText;
	capacitytitle1: LocalizedText;
	capacitydetail1: LocalizedText;
	capacitytitle2: LocalizedText;
	capacitydetail2: LocalizedText;
	capacitytitle3: LocalizedText;
	capacitydetail3: LocalizedText;
	capacitytitle4: LocalizedText;
	capacitydetail4: LocalizedText;
}