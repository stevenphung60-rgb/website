"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { uploadImageFile } from "src/lib/s3";
import { updateHeroInfo } from "src/server/hero";
import type {
	HeroImage,
	HeroInfoFormData,
	HeroSingleImage,
	LocalizedText,
} from "./hero.type";

type UploadHeroImageResult =
	| {
			success: true;
			data: string;
	  }
	| {
			success: false;
			error: string;
	  };

const emptySingleImage: HeroSingleImage = {
	url: "",
};

const localizedTextSchema = z.object({
	en: z.string(),
	vi: z.string(),
});

const requiredLocalizedTextSchema = z.object({
	en: z.string(),
	vi: z.string().min(1, "Nội dung tiếng Việt là bắt buộc"),
});

const singleImageSchema = z.object({
	url: z.string().default(""),
});

const galleryImageSchema = z.object({
	url: z.string().min(1),
	order: z.number(),
});

const heroInfoSchema = z.object({
	title: requiredLocalizedTextSchema,
	description: requiredLocalizedTextSchema,
	gallery: z.array(galleryImageSchema).default([]),

	productitle: localizedTextSchema,
	productdescription: localizedTextSchema,

	servicetitle: localizedTextSchema,
	servicedesription: localizedTextSchema,

	machinetitle: localizedTextSchema,
	machinedescription: localizedTextSchema,
	machinebackgroundimage: singleImageSchema,

	machine1title: localizedTextSchema,
	machine1subtitle: localizedTextSchema,
	machine1description: localizedTextSchema,
	machine1image: singleImageSchema,

	machine2title: localizedTextSchema,
	machine2subtitle: localizedTextSchema,
	machine2description: localizedTextSchema,
	machine2image: singleImageSchema,

	machine3title: localizedTextSchema,
	machine3subtitle: localizedTextSchema,
	machine3description: localizedTextSchema,
	machine3image: singleImageSchema,

	clienttitle: localizedTextSchema,
	clientdescription: localizedTextSchema,
	clientimagegallery: z.array(galleryImageSchema).default([]),

	projecttitle: localizedTextSchema,
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
function parseGallery(value: FormDataEntryValue | null): HeroImage[] {
	try {
		const parsedValue = JSON.parse((value as string) || "[]");

		if (!Array.isArray(parsedValue)) return [];

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
 * Parse single image data from hidden form input
 * @param value - Form data value
 * @returns Single image object
 */
function parseSingleImage(value: FormDataEntryValue | null): HeroSingleImage {
	try {
		const parsedValue = JSON.parse((value as string) || "{}");

		return {
			url: String(parsedValue?.url || ""),
		};
	} catch {
		return emptySingleImage;
	}
}

/**
 * Revalidate home hero related pages
 */
function revalidateHeroPages(): void {
	revalidateTag(CACHE_TAGS.HERO, "max");
	revalidatePath("/admin/hero");
	revalidatePath("/vi");
	revalidatePath("/en");
	revalidatePath("/");
}

/**
 * Update hero information from admin form
 * @param formData - Submitted hero form data
 * @returns Form result for admin UI
 */
export async function updateHeroInformation(
	formData: FormData,
): Promise<FormResult> {
	try {
		const rawData: HeroInfoFormData = {
			title: getLocalizedText(formData, "title"),
			description: getLocalizedText(formData, "description"),
			gallery: parseGallery(formData.get("gallery")),

			productitle: getLocalizedText(formData, "productitle"),
			productdescription: getLocalizedText(formData, "productdescription"),

			servicetitle: getLocalizedText(formData, "servicetitle"),
			servicedesription: getLocalizedText(formData, "servicedesription"),

			machinetitle: getLocalizedText(formData, "machinetitle"),
			machinedescription: getLocalizedText(formData, "machinedescription"),
			machinebackgroundimage: parseSingleImage(
				formData.get("machinebackgroundimage"),
			),

			machine1title: getLocalizedText(formData, "machine1title"),
			machine1subtitle: getLocalizedText(formData, "machine1subtitle"),
			machine1description: getLocalizedText(formData, "machine1description"),
			machine1image: parseSingleImage(formData.get("machine1image")),

			machine2title: getLocalizedText(formData, "machine2title"),
			machine2subtitle: getLocalizedText(formData, "machine2subtitle"),
			machine2description: getLocalizedText(formData, "machine2description"),
			machine2image: parseSingleImage(formData.get("machine2image")),

			machine3title: getLocalizedText(formData, "machine3title"),
			machine3subtitle: getLocalizedText(formData, "machine3subtitle"),
			machine3description: getLocalizedText(formData, "machine3description"),
			machine3image: parseSingleImage(formData.get("machine3image")),

			clienttitle: getLocalizedText(formData, "clienttitle"),
			clientdescription: getLocalizedText(formData, "clientdescription"),
			clientimagegallery: parseGallery(formData.get("clientimagegallery")),

			projecttitle: getLocalizedText(formData, "projecttitle"),
		};

		const validationResult = heroInfoSchema.safeParse(rawData);

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

		const validatedData: HeroInfoFormData = validationResult.data;
		const result = await updateHeroInfo(validatedData);

		if (result.success) {
			revalidateHeroPages();

			return {
				success: true,
				refresh: true,
			};
		}

		return {
			success: false,
			error: result.error || "Không thể cập nhật nội dung trang chủ",
		};
	} catch (error) {
		console.error("Error updating hero information:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi cập nhật nội dung trang chủ. Vui lòng thử lại.",
		};
	}
}

/**
 * Upload hero image to local uploads folder
 * @param formData - Form data containing image file
 * @returns Uploaded image URL or error
 */
export async function uploadHeroGalleryImage(
	formData: FormData,
): Promise<UploadHeroImageResult> {
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

		const url = await uploadImageFile(file, "hero", "hero");

		return {
			success: true,
			data: url,
		};
	} catch (error) {
		console.error("Upload hero image error:", error);

		return {
			success: false,
			error: "Không thể tải ảnh lên. Vui lòng thử lại.",
		};
	}
}