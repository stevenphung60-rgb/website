import { fireEvent, render, screen, within } from "@testing-library/react";
import { ContactSubmissionRow } from "src/app/admin/contact-submissions/contact-submission-row";
import { FormBoundaryProvider } from "src/components/form-state";
import type { ContactSubmissionDocument } from "src/server/contact";
import { beforeEach, describe, expect, it, vi } from "vitest";

const rowMocks = vi.hoisted(() => ({
	action: vi.fn(),
	refresh: vi.fn(),
}));

vi.mock("src/app/admin/contact-submissions/contact-submission.actions", () => ({
	updateContactSubmissionStatusAction: rowMocks.action,
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
		refresh: rowMocks.refresh,
	}),
}));

const submission: ContactSubmissionDocument = {
	id: "6bb9fa87-f6a4-42c8-b966-6faeb10e0e9f",
	name: "Nguyễn Văn An",
	phone: "0901 234 567",
	email: "customer@example.com",
	subject: "Tư vấn hệ thống ống gió",
	message: "Tôi cần tư vấn hệ thống ống gió cho nhà xưởng mới.\nVui lòng liên hệ lại.",
	locale: "vi",
	status: "new",
	createdAt: new Date("2026-07-28T03:30:00.000Z"),
	updatedAt: new Date("2026-07-28T03:30:00.000Z"),
};

describe("ContactSubmissionRow", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		rowMocks.action.mockResolvedValue({ success: true, refresh: true });
	});

	it("keeps the mobile row constrained and shows all details in a scroll-safe dialog", async () => {
		const { container } = render(
			<FormBoundaryProvider>
				<ContactSubmissionRow submission={submission} />
			</FormBoundaryProvider>,
		);

		const row = container.firstElementChild?.firstElementChild;
		expect(row).toHaveClass("min-w-0");
		expect(row?.firstElementChild).toHaveClass("grid-cols-1", "min-w-0");
		expect(screen.getAllByText("10:30 28/07/2026")).toHaveLength(2);

		fireEvent.click(screen.getByRole("button", { name: "Xem chi tiết" }));

		const dialog = await screen.findByRole("dialog");
		expect(dialog).toHaveClass(
			"max-h-[calc(100dvh-2rem)]",
			"w-[calc(100vw-2rem)]",
			"overflow-y-auto",
		);

		const dialogQueries = within(dialog);
		expect(
			dialogQueries.getByText(
				"Tôi cần tư vấn hệ thống ống gió cho nhà xưởng mới. Vui lòng liên hệ lại.",
			),
		).toBeInTheDocument();
		expect(dialogQueries.getByRole("link", { name: submission.phone })).toHaveAttribute(
			"href",
			"tel:0901234567",
		);
		expect(dialogQueries.getByRole("link", { name: submission.email })).toHaveAttribute(
			"href",
			"mailto:customer@example.com",
		);
		expect(dialogQueries.getByText("10:30 28/07/2026")).toBeInTheDocument();
		expect(dialogQueries.getByRole("option", { name: "Mới" })).toBeInTheDocument();
		expect(dialogQueries.getByRole("option", { name: "Đã liên hệ" })).toBeInTheDocument();
		expect(dialogQueries.getByRole("option", { name: "Đã xử lý" })).toBeInTheDocument();
	});
});
