"use server";

import { Buffer } from "buffer";
import fs from "fs/promises";
import { revalidatePath, revalidateTag } from "next/cache";
import path from "path";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { updateHeroAboutInfo } from "src/server/heroabout";
import { z } from "zod";
import type { HeroAboutInfoFormData } from "./heroabout.type";

/* =========================
   Upload Result Type riêng
========================= */
type UploadHeroAboutImageResult =
	| {
			success: true;
			data: string;
	  }
	| {
			success: false;
			error: string;
	  };

/* =========================
   Validation Schema
========================= */
const requiredLocalizedTextSchema = z.object({
	en: z.string().min(1, "English content is required"),
	vi: z.string().min(1, "Vietnamese content is required"),
});

const optionalLocalizedTextSchema = z.object({
	en: z.string(),
	vi: z.string(),
});

const heroAboutInfoSchema = z.object({
	title: requiredLocalizedTextSchema,
	description: requiredLocalizedTextSchema,
	gallery: z
		.array(
			z.object({
				url: z.string().min(1),
				order: z.number(),
			}),
		)
		.default([]),

	factoryaddress: optionalLocalizedTextSchema,
	officeaddress: optionalLocalizedTextSchema,
	youtubelink: optionalLocalizedTextSchema,
	videotitle: optionalLocalizedTextSchema,
	videodescription: optionalLocalizedTextSchema,

	historytitle: optionalLocalizedTextSchema,
	historydescription: optionalLocalizedTextSchema,
	historytime1: optionalLocalizedTextSchema,
	historytitle1: optionalLocalizedTextSchema,
	historydetail1: optionalLocalizedTextSchema,
	historytime2: optionalLocalizedTextSchema,
	historytitle2: optionalLocalizedTextSchema,
	historydetail2: optionalLocalizedTextSchema,
	historytime3: optionalLocalizedTextSchema,
	historytitle3: optionalLocalizedTextSchema,
	historydetail3: optionalLocalizedTextSchema,

	valuestatementtitle: optionalLocalizedTextSchema,
	valuestatementtitle1: optionalLocalizedTextSchema,
	valuestatementdetail1: optionalLocalizedTextSchema,
	valuestatementtitle2: optionalLocalizedTextSchema,
	valuestatementdetail2: optionalLocalizedTextSchema,
	valuestatementtitle3: optionalLocalizedTextSchema,
	valuestatementdetail3: optionalLocalizedTextSchema,

	capacitytitle: optionalLocalizedTextSchema,
	capacitydescription: optionalLocalizedTextSchema,
	capacitytitle1: optionalLocalizedTextSchema,
	capacitydetail1: optionalLocalizedTextSchema,
	capacitytitle2: optionalLocalizedTextSchema,
	capacitydetail2: optionalLocalizedTextSchema,
	capacitytitle3: optionalLocalizedTextSchema,
	capacitydetail3: optionalLocalizedTextSchema,
	capacitytitle4: optionalLocalizedTextSchema,
	capacitydetail4: optionalLocalizedTextSchema,
});

/* =========================
   Update HeroAbout Info
========================= */
export async function updateHeroAboutInformation(
	formData: FormData,
): Promise<FormResult> {
	try {
		let gallery: HeroAboutInfoFormData["gallery"] = [];

		try {
			gallery = JSON.parse((formData.get("gallery") as string) || "[]");
		} catch {
			gallery = [];
		}

		const getLocalizedText = (key: string) => ({
			en: (formData.get(`${key}En`) as string) || "",
			vi: (formData.get(`${key}Vi`) as string) || "",
		});

		const rawData: HeroAboutInfoFormData = {
			title: getLocalizedText("title"),
			description: getLocalizedText("description"),
			gallery,

			factoryaddress: getLocalizedText("factoryaddress"),
			officeaddress: getLocalizedText("officeaddress"),
			youtubelink: getLocalizedText("youtubelink"),
			videotitle: getLocalizedText("videotitle"),
			videodescription: getLocalizedText("videodescription"),

			historytitle: getLocalizedText("historytitle"),
			historydescription: getLocalizedText("historydescription"),
			historytime1: getLocalizedText("historytime1"),
			historytitle1: getLocalizedText("historytitle1"),
			historydetail1: getLocalizedText("historydetail1"),
			historytime2: getLocalizedText("historytime2"),
			historytitle2: getLocalizedText("historytitle2"),
			historydetail2: getLocalizedText("historydetail2"),
			historytime3: getLocalizedText("historytime3"),
			historytitle3: getLocalizedText("historytitle3"),
			historydetail3: getLocalizedText("historydetail3"),

			valuestatementtitle: getLocalizedText("valuestatementtitle"),
			valuestatementtitle1: getLocalizedText("valuestatementtitle1"),
			valuestatementdetail1: getLocalizedText("valuestatementdetail1"),
			valuestatementtitle2: getLocalizedText("valuestatementtitle2"),
			valuestatementdetail2: getLocalizedText("valuestatementdetail2"),
			valuestatementtitle3: getLocalizedText("valuestatementtitle3"),
			valuestatementdetail3: getLocalizedText("valuestatementdetail3"),

			capacitytitle: getLocalizedText("capacitytitle"),
			capacitydescription: getLocalizedText("capacitydescription"),
			capacitytitle1: getLocalizedText("capacitytitle1"),
			capacitydetail1: getLocalizedText("capacitydetail1"),
			capacitytitle2: getLocalizedText("capacitytitle2"),
			capacitydetail2: getLocalizedText("capacitydetail2"),
			capacitytitle3: getLocalizedText("capacitytitle3"),
			capacitydetail3: getLocalizedText("capacitydetail3"),
			capacitytitle4: getLocalizedText("capacitytitle4"),
			capacitydetail4: getLocalizedText("capacitydetail4"),
		};

		const validationResult = heroAboutInfoSchema.safeParse(rawData);

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

		const validatedData: HeroAboutInfoFormData = validationResult.data;
		const result = await updateHeroAboutInfo(validatedData);

		if (result.success) {
			//revalidateTag(CACHE_TAGS.HEROABOUT);
			revalidatePath("/admin/heroabout");

			return {
				success: true,
				refresh: true,
			};
		}

		return {
			success: false,
			error: result.error || "Failed to update hero about information",
		};
	} catch (error) {
		console.error("Error updating hero about information:", error);

		return {
			success: false,
			error: "An unexpected error occurred while updating hero about information",
		};
	}
}

/* =========================
   Upload Image
========================= */
export async function uploadHeroAboutGalleryImage(
	formData: FormData,
): Promise<UploadHeroAboutImageResult> {
	try {
		const file = formData.get("image") as File | null;

		if (!file || file.size === 0) {
			return {
				success: false,
				error: "No image selected",
			};
		}

		const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

		if (!allowedTypes.includes(file.type)) {
			return {
				success: false,
				error: "Only JPG, PNG, or WEBP images are allowed",
			};
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const uploadDir = path.join(
			process.cwd(),
			"public",
			"uploads",
			"heroabout",
		);

		await fs.mkdir(uploadDir, { recursive: true });

		const ext = file.name.split(".").pop() || "jpg";
		const fileName = `heroabout-${Date.now()}.${ext}`;
		const filePath = path.join(uploadDir, fileName);

		await fs.writeFile(filePath, buffer);

		return {
			success: true,
			data: `/uploads/heroabout/${fileName}`,
		};
	} catch (error) {
		console.error("Upload hero about image error:", error);

		return {
			success: false,
			error: "Failed to upload hero about image",
		};
	}
}