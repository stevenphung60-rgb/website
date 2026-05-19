/**
 * HeroContact information data types
 * Defines the structure for hero contact information and related data
 */

export interface LocalizedText {
	en: string;
	vi: string;
}

export interface HeroContactImage {
	url: string;
	order: number;
}

/**
 * HeroContact information data structure
 */
export interface HeroContactInfo {
	title: LocalizedText;
	description: LocalizedText;
	gallery: HeroContactImage[];
}

/**
 * HeroContact information database document
 */
export interface HeroContactInfoDocument {
	_id?: unknown;
	id: string;
	title: LocalizedText;
	description: LocalizedText;
	gallery: HeroContactImage[];
	createdAt: Date;
	updatedAt: Date;
}

/**
 * HeroContact information form data
 */
export interface HeroContactInfoFormData {
	title: LocalizedText;
	description: LocalizedText;
	gallery: HeroContactImage[];
}