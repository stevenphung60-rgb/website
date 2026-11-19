"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { isSiteFontId } from "src/lib/font-presets";
import { updateSiteAppearance } from "src/server/site-appearance";

/**
 * Revalidate appearance related pages after update
 */
function revalidateAppearancePages(): void {
	revalidateTag(CACHE_TAGS.APPEARANCE, "max");

	revalidatePath("/admin/appearance");
	revalidatePath("/admin");

	/*
	 * Root layout reads site appearance to set the --site-font CSS variable.
	 * Revalidating the layout applies the selected font across all pages.
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
 * Update the website font from admin form
 * @param formData - Submitted appearance form data
 * @returns Form result for admin UI
 */
export async function updateSiteAppearanceAction(formData: FormData): Promise<FormResult> {
	try {
		const fontId = ((formData.get("fontId") as string | null) || "").trim();

		if (!isSiteFontId(fontId)) {
			return {
				success: false,
				error: "Font không hợp lệ. Vui lòng chọn lại.",
			};
		}

		const result = await updateSiteAppearance({ fontId });

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
