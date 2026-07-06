"use server";

import { Buffer } from "buffer";
import fs from "fs/promises";
import { revalidatePath, revalidateTag } from "next/cache";
import path from "path";
import { z } from "zod";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { updateHeroBrandInfo } from "src/server/herobrand";
import type {
	HeroBrandInfoFormData,
	HeroBrandLogo,
	LocalizedText,
} from "./herobrand.type";

type UploadHeroBrandImageResult =
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
	vi: z.string().min(1, "Tên công ty tiếng Việt là bắt buộc"),
});

const heroBrandLogoSchema = z.object({
	url: z.string(),
});

const heroBrandInfoSchema = z.object({
	logo: heroBrandLogoSchema,
	companyName: localizedTextSchema,
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
 * Get localized company name from form data
 * @param formData - Submitted form data
 * @param key - Base field key
 * @returns Localized text with English fallback
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
 * Parse logo data from hidden form input
 * @param formData - Submitted form data
 * @returns Logo data
 */
function parseLogo(formData: FormData): HeroBrandLogo {
	const value = formData.get("logo") as string | null;

	if (!value) {
		return { url: "" };
	}

	try {
		const parsed = JSON.parse(value) as HeroBrandLogo;

		return {
			url: parsed?.url || "",
		};
	} catch {
		return { url: "" };
	}
}

/**
 * Revalidate brand-related pages
 */
function revalidateHeroBrandPages(): void {
	revalidateTag(CACHE_TAGS.HEROBRAND, "max");
	revalidatePath("/admin/herobrand");
	revalidatePath("/vi");
	revalidatePath("/en");
	revalidatePath("/");
}

/**
 * Update logo and company name from admin form
 * @param formData - Submitted hero brand form data
 * @returns Form result for admin UI
 */
export async function updateHeroBrandInformation(
	formData: FormData,
): Promise<FormResult> {
	try {
		const rawData: HeroBrandInfoFormData = {
			logo: parseLogo(formData),
			companyName: getLocalizedText(formData, "companyName"),
		};

		const validationResult = heroBrandInfoSchema.safeParse(rawData);

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

		const validatedData: HeroBrandInfoFormData = validationResult.data;
		const result = await updateHeroBrandInfo(validatedData);

		if (result.success) {
			revalidateHeroBrandPages();

			return {
				success: true,
				refresh: true,
			};
		}

		return {
			success: false,
			error: result.error || "Không thể cập nhật logo và tên công ty",
		};
	} catch (error) {
		console.error("Error updating hero brand information:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi cập nhật logo và tên công ty. Vui lòng thử lại.",
		};
	}
}

/**
 * Upload brand logo to local uploads folder
 * @param formData - Form data containing image file
 * @returns Uploaded image URL or error
 */
export async function uploadHeroBrandLogoImage(
	formData: FormData,
): Promise<UploadHeroBrandImageResult> {
	try {
		const file = formData.get("image") as File | null;

		if (!file || file.size === 0) {
			return {
				success: false,
				error: "Vui lòng chọn logo",
			};
		}

		const allowedTypes = [
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/svg+xml",
		];

		if (!allowedTypes.includes(file.type)) {
			return {
				success: false,
				error: "Chỉ hỗ trợ ảnh JPG, PNG, WEBP hoặc SVG",
			};
		}

		const maxFileSize = 5 * 1024 * 1024;

		if (file.size > maxFileSize) {
			return {
				success: false,
				error: "Logo không được vượt quá 5MB",
			};
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const uploadDir = path.join(process.cwd(), "public", "uploads", "herobrand");

		await fs.mkdir(uploadDir, { recursive: true });

		const ext = file.name.split(".").pop() || "jpg";
		const fileName = `herobrand-logo-${Date.now()}.${ext}`;
		const filePath = path.join(uploadDir, fileName);

		await fs.writeFile(filePath, buffer);

		return {
			success: true,
			data: `/uploads/herobrand/${fileName}`,
		};
	} catch (error) {
		console.error("Upload hero brand logo error:", error);

		return {
			success: false,
			error: "Không thể tải logo lên. Vui lòng thử lại.",
		};
	}
}