"use server";

import { Buffer } from "buffer";
import fs from "fs/promises";
import { revalidatePath, revalidateTag } from "next/cache";
import path from "path";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { updateContactInfo } from "src/server/contact";
import { z } from "zod";
import type {
	ContactInfoFormData,
	ContactSingleImage,
	LocalizedText,
	WorkingHours,
} from "./contact.type";
import { SocialMediaPlatformId } from "./social-media/social-media.type";

type UploadContactImageResult =
	| {
			success: true;
			data: string;
	  }
	| {
			success: false;
			error: string;
	  };

const localizedTextSchema = z.object({
	en: z.string(),
	vi: z.string(),
});

const singleImageSchema = z.object({
	url: z.string(),
});

const contactInfoSchema = z.object({
	phone1: z
		.string()
		.min(1, "Primary phone is required")
		.regex(
			/^[0-9+\-\s()]+$/,
			"Primary phone must contain only numbers, spaces, hyphens, parentheses, and plus signs",
		),
	phone2: z
		.string()
		.optional()
		.refine(
			(val) => !val || /^[0-9+\-\s()]+$/.test(val),
			"Secondary phone must contain only numbers, spaces, hyphens, parentheses, and plus signs",
		),
	email1: z.string().email("Invalid primary email").min(1, "Primary email is required"),
	email2: z.string().email("Invalid secondary email").optional(),

	consultanttitle: localizedTextSchema,
	consultantsubtitle: localizedTextSchema,
	consultantdescription: localizedTextSchema,
	consultantimage: singleImageSchema,

	footerlogo: singleImageSchema,
	footercompanyname: localizedTextSchema,
	footercompanydescription: localizedTextSchema,

	workingHours: z.object({
		en: z.string().min(1, "English working hours are required"),
		vi: z.string().min(1, "Vietnamese working hours are required"),
	}),

	socialMediaLinks: z
		.array(
			z.object({
				platformId: z.nativeEnum(SocialMediaPlatformId),
				url: z
					.string()
					.min(1, "Social media URL is required")
					.refine(
						(url) => {
							if (!url.trim()) return true;

							try {
								new URL(url);
								return true;
							} catch {
								return false;
							}
						},
						{
							message:
								"Please enter a valid URL (e.g., https://facebook.com/yourpage)",
						},
					),
			}),
		)
		.optional()
		.default([]),
});

function getLocalizedText(formData: FormData, key: string): LocalizedText {
	return {
		en: (formData.get(`${key}En`) as string) || "",
		vi: (formData.get(`${key}Vi`) as string) || "",
	};
}

function parseSingleImage(formData: FormData, key: string): ContactSingleImage {
	const value = formData.get(key) as string | null;

	if (!value) {
		return { url: "" };
	}

	try {
		const parsed = JSON.parse(value) as ContactSingleImage;

		return {
			url: parsed?.url || "",
		};
	} catch {
		return { url: "" };
	}
}

function parseSocialMediaLinks(formData: FormData) {
	const socialMediaLinksData = formData.get("socialMediaLinks") as string | null;

	if (!socialMediaLinksData) return [];

	try {
		return JSON.parse(socialMediaLinksData);
	} catch {
		return [];
	}
}

export async function updateContactInformation(
	formData: FormData,
): Promise<FormResult> {
	try {
		const phone2 = (formData.get("phone2") as string) || "";
		const email2 = (formData.get("email2") as string) || "";

		const workingHours: WorkingHours = {
			en:
				(formData.get("workingHoursEn") as string) ||
				"Monday - Friday: 8:00 AM - 5:30 PM | Saturday: 8:00 AM - 12:00 PM",
			vi:
				(formData.get("workingHoursVi") as string) ||
				"Thứ 2 - Thứ 6: 08:00 - 17:30 | Thứ 7: 08:00 - 12:00",
		};

		const rawData: ContactInfoFormData = {
			phone1: (formData.get("phone1") as string) || "",
			phone2: phone2 || undefined,
			email1: (formData.get("email1") as string) || "",
			email2: email2 || undefined,

			consultanttitle: getLocalizedText(formData, "consultanttitle"),
			consultantsubtitle: getLocalizedText(formData, "consultantsubtitle"),
			consultantdescription: getLocalizedText(
				formData,
				"consultantdescription",
			),
			consultantimage: parseSingleImage(formData, "consultantimage"),

			footerlogo: parseSingleImage(formData, "footerlogo"),
			footercompanyname: getLocalizedText(formData, "footercompanyname"),
			footercompanydescription: getLocalizedText(
				formData,
				"footercompanydescription",
			),

			workingHours,
			socialMediaLinks: parseSocialMediaLinks(formData),
		};

		const validationResult = contactInfoSchema.safeParse(rawData);

		if (!validationResult.success) {
			const errorMessages = validationResult.error.errors.map((err) => {
				const fieldPath = err.path.join(".");

				if (
					fieldPath.includes("socialMediaLinks") &&
					fieldPath.includes("url")
				) {
					const linkIndex = err.path[1] as number;
					const platformId = rawData.socialMediaLinks?.[linkIndex]?.platformId;
					const platformName = platformId
						? platformId.charAt(0).toUpperCase() + platformId.slice(1)
						: "Social media";

					return `${platformName} URL: ${err.message}`;
				}

				return `${fieldPath}: ${err.message}`;
			});

			return {
				success: false,
				error: `Validation failed: ${errorMessages.join(", ")}`,
			};
		}

		const validatedData: ContactInfoFormData = validationResult.data;
		const result = await updateContactInfo(validatedData);

		if (result.success) {
			//revalidateTag(CACHE_TAGS.CONTACT);
			revalidatePath("/admin/contact");

			return {
				success: true,
				refresh: true,
			};
		}

		return {
			success: false,
			error: result.error || "Failed to update contact information",
		};
	} catch (error) {
		console.error("Error updating contact information:", error);

		return {
			success: false,
			error: "An unexpected error occurred while updating contact information",
		};
	}
}

export async function uploadContactImage(
	formData: FormData,
): Promise<UploadContactImageResult> {
	try {
		const file = formData.get("image") as File | null;

		if (!file || file.size === 0) {
			return {
				success: false,
				error: "No image selected",
			};
		}

		const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

		if (!allowedTypes.includes(file.type)) {
			return {
				success: false,
				error: "Only JPG, PNG, WEBP, or SVG images are allowed",
			};
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const uploadDir = path.join(process.cwd(), "public", "uploads", "contact");

		await fs.mkdir(uploadDir, { recursive: true });

		const ext = file.name.split(".").pop() || "jpg";
		const fileName = `contact-${Date.now()}.${ext}`;
		const filePath = path.join(uploadDir, fileName);

		await fs.writeFile(filePath, buffer);

		return {
			success: true,
			data: `/uploads/contact/${fileName}`,
		};
	} catch (error) {
		console.error("Upload contact image error:", error);

		return {
			success: false,
			error: "Failed to upload contact image",
		};
	}
}