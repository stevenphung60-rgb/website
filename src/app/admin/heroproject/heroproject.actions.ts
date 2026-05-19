"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { Buffer } from "buffer";
import fs from "fs/promises";
import path from "path";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { updateHeroProjectInfo } from "src/server/heroproject";
import { z } from "zod";
import type { HeroProjectInfoFormData } from "./heroproject.type";

/* =========================
   Upload Result Type riêng
========================= */
type UploadHeroProjectImageResult =
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
const heroProjectInfoSchema = z.object({
	title: z.object({
		en: z.string().min(1, "English title is required"),
		vi: z.string().min(1, "Vietnamese title is required"),
	}),
	description: z.object({
		en: z.string().min(1, "English description is required"),
		vi: z.string().min(1, "Vietnamese description is required"),
	}),
	gallery: z
		.array(
			z.object({
				url: z.string().min(1),
				order: z.number(),
			}),
		)
		.default([]),
});

/* =========================
   Update HeroProject Info
========================= */
export async function updateHeroProjectInformation(formData: FormData): Promise<FormResult> {
	try {
		let gallery: HeroProjectInfoFormData["gallery"] = [];

		try {
			gallery = JSON.parse((formData.get("gallery") as string) || "[]");
		} catch {
			gallery = [];
		}

		const rawData: HeroProjectInfoFormData = {
			title: {
				en: (formData.get("titleEn") as string) || "",
				vi: (formData.get("titleVi") as string) || "",
			},
			description: {
				en: (formData.get("descriptionEn") as string) || "",
				vi: (formData.get("descriptionVi") as string) || "",
			},
			gallery,
		};

		const validationResult = heroProjectInfoSchema.safeParse(rawData);

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

		const validatedData: HeroProjectInfoFormData = validationResult.data;
		const result = await updateHeroProjectInfo(validatedData);

		if (result.success) {
			// revalidateTag(CACHE_TAGS.HEROPROJECT);
			revalidatePath("/admin/heroproject");

			return {
				success: true,
				refresh: true,
			};
		}

		return {
			success: false,
			error: result.error || "Failed to update hero project information",
		};
	} catch (error) {
		console.error("Error updating hero project information:", error);

		return {
			success: false,
			error: "An unexpected error occurred while updating hero project information",
		};
	}
}

/* =========================
   Upload Image
========================= */
export async function uploadHeroProjectGalleryImage(
	formData: FormData,
): Promise<UploadHeroProjectImageResult> {
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
			error: "Failed to upload hero project image",
		};
	}
}