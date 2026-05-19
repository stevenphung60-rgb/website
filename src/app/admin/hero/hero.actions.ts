"use server";

import { Buffer } from "buffer";
import fs from "fs/promises";
import { revalidatePath, revalidateTag } from "next/cache";
import path from "path";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { updateHeroInfo } from "src/server/hero";
import { z } from "zod";
import type {
	HeroImage,
	HeroInfoFormData,
	HeroSingleImage,
} from "./hero.type";

/* =========================
   Upload Result Type riêng
========================= */
type UploadHeroImageResult =
	| {
			success: true;
			data: string;
	  }
	| {
			success: false;
			error: string;
	  };

/* =========================
   Helpers
========================= */
const emptySingleImage: HeroSingleImage = {
	url: "",
};

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

/* =========================
   Validation Schema
========================= */
const localizedTextSchema = z.object({
	en: z.string(),
	vi: z.string(),
});

const requiredLocalizedTextSchema = z.object({
	en: z.string().min(1, "English text is required"),
	vi: z.string().min(1, "Vietnamese text is required"),
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

/* =========================
   Update Hero Info
========================= */
export async function updateHeroInformation(
	formData: FormData,
): Promise<FormResult> {
	try {
		const rawData: HeroInfoFormData = {
			title: {
				en: (formData.get("titleEn") as string) || "",
				vi: (formData.get("titleVi") as string) || "",
			},
			description: {
				en: (formData.get("descriptionEn") as string) || "",
				vi: (formData.get("descriptionVi") as string) || "",
			},
			gallery: parseGallery(formData.get("gallery")),

			productitle: {
				en: (formData.get("productitleEn") as string) || "",
				vi: (formData.get("productitleVi") as string) || "",
			},
			productdescription: {
				en: (formData.get("productdescriptionEn") as string) || "",
				vi: (formData.get("productdescriptionVi") as string) || "",
			},

			servicetitle: {
				en: (formData.get("servicetitleEn") as string) || "",
				vi: (formData.get("servicetitleVi") as string) || "",
			},
			servicedesription: {
				en: (formData.get("servicedesriptionEn") as string) || "",
				vi: (formData.get("servicedesriptionVi") as string) || "",
			},

			machinetitle: {
				en: (formData.get("machinetitleEn") as string) || "",
				vi: (formData.get("machinetitleVi") as string) || "",
			},
			machinedescription: {
				en: (formData.get("machinedescriptionEn") as string) || "",
				vi: (formData.get("machinedescriptionVi") as string) || "",
			},
			machinebackgroundimage: parseSingleImage(
				formData.get("machinebackgroundimage"),
			),

			machine1title: {
				en: (formData.get("machine1titleEn") as string) || "",
				vi: (formData.get("machine1titleVi") as string) || "",
			},
			machine1subtitle: {
				en: (formData.get("machine1subtitleEn") as string) || "",
				vi: (formData.get("machine1subtitleVi") as string) || "",
			},
			machine1description: {
				en: (formData.get("machine1descriptionEn") as string) || "",
				vi: (formData.get("machine1descriptionVi") as string) || "",
			},
			machine1image: parseSingleImage(formData.get("machine1image")),

			machine2title: {
				en: (formData.get("machine2titleEn") as string) || "",
				vi: (formData.get("machine2titleVi") as string) || "",
			},
			machine2subtitle: {
				en: (formData.get("machine2subtitleEn") as string) || "",
				vi: (formData.get("machine2subtitleVi") as string) || "",
			},
			machine2description: {
				en: (formData.get("machine2descriptionEn") as string) || "",
				vi: (formData.get("machine2descriptionVi") as string) || "",
			},
			machine2image: parseSingleImage(formData.get("machine2image")),

			machine3title: {
				en: (formData.get("machine3titleEn") as string) || "",
				vi: (formData.get("machine3titleVi") as string) || "",
			},
			machine3subtitle: {
				en: (formData.get("machine3subtitleEn") as string) || "",
				vi: (formData.get("machine3subtitleVi") as string) || "",
			},
			machine3description: {
				en: (formData.get("machine3descriptionEn") as string) || "",
				vi: (formData.get("machine3descriptionVi") as string) || "",
			},
			machine3image: parseSingleImage(formData.get("machine3image")),

			clienttitle: {
				en: (formData.get("clienttitleEn") as string) || "",
				vi: (formData.get("clienttitleVi") as string) || "",
			},
			clientdescription: {
				en: (formData.get("clientdescriptionEn") as string) || "",
				vi: (formData.get("clientdescriptionVi") as string) || "",
			},
			clientimagegallery: parseGallery(formData.get("clientimagegallery")),

			projecttitle: {
				en: (formData.get("projecttitleEn") as string) || "",
				vi: (formData.get("projecttitleVi") as string) || "",
			},
		};

		const validationResult = heroInfoSchema.safeParse(rawData);

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

		const validatedData: HeroInfoFormData = validationResult.data;
		const result = await updateHeroInfo(validatedData);

		if (result.success) {
			// revalidateTag(CACHE_TAGS.HERO);
			revalidatePath("/admin/hero");

			return {
				success: true,
				refresh: true,
			};
		}

		return {
			success: false,
			error: result.error || "Failed to update hero information",
		};
	} catch (error) {
		console.error("Error updating hero information:", error);

		return {
			success: false,
			error: "An unexpected error occurred while updating hero information",
		};
	}
}

/* =========================
   Upload Image
========================= */
export async function uploadHeroGalleryImage(
	formData: FormData,
): Promise<UploadHeroImageResult> {
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

		const uploadDir = path.join(process.cwd(), "public", "uploads", "hero");
		await fs.mkdir(uploadDir, { recursive: true });

		const ext = file.name.split(".").pop() || "jpg";
		const fileName = `hero-${Date.now()}.${ext}`;
		const filePath = path.join(uploadDir, fileName);

		await fs.writeFile(filePath, buffer);

		return {
			success: true,
			data: `/uploads/hero/${fileName}`,
		};
	} catch (error) {
		console.error("Upload hero image error:", error);

		return {
			success: false,
			error: "Failed to upload hero image",
		};
	}
}