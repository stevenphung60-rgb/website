import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ContactForm } from "src/app/(main)/[lang]/contact/contact-form/contact-form.ui";
import { beforeEach, describe, expect, it, vi } from "vitest";

const formMocks = vi.hoisted(() => ({
	action: vi.fn(),
	push: vi.fn(),
	refresh: vi.fn(),
}));

vi.mock("src/app/(main)/[lang]/contact/contact-form/contact-form.actions", () => ({
	handleContactFormSubmission: formMocks.action,
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: formMocks.push,
		refresh: formMocks.refresh,
	}),
}));

function setField(container: HTMLElement, name: string, value: string): void {
	const field = container.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`);

	if (!field) {
		throw new Error(`Missing form field: ${name}`);
	}

	fireEvent.change(field, { target: { value } });
}

describe("ContactForm", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		formMocks.action.mockResolvedValue({ success: true, refresh: true });
	});

	it("submits every customer field exactly once", async () => {
		const { container, getByRole } = render(<ContactForm locale="vi" />);

		setField(container, "name", "Nguyễn Văn An");
		setField(container, "phone", "0901234567");
		setField(container, "email", "customer@example.com");
		setField(container, "subject", "Tư vấn");
		setField(container, "message", "Tôi cần tư vấn hệ thống ống gió.");

		fireEvent.click(getByRole("button"));

		await waitFor(() => {
			expect(formMocks.action).toHaveBeenCalledTimes(1);
		});

		const formData = formMocks.action.mock.calls[0]?.[0] as FormData;

		expect(formData.get("name")).toBe("Nguyễn Văn An");
		expect(formData.get("phone")).toBe("0901234567");
		expect(formData.get("email")).toBe("customer@example.com");
		expect(formData.get("subject")).toBe("Tư vấn");
		expect(formData.get("message")).toBe("Tôi cần tư vấn hệ thống ống gió.");
		expect(formData.get("locale")).toBe("vi");
		expect(formData.get("website")).toBe("");
	});

	it("shows a success message and clears every customer field after submission", async () => {
		formMocks.action.mockResolvedValue({
			success: true,
			message: "Gửi thành công",
			reset: true,
		});
		const { container, getByRole } = render(<ContactForm locale="vi" />);

		setField(container, "name", "Nguyễn Văn An");
		setField(container, "phone", "0901234567");
		setField(container, "email", "customer@example.com");
		setField(container, "subject", "Tư vấn");
		setField(container, "message", "Tôi cần tư vấn hệ thống ống gió.");

		fireEvent.click(getByRole("button"));

		expect(await screen.findByRole("status")).toHaveTextContent("Gửi thành công");

		for (const fieldName of ["name", "phone", "email", "subject", "message"]) {
			expect(
				container.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${fieldName}"]`),
			).toHaveValue("");
		}
	});

	it("shows a required warning below every empty customer field", async () => {
		const requiredMessage = "Quý khách vui lòng nhập trường dữ liệu trên nhé";
		formMocks.action.mockResolvedValue({
			success: false,
			error: "Dữ liệu biểu mẫu chưa hợp lệ.",
			fieldErrors: {
				name: requiredMessage,
				phone: requiredMessage,
				email: requiredMessage,
				subject: requiredMessage,
				message: requiredMessage,
			},
		});
		const { container, getByRole } = render(<ContactForm locale="vi" />);

		fireEvent.click(getByRole("button"));

		const warnings = await screen.findAllByText(requiredMessage);
		expect(warnings).toHaveLength(5);

		for (const warning of warnings) {
			expect(warning).toHaveClass("text-xs");
		}

		expect(screen.queryByText("Dữ liệu biểu mẫu chưa hợp lệ.")).not.toBeInTheDocument();

		for (const fieldName of ["name", "phone", "email", "subject", "message"]) {
			const field = container.querySelector<HTMLInputElement | HTMLTextAreaElement>(
				`[name="${fieldName}"]`,
			);

			expect(field).toHaveAttribute("aria-invalid", "true");
			expect(field).toHaveAttribute("aria-describedby", `${fieldName}-error`);
			expect(container.querySelector(`#${fieldName}-error`)).toHaveTextContent(requiredMessage);
		}
	});

	it("keeps a real submission failure visible when there are no field errors", async () => {
		const submissionError = "Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.";
		formMocks.action.mockResolvedValue({
			success: false,
			error: submissionError,
		});
		const { getByRole } = render(<ContactForm locale="vi" />);

		fireEvent.click(getByRole("button"));

		expect(await screen.findByText(submissionError)).toBeInTheDocument();
	});
});
