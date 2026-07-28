import { updateContactSubmissionStatusAction } from "src/app/admin/contact-submissions/contact-submission.actions";
import { beforeEach, describe, expect, it, vi } from "vitest";

const actionMocks = vi.hoisted(() => ({
	requireAdminAuth: vi.fn(),
	revalidatePath: vi.fn(),
	updateContactSubmissionStatus: vi.fn(),
}));

vi.mock("src/lib/admin-auth", () => ({
	requireAdminAuth: actionMocks.requireAdminAuth,
}));

vi.mock("src/server/contact", () => ({
	updateContactSubmissionStatus: actionMocks.updateContactSubmissionStatus,
}));

vi.mock("next/cache", () => ({
	revalidatePath: actionMocks.revalidatePath,
}));

const submissionId = "6bb9fa87-f6a4-42c8-b966-6faeb10e0e9f";

function createFormData(id: string = submissionId, status: string = "contacted"): FormData {
	const formData = new FormData();
	formData.set("id", id);
	formData.set("status", status);
	return formData;
}

describe("updateContactSubmissionStatusAction", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		actionMocks.requireAdminAuth.mockResolvedValue({
			user: { email: "admin@example.com" },
		});
		actionMocks.updateContactSubmissionStatus.mockResolvedValue({
			id: submissionId,
			status: "contacted",
		});
	});

	it("authorizes the admin before updating and revalidates the inbox", async () => {
		const result = await updateContactSubmissionStatusAction(createFormData());

		expect(result).toEqual({ success: true, refresh: true });
		expect(actionMocks.requireAdminAuth).toHaveBeenCalledTimes(1);
		expect(actionMocks.updateContactSubmissionStatus).toHaveBeenCalledWith({
			id: submissionId,
			status: "contacted",
		});
		expect(actionMocks.requireAdminAuth.mock.invocationCallOrder[0]).toBeLessThan(
			actionMocks.updateContactSubmissionStatus.mock.invocationCallOrder[0] ?? 0,
		);
		expect(actionMocks.revalidatePath).toHaveBeenNthCalledWith(1, "/admin/contact-submissions");
		expect(actionMocks.revalidatePath).toHaveBeenNthCalledWith(2, "/admin");
	});

	it("stops immediately when admin authorization rejects", async () => {
		actionMocks.requireAdminAuth.mockRejectedValueOnce(new Error("NEXT_REDIRECT: /login"));

		await expect(updateContactSubmissionStatusAction(createFormData())).rejects.toThrow(
			"NEXT_REDIRECT",
		);

		expect(actionMocks.updateContactSubmissionStatus).not.toHaveBeenCalled();
		expect(actionMocks.revalidatePath).not.toHaveBeenCalled();
	});

	it("rejects an invalid UUID after checking admin authorization", async () => {
		const result = await updateContactSubmissionStatusAction(createFormData("not-a-uuid"));

		expect(result).toEqual({
			success: false,
			error: "Thông tin cập nhật trạng thái không hợp lệ.",
		});
		expect(actionMocks.requireAdminAuth).toHaveBeenCalledTimes(1);
		expect(actionMocks.updateContactSubmissionStatus).not.toHaveBeenCalled();
		expect(actionMocks.revalidatePath).not.toHaveBeenCalled();
	});

	it("rejects a status outside the supported workflow", async () => {
		const result = await updateContactSubmissionStatusAction(
			createFormData(submissionId, "deleted"),
		);

		expect(result.success).toBe(false);
		expect(actionMocks.updateContactSubmissionStatus).not.toHaveBeenCalled();
	});
});
