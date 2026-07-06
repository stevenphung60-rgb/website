"use server";

import { chunk } from "lodash";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import { deleteFromS3 } from "src/lib/s3";
import type { ServiceDocument, ServiceImageDocument } from "src/server/services";

const deleteServiceSchema = z.object({
	serviceId: z.string().trim().min(1, "Không tìm thấy ID dịch vụ cần xóa"),
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
 * Delete service images from storage
 * @param images - Service gallery images
 * @returns Promise that resolves when image deletion is attempted
 */
async function deleteServiceImages(images: ServiceImageDocument[]): Promise<void> {
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
					console.error(`Error deleting service image ${key}:`, error);
				}
			}),
		);
	}
}

/**
 * Revalidate service-related pages after deletion
 * @param serviceId - Deleted service ID
 */
function revalidateServicePages(serviceId: string): void {
	revalidateTag(CACHE_TAGS.SERVICES, "max");
	revalidatePath("/admin/services");
	revalidatePath("/vi/services");
	revalidatePath("/en/services");
	revalidatePath(`/vi/services/${serviceId}`);
	revalidatePath(`/en/services/${serviceId}`);
}

/**
 * Delete a service by ID
 * @param formData - Form data containing the service ID
 * @returns Form result for the admin UI
 */
export async function deleteServiceAction(formData: FormData): Promise<FormResult> {
	try {
		const parsedInput = deleteServiceSchema.parse({
			serviceId: getFormString(formData, "serviceId"),
		});

		const db = await getDatabase();
		const servicesCollection = db.collection<ServiceDocument>("services");

		const existingService = await servicesCollection.findOne({
			id: parsedInput.serviceId,
		});

		if (!existingService) {
			return {
				success: false,
				error: "Không tìm thấy dịch vụ cần xóa",
			};
		}

		await deleteServiceImages(existingService.gallery || []);

		const result = await servicesCollection.deleteOne({
			id: parsedInput.serviceId,
		});

		if (result.deletedCount === 0) {
			return {
				success: false,
				error: "Không thể xóa dịch vụ. Vui lòng thử lại.",
			};
		}

		revalidateServicePages(parsedInput.serviceId);

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

		console.error("Error deleting service:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi xóa dịch vụ. Vui lòng thử lại.",
		};
	}
}