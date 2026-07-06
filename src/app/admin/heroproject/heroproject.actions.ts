"use server";

import { Buffer } from "buffer";
import fs from "fs/promises";
import { revalidatePath, revalidateTag } from "next/cache";
import path from "path";
import { z } from "zod";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { updateHeroProjectInfo } from "src/server/heroproject";
import type {
	HeroProjectImage,
	HeroProjectInfoFormData,
	LocalizedText,
} from "./heroproject.type";

type UploadHeroProjectImageResult =
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
	vi: z.string().min(1, "Nội dung tiếng Việt là bắt buộc"),
});

const galleryImageSchema = z.object({
	url: z.string().min(1),
	order: z.number(),
});

const heroProjectInfoSchema = z.object({
	title: localizedTextSchema,
	description: localizedTextSchema,
	gallery: z.array(galleryImageSchema).default([]),
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
function parseGallery(value: FormDataEntryValue | null): HeroProjectImage[] {
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
 * Revalidate project banner pages after update
 */
function revalidateHeroProjectPages(): void {
	revalidateTag(CACHE_TAGS.HEROPROJECT, "max");
	revalidatePath("/admin/heroproject");
	revalidatePath("/vi/projects");
	revalidatePath("/en/projects");
	revalidatePath("/vi");
	revalidatePath("/en");
	revalidatePath("/");
}

/**
 * Update hero project information from admin form
 * @param formData - Submitted hero project form data
 * @returns Form result for admin UI
 */
export async function updateHeroProjectInformation(
	formData: FormData,
): Promise<FormResult> {
	try {
		const rawData: HeroProjectInfoFormData = {
			title: getLocalizedText(formData, "title"),
			description: getLocalizedText(formData, "description"),
			gallery: parseGallery(formData.get("gallery")),
		};

		const validationResult = heroProjectInfoSchema.safeParse(rawData);

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

		const validatedData: HeroProjectInfoFormData = validationResult.data;
		const result = await updateHeroProjectInfo(validatedData);

		if (result.success) {
			revalidateHeroProjectPages();

			return {
				success: true,
				refresh: true,
			};
		}

		return {
			success: false,
			error: result.error || "Không thể cập nhật banner dự án",
		};
	} catch (error) {
		console.error("Error updating hero project information:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi cập nhật banner dự án. Vui lòng thử lại.",
		};
	}
}

/**
 * Upload project banner image to local uploads folder
 * @param formData - Form data containing image file
 * @returns Uploaded image URL or error
 */
export async function uploadHeroProjectGalleryImage(
	formData: FormData,
): Promise<UploadHeroProjectImageResult> {
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

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const uploadDir = path.join(process.cwd(), "public", "uploads", "heroproject");

		await fs.mkdir(uploadDir, { recursive: true });

		const ext = file.name.split(".").pop() || "jpg";
		const fileName = `heroproject-${Date.now()}.${ext}`;
		const filePath = path.join(uploadDir, fileName);

		await fs.writeFile(filePath, buffer);

		return {
			success: true,
			data: `/uploads/heroproject/${fileName}`,
		};
	} catch (error) {
		console.error("Upload hero project image error:", error);

		return {
			success: false,
			error: "Không thể tải ảnh lên. Vui lòng thử lại.",
		};
	}
}