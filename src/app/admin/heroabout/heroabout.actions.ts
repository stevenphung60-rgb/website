"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { uploadImageFile } from "src/lib/s3";
import { updateHeroAboutInfo } from "src/server/heroabout";
import type {
	HeroAboutImage,
	HeroAboutInfoFormData,
	LocalizedText,
} from "./heroabout.type";

type UploadHeroAboutImageResult =
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

const requiredLocalizedTextSchema = z.object({
	en: z.string(),
	vi: z.string().min(1, "Nội dung tiếng Việt là bắt buộc"),
});

const galleryImageSchema = z.object({
	url: z.string().min(1),
	order: z.number(),
});

const heroAboutInfoSchema = z.object({
	title: requiredLocalizedTextSchema,
	description: requiredLocalizedTextSchema,
	gallery: z.array(galleryImageSchema).default([]),

	factoryaddress: localizedTextSchema,
	officeaddress: localizedTextSchema,
	youtubelink: localizedTextSchema,
	videotitle: localizedTextSchema,
	videodescription: localizedTextSchema,

	historytitle: localizedTextSchema,
	historydescription: localizedTextSchema,
	historytime1: localizedTextSchema,
	historytitle1: localizedTextSchema,
	historydetail1: localizedTextSchema,
	historytime2: localizedTextSchema,
	historytitle2: localizedTextSchema,
	historydetail2: localizedTextSchema,
	historytime3: localizedTextSchema,
	historytitle3: localizedTextSchema,
	historydetail3: localizedTextSchema,

	valuestatementtitle: localizedTextSchema,
	valuestatementtitle1: localizedTextSchema,
	valuestatementdetail1: localizedTextSchema,
	valuestatementtitle2: localizedTextSchema,
	valuestatementdetail2: localizedTextSchema,
	valuestatementtitle3: localizedTextSchema,
	valuestatementdetail3: localizedTextSchema,

	capacitytitle: localizedTextSchema,
	capacitydescription: localizedTextSchema,
	capacitytitle1: localizedTextSchema,
	capacitydetail1: localizedTextSchema,
	capacitytitle2: localizedTextSchema,
	capacitydetail2: localizedTextSchema,
	capacitytitle3: localizedTextSchema,
	capacitydetail3: localizedTextSchema,
	capacitytitle4: localizedTextSchema,
	capacitydetail4: localizedTextSchema,
});

/**
 * Get a string value from form data
 * @param formData - Submitted form data
 * @param key - Field key
 * @returns String value from form data
 */
function getFormString(formData: FormData, key: string): string {
	return ((formData.get(key) as string | null) || "").trim();
}

/**
 * Get localized text from form data and fallback missing language
 * @param formData - Submitted form data
 * @param key - Base field key
 * @returns Localized text
 */
function getLocalizedText(formData: FormData, key: string): LocalizedText {
	const vi = getFormString(formData, `${key}Vi`);
	const en = getFormString(formData, `${key}En`);

	return {
		vi: vi || en,
		en: en || vi,
	};
}

/**
 * Parse gallery data from hidden form input
 * @param value - Form data value
 * @returns Gallery image array
 */
function parseGallery(value: FormDataEntryValue | null): HeroAboutImage[] {
	try {
		const parsedValue = JSON.parse((value as string) || "[]");

		if (!Array.isArray(parsedValue)) {
			return [];
		}

		return parsedValue
			.filter((image) => image?.url)
			.map((image, index) => ({
				url: String(image.url || ""),
				order:
					typeof image.order === "number" && Number.isFinite(image.order)
						? image.order
						: index,
			}));
	} catch {
		return [];
	}
}

/**
 * Revalidate about page content after update
 */
function revalidateHeroAboutPages(): void {
	revalidateTag(CACHE_TAGS.HEROABOUT, "max");
	revalidatePath("/admin/heroabout");
	revalidatePath("/vi/about");
	revalidatePath("/en/about");
	revalidatePath("/vi");
	revalidatePath("/en");
	revalidatePath("/");
}

/**
 * Update hero about information from admin form
 * @param formData - Submitted hero about form data
 * @returns Form result for admin UI
 */
export async function updateHeroAboutInformation(
	formData: FormData,
): Promise<FormResult> {
	try {
		const rawData: HeroAboutInfoFormData = {
			title: getLocalizedText(formData, "title"),
			description: getLocalizedText(formData, "description"),
			gallery: parseGallery(formData.get("gallery")),

			factoryaddress: getLocalizedText(formData, "factoryaddress"),
			officeaddress: getLocalizedText(formData, "officeaddress"),
			youtubelink: getLocalizedText(formData, "youtubelink"),
			videotitle: getLocalizedText(formData, "videotitle"),
			videodescription: getLocalizedText(formData, "videodescription"),

			historytitle: getLocalizedText(formData, "historytitle"),
			historydescription: getLocalizedText(formData, "historydescription"),
			historytime1: getLocalizedText(formData, "historytime1"),
			historytitle1: getLocalizedText(formData, "historytitle1"),
			historydetail1: getLocalizedText(formData, "historydetail1"),
			historytime2: getLocalizedText(formData, "historytime2"),
			historytitle2: getLocalizedText(formData, "historytitle2"),
			historydetail2: getLocalizedText(formData, "historydetail2"),
			historytime3: getLocalizedText(formData, "historytime3"),
			historytitle3: getLocalizedText(formData, "historytitle3"),
			historydetail3: getLocalizedText(formData, "historydetail3"),

			valuestatementtitle: getLocalizedText(formData, "valuestatementtitle"),
			valuestatementtitle1: getLocalizedText(formData, "valuestatementtitle1"),
			valuestatementdetail1: getLocalizedText(
				formData,
				"valuestatementdetail1",
			),
			valuestatementtitle2: getLocalizedText(formData, "valuestatementtitle2"),
			valuestatementdetail2: getLocalizedText(
				formData,
				"valuestatementdetail2",
			),
			valuestatementtitle3: getLocalizedText(formData, "valuestatementtitle3"),
			valuestatementdetail3: getLocalizedText(
				formData,
				"valuestatementdetail3",
			),

			capacitytitle: getLocalizedText(formData, "capacitytitle"),
			capacitydescription: getLocalizedText(formData, "capacitydescription"),
			capacitytitle1: getLocalizedText(formData, "capacitytitle1"),
			capacitydetail1: getLocalizedText(formData, "capacitydetail1"),
			capacitytitle2: getLocalizedText(formData, "capacitytitle2"),
			capacitydetail2: getLocalizedText(formData, "capacitydetail2"),
			capacitytitle3: getLocalizedText(formData, "capacitytitle3"),
			capacitydetail3: getLocalizedText(formData, "capacitydetail3"),
			capacitytitle4: getLocalizedText(formData, "capacitytitle4"),
			capacitydetail4: getLocalizedText(formData, "capacitydetail4"),
		};

		const validationResult = heroAboutInfoSchema.safeParse(rawData);

		if (!validationResult.success) {
			const errorMessages = validationResult.error.errors.map((error) => {
				const fieldPath = error.path.join(".");
				return `${fieldPath}: ${error.message}`;
			});

			return {
				success: false,
				error: `Vui lòng kiểm tra lại: ${errorMessages.join(", ")}`,
			};
		}

		const validatedData: HeroAboutInfoFormData = validationResult.data;
		const result = await updateHeroAboutInfo(validatedData);

		if (result.success) {
			revalidateHeroAboutPages();

			return {
				success: true,
				refresh: true,
			};
		}

		return {
			success: false,
			error: result.error || "Không thể cập nhật nội dung giới thiệu",
		};
	} catch (error) {
		console.error("Error updating hero about information:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi cập nhật nội dung giới thiệu. Vui lòng thử lại.",
		};
	}
}

/**
 * Upload about page image to local uploads folder
 * @param formData - Form data containing image file
 * @returns Uploaded image URL or error
 */
export async function uploadHeroAboutGalleryImage(
	formData: FormData,
): Promise<UploadHeroAboutImageResult> {
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

		const maxFileSize = 10 * 1024 * 1024;

		if (file.size > maxFileSize) {
			return {
				success: false,
				error: "Ảnh không được vượt quá 10MB",
			};
		}

		const url = await uploadImageFile(file, "heroabout", "heroabout");

		return {
			success: true,
			data: url,
		};
	} catch (error) {
		console.error("Upload hero about image error:", error);

		return {
			success: false,
			error: "Không thể tải ảnh lên. Vui lòng thử lại.",
		};
	}
}