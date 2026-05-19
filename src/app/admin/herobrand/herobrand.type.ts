/**
 * HeroBrand information data types
 * Defines the structure for hero brand information and related data
 */

export interface LocalizedText {
	en: string;
	vi: string;
}

export interface HeroBrandLogo {
	url: string;
}

/**
 * HeroBrand information data structure
 */
export interface HeroBrandInfo {
	logo: HeroBrandLogo;
	companyName: LocalizedText;
}

/**
 * HeroBrand information database document
 */
export interface HeroBrandInfoDocument {
	_id?: unknown;
	id: string;

	logo: HeroBrandLogo;
	companyName: LocalizedText;

	createdAt: Date;
	updatedAt: Date;
}

/**
 * HeroBrand information form data
 */
export interface HeroBrandInfoFormData {
	logo: HeroBrandLogo;
	companyName: LocalizedText;
}