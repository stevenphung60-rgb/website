"use server";

import { chunk } from "lodash";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import { deleteFromS3 } from "src/lib/s3";
import type { ProjectDocument, ProjectImageDocument } from "src/server/projects";

const deleteProjectSchema = z.object({
	projectId: z.string().trim().min(1, "Không tìm thấy ID dự án cần xóa"),
});

/**
 * Get a string value from form data
 * @param formData - Submitted form data
 * @param key - Field key
 * @returns String value from form data
 */
function getFormString(formData: FormData, key: string): string {
	return (formData.get(key) as string | null) || "";
}

/**
 * Delete project images from storage
 * @param images - Project gallery images
 * @returns Promise that resolves when image deletion is attempted
 */
async function deleteProjectImages(images: ProjectImageDocument[]): Promise<void> {
	const imageKeys = images.map((image) => image.key).filter(Boolean);

	if (imageKeys.length === 0) {
		return;
	}

	const imageKeyChunks = chunk(imageKeys, 5);

	for (const imageKeyChunk of imageKeyChunks) {
		await Promise.all(
			imageKeyChunk.map(async (key) => {
				try {
					await deleteFromS3(key);
				} catch (error) {
					console.error(`Error deleting project image ${key}:`, error);
				}
			}),
		);
	}
}

/**
 * Revalidate project-related pages after deletion
 * @param projectId - Deleted project ID
 */
function revalidateProjectPages(projectId: string): void {
	revalidateTag(CACHE_TAGS.PROJECTS, "max");
	revalidatePath("/admin/projects");
	revalidatePath("/vi/projects");
	revalidatePath("/en/projects");
	revalidatePath(`/vi/projects/${projectId}`);
	revalidatePath(`/en/projects/${projectId}`);
}

/**
 * Delete a project by ID
 * @param formData - Form data containing the project ID
 * @returns Form result for the admin UI
 */
export async function deleteProjectAction(formData: FormData): Promise<FormResult> {
	try {
		const parsedInput = deleteProjectSchema.parse({
			projectId: getFormString(formData, "projectId"),
		});

		const db = await getDatabase();
		const projectsCollection = db.collection<ProjectDocument>("projects");

		const existingProject = await projectsCollection.findOne({
			id: parsedInput.projectId,
		});

		if (!existingProject) {
			return {
				success: false,
				error: "Không tìm thấy dự án cần xóa",
			};
		}

		await deleteProjectImages(existingProject.gallery || []);

		const result = await projectsCollection.deleteOne({
			id: parsedInput.projectId,
		});

		if (result.deletedCount === 0) {
			return {
				success: false,
				error: "Không thể xóa dự án. Vui lòng thử lại.",
			};
		}

		revalidateProjectPages(parsedInput.projectId);

		return {
			success: true,
			refresh: true,
		};
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.errors.map((item) => item.message).join(", "),
			};
		}

		console.error("Error deleting project:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi xóa dự án. Vui lòng thử lại.",
		};
	}
}