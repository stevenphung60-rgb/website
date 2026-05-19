"use server";

import { Buffer } from "buffer";
import fs from "fs/promises";
import { revalidatePath, revalidateTag } from "next/cache";
import path from "path";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { updateHeroBrandInfo } from "src/server/herobrand";
import { z } from "zod";
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
	vi: z.string(),
});

const heroBrandLogoSchema = z.object({
	url: z.string(),
});

const heroBrandInfoSchema = z.object({
	logo: heroBrandLogoSchema,
	companyName: localizedTextSchema,
});

function getLocalizedText(formData: FormData, key: string): LocalizedText {
	return {
		en: (formData.get(`${key}En`) as string) || "",
		vi: (formData.get(`${key}Vi`) as string) || "",
	};
}

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
			const errorMessages = validationResult.error.errors.map((err) => {
				const pathName = err.path.join(".");
				return `${pathName}: ${err.message}`;
			});

			return {
				success: false,
				error: `Validation failed: ${errorMessages.join(", ")}`,
			};
		}

		const validatedData: HeroBrandInfoFormData = validationResult.data;
		const result = await updateHeroBrandInfo(validatedData);

		if (result.success) {
			//revalidateTag(CACHE_TAGS.HEROBRAND);
			revalidatePath("/admin/herobrand");

			return {
				success: true,
				refresh: true,
			};
		}

		return {
			success: false,
			error: result.error || "Failed to update hero brand information",
		};
	} catch (error) {
		console.error("Error updating hero brand information:", error);

		return {
			success: false,
			error: "An unexpected error occurred while updating hero brand information",
		};
	}
}

export async function uploadHeroBrandLogoImage(
	formData: FormData,
): Promise<UploadHeroBrandImageResult> {
	try {
		const file = formData.get("image") as File | null;

		if (!file || file.size === 0) {
			return {
				success: false,
				error: "No image selected",
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
				error: "Only JPG, PNG, WEBP, or SVG images are allowed",
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
			error: "Failed to upload hero brand logo",
		};
	}
}