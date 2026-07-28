"use server";

import { revalidatePath } from "next/cache";
import type { FormResult } from "src/components/form-state";
import { requireAdminAuth } from "src/lib/admin-auth";
import { updateContactSubmissionStatus } from "src/server/contact";
import { z } from "zod";

const updateContactSubmissionStatusSchema = z.object({
	id: z.string().trim().uuid("Mã khách hàng liên hệ không hợp lệ."),
	status: z.enum(["new", "contacted", "resolved"]),
});

/**
 * Update a contact submission workflow status from the admin inbox.
 */
export async function updateContactSubmissionStatusAction(formData: FormData): Promise<FormResult> {
	await requireAdminAuth();

	const parsedInput = updateContactSubmissionStatusSchema.safeParse({
		id: formData.get("id"),
		status: formData.get("status"),
	});

	if (!parsedInput.success) {
		return {
			success: false,
			error: "Thông tin cập nhật trạng thái không hợp lệ.",
		};
	}

	try {
		const updatedSubmission = await updateContactSubmissionStatus(parsedInput.data);

		if (!updatedSubmission) {
			return {
				success: false,
				error: "Không tìm thấy thông tin liên hệ của khách hàng này.",
			};
		}

		revalidatePath("/admin/contact-submissions");
		revalidatePath("/admin");

		return {
			success: true,
			refresh: true,
		};
	} catch (error) {
		console.error("Failed to update contact submission status:", error);

		return {
			success: false,
			error: "Không thể cập nhật trạng thái lúc này. Vui lòng thử lại.",
		};
	}
}
