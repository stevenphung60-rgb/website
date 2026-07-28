import { handleContactFormSubmission } from "src/app/(main)/[lang]/contact/contact-form/contact-form.actions";
import { beforeEach, describe, expect, it, vi } from "vitest";

const databaseMocks = vi.hoisted(() => ({
	collection: vi.fn(),
	insertOne: vi.fn(),
}));

vi.mock("src/lib/database", () => ({
	getDatabase: vi.fn(async () => ({
		collection: databaseMocks.collection,
	})),
}));

function createValidFormData(overrides: Partial<Record<string, string>> = {}): FormData {
	const values = {
		name: "  Nguyễn Văn An  ",
		phone: "  0901 234 567  ",
		email: "  CUSTOMER@EXAMPLE.COM  ",
		subject: "  Tư vấn hệ thống ống gió  ",
		message: "  Tôi cần tư vấn cho nhà xưởng mới.  ",
		locale: "vi",
		website: "",
		...overrides,
	};
	const formData = new FormData();

	for (const [field, value] of Object.entries(values)) {
		formData.set(field, value);
	}

	return formData;
}

describe("contact form submission", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		databaseMocks.insertOne.mockResolvedValue({
			acknowledged: true,
			insertedId: "mongo-id",
		});
		databaseMocks.collection.mockReturnValue({
			insertOne: databaseMocks.insertOne,
		});
	});

	it("normalizes and stores a valid submission in its own collection", async () => {
		const result = await handleContactFormSubmission(createValidFormData());

		expect(result).toEqual({
			success: true,
			message: "Yêu cầu của bạn đã được gửi thành công.",
			reset: true,
		});
		expect(databaseMocks.collection).toHaveBeenCalledTimes(1);
		expect(databaseMocks.collection).toHaveBeenCalledWith("contactSubmissions");
		expect(databaseMocks.insertOne).toHaveBeenCalledTimes(1);

		const document = databaseMocks.insertOne.mock.calls[0]?.[0];

		expect(document).toEqual(
			expect.objectContaining({
				id: expect.any(String),
				name: "Nguyễn Văn An",
				phone: "0901 234 567",
				email: "customer@example.com",
				subject: "Tư vấn hệ thống ống gió",
				message: "Tôi cần tư vấn cho nhà xưởng mới.",
				locale: "vi",
				status: "new",
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			}),
		);
		expect(document.createdAt).toEqual(document.updatedAt);
	});

	it.each(["name", "phone", "email", "message"])(
		"rejects a submission when %s is missing",
		async (field) => {
			const formData = createValidFormData();
			formData.delete(field);

			const result = await handleContactFormSubmission(formData);

			expect(result.success).toBe(false);
			expect(databaseMocks.insertOne).not.toHaveBeenCalled();
		},
	);

	it("returns a localized required error for every empty customer field", async () => {
		const result = await handleContactFormSubmission(
			createValidFormData({
				name: " ",
				phone: "",
				email: " ",
				subject: "",
				message: " ",
			}),
		);

		expect(result).toEqual({
			success: false,
			error: "Dữ liệu biểu mẫu chưa hợp lệ.",
			fieldErrors: {
				name: "Quý khách vui lòng nhập trường dữ liệu trên nhé",
				phone: "Quý khách vui lòng nhập trường dữ liệu trên nhé",
				email: "Quý khách vui lòng nhập trường dữ liệu trên nhé",
				subject: "Quý khách vui lòng nhập trường dữ liệu trên nhé",
				message: "Quý khách vui lòng nhập trường dữ liệu trên nhé",
			},
		});
		expect(databaseMocks.collection).not.toHaveBeenCalled();
	});

	it("rejects invalid contact data before opening the database", async () => {
		const result = await handleContactFormSubmission(
			createValidFormData({
				email: "not-an-email",
				phone: "invalid-phone",
			}),
		);

		expect(result).toEqual({
			success: false,
			error: "Dữ liệu biểu mẫu chưa hợp lệ.",
			fieldErrors: {
				phone: "Quý khách vui lòng nhập đúng định dạng số điện thoại.",
				email: "Quý khách vui lòng nhập đúng định dạng email.",
			},
		});
		expect(databaseMocks.collection).not.toHaveBeenCalled();
		expect(databaseMocks.insertOne).not.toHaveBeenCalled();
	});

	it("does not store submissions that fill the honeypot field", async () => {
		const result = await handleContactFormSubmission(
			createValidFormData({ website: "https://spam.example" }),
		);

		expect(result).toEqual({ success: true, refresh: true });
		expect(databaseMocks.collection).not.toHaveBeenCalled();
		expect(databaseMocks.insertOne).not.toHaveBeenCalled();
	});

	it("returns a safe error when MongoDB cannot save the submission", async () => {
		const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
		databaseMocks.insertOne.mockRejectedValue(new Error("database unavailable"));

		const result = await handleContactFormSubmission(createValidFormData());

		expect(result).toEqual({
			success: false,
			error: "Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.",
		});
		expect(consoleError).toHaveBeenCalledTimes(1);

		consoleError.mockRestore();
	});
});
