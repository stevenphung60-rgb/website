/**
 * HeroProject information data types
 * Defines the structure for hero project information and related data
 */

export interface LocalizedText {
	en: string;
	vi: string;
}

export interface HeroProjectImage {
	url: string;
	order: number;
}

/**
 * HeroProject information data structure
 */
export interface HeroProjectInfo {
	title: LocalizedText;
	description: LocalizedText;
	gallery: HeroProjectImage[];
}

/**
 * HeroProject information database document
 */
export interface HeroProjectInfoDocument {
	_id?: unknown;
	id: string;
	title: LocalizedText;
	description: LocalizedText;
	gallery: HeroProjectImage[];
	createdAt: Date;
	updatedAt: Date;
}

/**
 * HeroProject information form data
 */
export interface HeroProjectInfoFormData {
	title: LocalizedText;
	description: LocalizedText;
	gallery: HeroProjectImage[];
}