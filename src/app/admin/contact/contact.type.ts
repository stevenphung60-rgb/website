/**
 * Contact information data types
 * Defines the structure for contact information and related data
 */

import type {
	SocialMediaLink,
	SocialMediaPlatformId,
} from "./social-media/social-media.type";

/**
 * Localized text information
 */
export interface LocalizedText {
	en: string;
	vi: string;
}

/**
 * Single image information
 */
export interface ContactSingleImage {
	url: string;
}

/**
 * Working hours information with simple text fields
 */
export interface WorkingHours {
	/**
	 * Working hours text in English
	 */
	en: string;

	/**
	 * Working hours text in Vietnamese
	 */
	vi: string;
}

/**
 * Contact information data structure
 */
export interface ContactInfo {
	/**
	 * Primary phone number
	 */
	phone1: string;

	/**
	 * Secondary phone number
	 */
	phone2: string;

	/**
	 * Primary email address
	 */
	email1: string;

	/**
	 * Secondary email address
	 */
	email2: string;

	/**
	 * Consultant CTA title
	 */
	consultanttitle: LocalizedText;

	/**
	 * Consultant CTA subtitle
	 */
	consultantsubtitle: LocalizedText;

	/**
	 * Consultant CTA description
	 */
	consultantdescription: LocalizedText;

	/**
	 * Consultant CTA image
	 */
	consultantimage: ContactSingleImage;

	/**
	 * Footer logo image
	 */
	footerlogo: ContactSingleImage;

	/**
	 * Footer company name
	 */
	footercompanyname: LocalizedText;

	/**
	 * Footer company description
	 */
	footercompanydescription: LocalizedText;

	/**
	 * Working hours information
	 */
	workingHours: WorkingHours;

	/**
	 * Social media links
	 */
	socialMedia: SocialMediaLink[];
}

/**
 * Contact information database document
 */
export interface ContactInfoDocument {
	_id?: unknown;
	id: string;

	phone1: string;
	phone2: string;
	email1: string;
	email2: string;

	consultanttitle: LocalizedText;
	consultantsubtitle: LocalizedText;
	consultantdescription: LocalizedText;
	consultantimage: ContactSingleImage;

	footerlogo: ContactSingleImage;
	footercompanyname: LocalizedText;
	footercompanydescription: LocalizedText;

	workingHours: WorkingHours;

	socialMedia: Array<{
		id: string;
		platformId: SocialMediaPlatformId;
		url: string;
	}>;

	createdAt: Date;
	updatedAt: Date;
}

/**
 * Contact information form data
 */
export interface ContactInfoFormData {
	phone1: string;
	phone2?: string;
	email1: string;
	email2?: string;

	consultanttitle: LocalizedText;
	consultantsubtitle: LocalizedText;
	consultantdescription: LocalizedText;
	consultantimage: ContactSingleImage;

	footerlogo: ContactSingleImage;
	footercompanyname: LocalizedText;
	footercompanydescription: LocalizedText;

	workingHours: WorkingHours;

	socialMediaLinks: Array<{
		platformId: SocialMediaPlatformId;
		url: string;
	}>;
}