"use server";

import { chunk } from "lodash";
import { nanoid } from "nanoid";
import { revalidatePath, revalidateTag } from "next/cache";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import { uploadToS3 } from "src/lib/s3";
import type { ProjectDocument, ProjectImageDocument } from "src/server/projects";
import { ProjectCompletionStatus, ProjectVisibilityStatus } from "src/server/projects";

function generateProjectS3Key(projectId: string, fileName: string, index: number = 0): string {
	const fileExtension = fileName.split(".").pop() || "jpg";
	const uniqueKey = `${index}-${nanoid(8)}`;

	return `projects/${projectId}/${uniqueKey}.${fileExtension}`;
}

export async function createProject(formData: FormData): Promise<FormResult> {
	try {
		const projectNameEn = formData.get("projectNameEn") as string;
		const projectNameVi = formData.get("projectNameVi") as string;
		const projectCategoryId = formData.get("projectCategoryId") as string;
		const projectLocationEn = formData.get("projectLocationsEn") as string;
		const projectLocationVi = formData.get("projectLocationVi") as string;
		const projectYearEn = formData.get("projectYearEn") as string;
		const projectYearVi = formData.get("projectYearVi") as string;
		const projectDescriptionEn = formData.get("projectDescriptionEn") as string;
		const projectDescriptionVi = formData.get("projectDescriptionVi") as string;
		const projectSpecsJson = formData.get("projectSpecs") as string;
		const visibilityStatus = formData.get("visibilityStatus") as string;
		const completionStatus = formData.get("completionStatus") as string;
		const projectImages = formData.getAll("projectImages") as File[];
		const selectedImageIndex = formData.get("selectedImageIndex") as string;

		if (projectImages.length === 0) {
			return {
				success: false,
				error: "At least one project image is required",
			};
		}

		if (!selectedImageIndex) {
			return {
				success: false,
				error: "Select a main image",
			};
		}

		let projectSpecs: { en: string; vi: string }[] = [];

		if (projectSpecsJson) {
			try {
				projectSpecs = JSON.parse(projectSpecsJson);
			} catch {
				return {
					success: false,
					error: "Invalid specifications format",
				};
			}
		}

		const trimmedNameEn = projectNameEn?.trim() || "";
		const trimmedNameVi = projectNameVi?.trim() || "";
		const trimmedCategoryId = projectCategoryId?.trim() || "";
		const trimmedLocationEn = projectLocationEn?.trim() || "";
		const trimmedLocationVi = projectLocationVi?.trim() || "";
		const trimmedYearEn = projectYearEn?.trim() || "";
		const trimmedYearVi = projectYearVi?.trim() || "";
		const trimmedDescriptionEn = projectDescriptionEn?.trim() || "";
		const trimmedDescriptionVi = projectDescriptionVi?.trim() || "";

		const missingFields: string[] = [];

		if (!trimmedNameEn) missingFields.push("Project Name (English)");
		if (!trimmedNameVi) missingFields.push("Project Name (Vietnamese)");
		if (!trimmedCategoryId) missingFields.push("Project Category");
		if (!trimmedLocationEn) missingFields.push("Project Location (English)");
		if (!trimmedLocationVi) missingFields.push("Project Location (Vietnamese)");
		if (!trimmedYearEn) missingFields.push("Project Year (English)");
		if (!trimmedYearVi) missingFields.push("Project Year (Vietnamese)");
		if (!trimmedDescriptionEn) missingFields.push("Project Description (English)");
		if (!trimmedDescriptionVi) missingFields.push("Project Description (Vietnamese)");
		if (!visibilityStatus) missingFields.push("Visibility Status");
		if (!completionStatus) missingFields.push("Completion Status");

		if (missingFields.length > 0) {
			return {
				success: false,
				error: `Please fill in the following required fields: ${missingFields.join(", ")}`,
			};
		}

		for (let i = 0; i < projectSpecs.length; i++) {
			const spec = projectSpecs[i];
			const hasEn = spec.en && spec.en.trim().length > 0;
			const hasVi = spec.vi && spec.vi.trim().length > 0;

			if (hasEn && !hasVi) {
				return {
					success: false,
					error: `Specification ${i + 1} is missing Vietnamese translation`,
				};
			}

			if (hasVi && !hasEn) {
				return {
					success: false,
					error: `Specification ${i + 1} is missing English translation`,
				};
			}
		}

		if (
			!Object.values(ProjectVisibilityStatus).includes(
				visibilityStatus as ProjectVisibilityStatus,
			)
		) {
			return {
				success: false,
				error: "Invalid visibility status",
			};
		}

		if (
			!Object.values(ProjectCompletionStatus).includes(
				completionStatus as ProjectCompletionStatus,
			)
		) {
			return {
				success: false,
				error: "Invalid completion status",
			};
		}

		const projectId = nanoid();

		const batchSize = 10;
		const imageBatches = chunk(projectImages, batchSize);
		const uploadedImages: ProjectImageDocument[] = [];

		try {
			for (const [batchIndex, batchImages] of imageBatches.entries()) {
				const uploadPromises = batchImages.map(async (image, imageIndex) => {
					const globalImageIndex = batchIndex * batchSize + imageIndex;
					const s3Key = generateProjectS3Key(projectId, image.name, globalImageIndex);

					await uploadToS3(image, s3Key);

					return {
						key: s3Key,
						isMain: globalImageIndex === parseInt(selectedImageIndex, 10),
						uploadedAt: new Date(),
					} as ProjectImageDocument;
				});

				const batchResults = await Promise.all(uploadPromises);
				uploadedImages.push(...batchResults);
			}
		} catch (error) {
			console.error("Failed to upload images:", error);

			return {
				success: false,
				error: `Failed to upload images: ${
					error instanceof Error ? error.message : "Unknown error"
				}`,
			};
		}

		const validSpecs = projectSpecs.filter(
			(spec) =>
				(spec.en && spec.en.trim().length > 0) ||
				(spec.vi && spec.vi.trim().length > 0),
		);

		const projectDoc: ProjectDocument = {
			id: projectId,
			name: {
				en: trimmedNameEn,
				vi: trimmedNameVi,
			},
			categoryId: trimmedCategoryId,
			location: {
				en: trimmedLocationEn,
				vi: trimmedLocationVi,
			},
			year: {
				en: trimmedYearEn,
				vi: trimmedYearVi,
			},
			description: {
				en: trimmedDescriptionEn,
				vi: trimmedDescriptionVi,
			},
			specs: validSpecs,
			visibilityStatus: visibilityStatus as ProjectVisibilityStatus,
			completionStatus: completionStatus as ProjectCompletionStatus,
			gallery: uploadedImages,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const db = await getDatabase();
		await db.collection<ProjectDocument>("projects").insertOne(projectDoc);

		revalidateTag(CACHE_TAGS.PROJECTS, "max");
		revalidatePath("/admin/projects");

		return {
			success: true,
			refresh: true,
		};
	} catch (error) {
		console.error("Error creating project:", error);

		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to create project",
		};
	}
}