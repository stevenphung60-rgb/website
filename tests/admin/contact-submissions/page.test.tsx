import { render, screen } from "@testing-library/react";
import ContactSubmissionsPage from "src/app/admin/contact-submissions/page";
import type { ContactSubmissionDocument } from "src/server/contact";
import { beforeEach, describe, expect, it, vi } from "vitest";

const pageMocks = vi.hoisted(() => ({
	connection: vi.fn(),
	getContactSubmissionListPage: vi.fn(),
	getContactSubmissionMetrics: vi.fn(),
	updateContactSubmissionStatus: vi.fn(),
}));

vi.mock("next/server", () => ({
	connection: pageMocks.connection,
}));

vi.mock("src/server/contact", () => ({
	getContactSubmissionListPage: pageMocks.getContactSubmissionListPage,
	getContactSubmissionMetrics: pageMocks.getContactSubmissionMetrics,
	updateContactSubmissionStatus: pageMocks.updateContactSubmissionStatus,
}));

vi.mock("src/app/admin/contact-submissions/contact-submission.actions", () => ({
	updateContactSubmissionStatusAction: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
		refresh: vi.fn(),
	}),
}));

const submission: ContactSubmissionDocument = {
	id: "6bb9fa87-f6a4-42c8-b966-6faeb10e0e9f",
	name: "Nguyễn Văn An",
	phone: "0901234567",
	email: "customer@example.com",
	subject: "Tư vấn hệ thống ống gió",
	message: "Tôi cần tư vấn cho nhà xưởng.",
	locale: "vi",
	status: "contacted",
	createdAt: new Date("2026-07-28T03:30:00.000Z"),
	updatedAt: new Date("2026-07-28T03:30:00.000Z"),
};

describe("ContactSubmissionsPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		pageMocks.connection.mockResolvedValue(undefined);
		pageMocks.getContactSubmissionMetrics.mockResolvedValue({
			total: 27,
			new: 8,
			contacted: 12,
			resolved: 7,
		});
		pageMocks.getContactSubmissionListPage.mockResolvedValue({
			items: [submission],
			total: 12,
			page: 2,
			pageSize: 20,
			totalPages: 2,
		});
	});

	it("uses page-only pagination and does not render a filter toolbar", async () => {
		render(
			await ContactSubmissionsPage({
				searchParams: Promise.resolve({
					page: "2",
					search: " Nguyễn ",
					status: "contacted",
				}),
			}),
		);

		expect(pageMocks.connection).toHaveBeenCalledTimes(1);
		expect(pageMocks.getContactSubmissionListPage).toHaveBeenCalledWith({
			page: 2,
			pageSize: 20,
		});
		expect(screen.getByRole("heading", { name: "Khách hàng liên hệ" })).toBeInTheDocument();
		expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
		expect(screen.getByText("Danh sách khách hàng liên hệ")).toBeInTheDocument();
	});

	it("ignores an invalid page query value", async () => {
		await ContactSubmissionsPage({
			searchParams: Promise.resolve({
				page: "-4",
			}),
		});

		expect(pageMocks.getContactSubmissionListPage).toHaveBeenCalledWith({
			page: 1,
			pageSize: 20,
		});
	});
});
