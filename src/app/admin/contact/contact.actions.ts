"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { uploadImageFile } from "src/lib/s3";
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
		.min(1, "Số điện thoại chính là bắt buộc")
		.regex(
			/^[0-9+\-\s()]+$/,
			"Số điện thoại chính chỉ được chứa số, khoảng trắng, dấu gạch ngang, ngoặc và dấu cộng",
		),
	phone2: z
		.string()
		.optional()
		.refine(
			(value) => !value || /^[0-9+\-\s()]+$/.test(value),
			"Số điện thoại phụ chỉ được chứa số, khoảng trắng, dấu gạch ngang, ngoặc và dấu cộng",
		),
	email1: z.string().email("Email chính không hợp lệ").min(1, "Email chính là bắt buộc"),
	email2: z.string().email("Email phụ không hợp lệ").optional(),

	consultanttitle: localizedTextSchema,
	consultantsubtitle: localizedTextSchema,
	consultantdescription: localizedTextSchema,
	consultantimage: singleImageSchema,

	footerlogo: singleImageSchema,
	footercompanyname: localizedTextSchema,
	footercompanydescription: localizedTextSchema,

	workingHours: z.object({
		en: z.string().min(1, "Giờ làm việc tiếng Anh là bắt buộc"),
		vi: z.string().min(1, "Giờ làm việc tiếng Việt là bắt buộc"),
	}),

	socialMediaLinks: z
		.array(
			z.object({
				platformId: z.nativeEnum(SocialMediaPlatformId),
				url: z
					.string()
					.min(1, "Đường dẫn mạng xã hội là bắt buộc")
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
								"Vui lòng nhập đường dẫn hợp lệ, ví dụ: https://facebook.com/ten-trang",
						},
					),
			}),
		)
		.optional()
		.default([]),
});

/**
 * Get localized text from form data
 * @param formData - Submitted form data
 * @param key - Base form field key
 * @returns Localized text value
 */
function getLocalizedText(formData: FormData, key: string): LocalizedText {
	return {
		en: (formData.get(`${key}En`) as string) || "",
		vi: (formData.get(`${key}Vi`) as string) || "",
	};
}

/**
 * Parse single image data from form data
 * @param formData - Submitted form data
 * @param key - Image field key
 * @returns Parsed single image object
 */
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

/**
 * Parse social media links from form data
 * @param formData - Submitted form data
 * @returns Social media links array
 */
function parseSocialMediaLinks(formData: FormData) {
	const socialMediaLinksData = formData.get("socialMediaLinks") as string | null;

	if (!socialMediaLinksData) return [];

	try {
		return JSON.parse(socialMediaLinksData);
	} catch {
		return [];
	}
}

/**
 * Revalidate contact-related admin and public pages
 */
function revalidateContactPages(): void {
	revalidateTag(CACHE_TAGS.CONTACT, "max");
	revalidatePath("/admin/contact");
	revalidatePath("/vi");
	revalidatePath("/en");
	revalidatePath("/vi/contact");
	revalidatePath("/en/contact");
}

/**
 * Update contact information from admin form
 * @param formData - Submitted contact form data
 * @returns Form result for admin UI
 */
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
			const errorMessages = validationResult.error.errors.map((error) => {
				const fieldPath = error.path.join(".");

				if (
					fieldPath.includes("socialMediaLinks") &&
					fieldPath.includes("url")
				) {
					const linkIndex = error.path[1] as number;
					const platformId = rawData.socialMediaLinks?.[linkIndex]?.platformId;
					const platformName = platformId
						? platformId.charAt(0).toUpperCase() + platformId.slice(1)
						: "Mạng xã hội";

					return `${platformName}: ${error.message}`;
				}

				return error.message;
			});

			return {
				success: false,
				error: `Vui lòng kiểm tra lại: ${errorMessages.join(", ")}`,
			};
		}

		const validatedData: ContactInfoFormData = validationResult.data;
		const result = await updateContactInfo(validatedData);

		if (result.success) {
			revalidateContactPages();

			return {
				success: true,
				refresh: true,
			};
		}

		return {
			success: false,
			error: result.error || "Không thể cập nhật thông tin liên hệ",
		};
	} catch (error) {
		console.error("Error updating contact information:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi cập nhật thông tin liên hệ. Vui lòng thử lại.",
		};
	}
}

/**
 * Upload contact image to local uploads folder
 * @param formData - Form data containing image file
 * @returns Uploaded image URL or error
 */
export async function uploadContactImage(
	formData: FormData,
): Promise<UploadContactImageResult> {
	try {
		const file = formData.get("image") as File | null;

		if (!file || file.size === 0) {
			return {
				success: false,
				error: "Vui lòng chọn ảnh",
			};
		}

		const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

		if (!allowedTypes.includes(file.type)) {
			return {
				success: false,
				error: "Chỉ hỗ trợ ảnh JPG, PNG, WEBP hoặc SVG",
			};
		}

		const url = await uploadImageFile(file, "contact", "contact");

		return {
			success: true,
			data: url,
		};
	} catch (error) {
		console.error("Upload contact image error:", error);

		return {
			success: false,
			error: "Không thể tải ảnh lên. Vui lòng thử lại.",
		};
	}
}