/**
 * HeroService information data types
 * Defines the structure for hero service information and related data
 */

export interface LocalizedText {
	en: string;
	vi: string;
}

export interface HeroServiceImage {
	url: string;
	order: number;
}

/**
 * HeroService information data structure
 */
export interface HeroServiceInfo {
	title: LocalizedText;
	description: LocalizedText;
	gallery: HeroServiceImage[];
}

/**
 * HeroService information database document
 */
export interface HeroServiceInfoDocument {
	_id?: unknown;
	id: string;
	title: LocalizedText;
	description: LocalizedText;
	gallery: HeroServiceImage[];
	createdAt: Date;
	updatedAt: Date;
}

/**
 * HeroService information form data
 */
export interface HeroServiceInfoFormData {
	title: LocalizedText;
	description: LocalizedText;
	gallery: HeroServiceImage[];
}