"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { FormResult } from "src/components/form-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { ServiceDocument } from "src/server/services";
import { ServiceStatus } from "src/server/services";

interface UpdateServiceInput {
	serviceId: string;
	serviceNameVi: string;
	serviceNameEn: string;
	serviceDescriptionVi: string;
	serviceDescriptionEn: string;
	serviceStatus: ServiceStatus;
}

const updateServiceSchema = z.object({
	serviceId: z.string().trim().min(1, "Không tìm thấy ID dịch vụ"),
	serviceNameVi: z.string().trim().min(1, "Tên dịch vụ tiếng Việt là bắt buộc"),
	serviceNameEn: z.string().trim().optional().default(""),
	serviceDescriptionVi: z.string().trim().min(1, "Mô tả tiếng Việt là bắt buộc"),
	serviceDescriptionEn: z.string().trim().optional().default(""),
	serviceStatus: z.nativeEnum(ServiceStatus, {
		errorMap: () => ({ message: "Trạng thái dịch vụ không hợp lệ" }),
	}),
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
 * Parse and validate service update form data
 * @param formData - Submitted form data
 * @returns Validated service update input
 */
function parseServiceInput(formData: FormData): UpdateServiceInput {
	return updateServiceSchema.parse({
		serviceId: getFormString(formData, "serviceId"),
		serviceNameVi: getFormString(formData, "serviceNameVi"),
		serviceNameEn: getFormString(formData, "serviceNameEn"),
		serviceDescriptionVi: getFormString(formData, "serviceDescriptionVi"),
		serviceDescriptionEn: getFormString(formData, "serviceDescriptionEn"),
		serviceStatus: getFormString(formData, "serviceStatus"),
	});
}

/**
 * Revalidate service-related pages after mutation
 * @param serviceId - Updated service ID
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
 * Update an existing service from admin form data
 * @param formData - Submitted service form data
 * @returns Form result for the admin UI
 */
export async function updateService(formData: FormData): Promise<FormResult> {
	try {
		const serviceInput = parseServiceInput(formData);
		const db = await getDatabase();
		const servicesCollection = db.collection<ServiceDocument>("services");

		const existingService = await servicesCollection.findOne({
			id: serviceInput.serviceId,
		});

		if (!existingService) {
			return {
				success: false,
				error: "Không tìm thấy dịch vụ cần cập nhật",
			};
		}

		const result = await servicesCollection.updateOne(
			{ id: serviceInput.serviceId },
			{
				$set: {
					name: {
						vi: serviceInput.serviceNameVi,
						en: serviceInput.serviceNameEn || serviceInput.serviceNameVi,
					},
					description: {
						vi: serviceInput.serviceDescriptionVi,
						en:
							serviceInput.serviceDescriptionEn ||
							serviceInput.serviceDescriptionVi,
					},
					status: serviceInput.serviceStatus,
					updatedAt: new Date(),
				},
			},
		);

		if (result.matchedCount === 0) {
			return {
				success: false,
				error: "Không tìm thấy dịch vụ cần cập nhật",
			};
		}

		revalidateServicePages(serviceInput.serviceId);

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

		console.error("Error updating service:", error);

		return {
			success: false,
			error: "Có lỗi xảy ra khi cập nhật dịch vụ. Vui lòng thử lại.",
		};
	}
}