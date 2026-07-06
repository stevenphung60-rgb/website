"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import {
	CUSTOM_FONT_PRESET_ID,
	isSiteFontId,
	isSiteFontPresetSelection,
	normalizeSiteAppearance,
	type SiteFontId,
	type SiteFontPresetSelection,
} from "src/lib/font-presets";
import { updateSiteAppearance } from "src/server/site-appearance";

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
 * Parse site appearance form data
 * @param formData - Submitted appearance form data
 * @returns Valid appearance data or form error result
 */
function parseSiteAppearanceFormData(
	formData: FormData,
):
	| {
			success: true;
			data: {
				fontPresetId: SiteFontPresetSelection;
				headingFontId?: SiteFontId;
				bodyFontId?: SiteFontId;
			};
	  }
	| {
			success: false;
			error: string;
	  } {
	const fontPresetId = getFormString(formData, "fontPresetId");

	if (!isSiteFontPresetSelection(fontPresetId)) {
		return {
			success: false,
			error: "Bộ font không hợp lệ. Vui lòng chọn lại.",
		};
	}

	if (fontPresetId !== CUSTOM_FONT_PRESET_ID) {
		return {
			success: true,
			data: {
				fontPresetId,
			},
		};
	}

	const headingFontId = getFormString(formData, "headingFontId");
	const bodyFontId = getFormString(formData, "bodyFontId");

	if (!isSiteFontId(headingFontId)) {
		return {
			success: false,
			error: "Font tiêu đề không hợp lệ. Vui lòng chọn lại.",
		};
	}

	if (!isSiteFontId(bodyFontId)) {
		return {
			success: false,
			error: "Font nội dung không hợp lệ. Vui lòng chọn lại.",
		};
	}

	return {
		success: true,
		data: {
			fontPresetId,
			headingFontId,
			bodyFontId,
		},
	};
}

/**
 * Revalidate appearance related pages after update
 */
function revalidateAppearancePages(): void {
	revalidateTag(CACHE_TAGS.APPEARANCE, "max");

	revalidatePath("/admin/appearance");
	revalidatePath("/admin");

	/*
	 * Root layout reads site appearance to set font CSS variables.
	 * Revalidating layout makes the selected font available across public pages.
	 */
	revalidatePath("/", "layout");

	revalidatePath("/");
	revalidatePath("/vi");
	revalidatePath("/en");

	revalidatePath("/vi/about");
	revalidatePath("/en/about");

	revalidatePath("/vi/products");
	revalidatePath("/en/products");

	revalidatePath("/vi/services");
	revalidatePath("/en/services");

	revalidatePath("/vi/projects");
	revalidatePath("/en/projects");

	revalidatePath("/vi/contact");
	revalidatePath("/en/contact");
}

/**
 * Update site appearance from admin form
 * @param formData - Submitted appearance form data
 * @returns Form result for admin UI
 */
export async function updateSiteAppearanceAction(
	formData: FormData,
): Promise<FormResult> {
	try {
		const parsedInput = parseSiteAppearanceFormData(formData);

		if (!parsedInput.success) {
			return {
				success: false,
				error: parsedInput.error,
			};
		}

		const siteAppearance = normalizeSiteAppearance(parsedInput.data);
		const result = await updateSiteAppearance(siteAppearance);

		if (!result.success) {
			return {
				success: false,
				error: result.error || "Không thể cập nhật giao diện website",
			};
		}

		revalidateAppearancePages();

		return {
			success: true,
			refresh: true,
		};
	} catch (error) {
		console.error("Error updating site appearance:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi cập nhật giao diện website. Vui lòng thử lại.",
		};
	}
}