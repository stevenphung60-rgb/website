/**
 * Database query to get contact information
 * Retrieves the current contact information from the database
 */

import { cacheTag } from "next/cache";
import type {
	ContactInfo,
	ContactInfoDocument,
} from "src/app/admin/contact/contact.type";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";

/**
 * Get current contact information from database
 * @returns Promise that resolves to contact information (empty data if not found)
 */
export async function getContactInfo(): Promise<ContactInfo> {
	"use cache";
	cacheTag(CACHE_TAGS.CONTACT);

	const emptyContactInfo: ContactInfo = {
		phone1: "",
		phone2: "",
		email1: "",
		email2: "",

		consultanttitle: {
			en: "",
			vi: "",
		},
		consultantsubtitle: {
			en: "",
			vi: "",
		},
		consultantdescription: {
			en: "",
			vi: "",
		},
		consultantimage: {
			url: "",
		},

		footerlogo: {
			url: "",
		},
		footercompanyname: {
			en: "",
			vi: "",
		},
		footercompanydescription: {
			en: "",
			vi: "",
		},

		workingHours: {
			en: "",
			vi: "",
		},
		socialMedia: [],
	};

	const db = await getDatabase();

	const document = await db
		.collection<ContactInfoDocument>("contactInfo")
		.findOne({ id: "contact-info" });

	if (!document) {
		return emptyContactInfo;
	}

	return {
		phone1: document.phone1 ?? emptyContactInfo.phone1,
		phone2: document.phone2 ?? emptyContactInfo.phone2,
		email1: document.email1 ?? emptyContactInfo.email1,
		email2: document.email2 ?? emptyContactInfo.email2,

		consultanttitle:
			document.consultanttitle ?? emptyContactInfo.consultanttitle,
		consultantsubtitle:
			document.consultantsubtitle ?? emptyContactInfo.consultantsubtitle,
		consultantdescription:
			document.consultantdescription ??
			emptyContactInfo.consultantdescription,
		consultantimage:
			document.consultantimage ?? emptyContactInfo.consultantimage,

		footerlogo: document.footerlogo ?? emptyContactInfo.footerlogo,
		footercompanyname:
			document.footercompanyname ?? emptyContactInfo.footercompanyname,
		footercompanydescription:
			document.footercompanydescription ??
			emptyContactInfo.footercompanydescription,

		workingHours: document.workingHours ?? emptyContactInfo.workingHours,

		socialMedia: (document.socialMedia ?? emptyContactInfo.socialMedia).map(
			(link) => ({
				id: link.id,
				platformId: link.platformId,
				url: link.url,
			}),
		),
	};
}