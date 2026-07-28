import { render, screen, within } from "@testing-library/react";
import AdminPage from "src/app/admin/page";
import { beforeEach, describe, expect, it, vi } from "vitest";

const dashboardMocks = vi.hoisted(() => ({
	getContactSubmissionMetrics: vi.fn(),
	getProductCategoryCount: vi.fn(),
	getProductCounts: vi.fn(),
	getProductIds: vi.fn(),
	getProjectCategoryCount: vi.fn(),
	getProjectCounts: vi.fn(),
	getProjectIds: vi.fn(),
	getServiceCounts: vi.fn(),
	getServiceIds: vi.fn(),
}));

vi.mock("src/server/contact", () => ({
	getContactSubmissionMetrics: dashboardMocks.getContactSubmissionMetrics,
}));

vi.mock("src/server/productcategories", () => ({
	getProductCategoryCount: dashboardMocks.getProductCategoryCount,
}));

vi.mock("src/server/products", () => ({
	getProductCounts: dashboardMocks.getProductCounts,
	getProductIds: dashboardMocks.getProductIds,
	ProductStatus: {
		Active: "active",
		Draft: "draft",
	},
}));

vi.mock("src/server/projectcategories", () => ({
	getProjectCategoryCount: dashboardMocks.getProjectCategoryCount,
}));

vi.mock("src/server/projects", () => ({
	getProjectCounts: dashboardMocks.getProjectCounts,
	getProjectIds: dashboardMocks.getProjectIds,
	ProjectVisibilityStatus: {
		Active: "active",
		Draft: "draft",
	},
}));

vi.mock("src/server/services", () => ({
	getServiceCounts: dashboardMocks.getServiceCounts,
	getServiceIds: dashboardMocks.getServiceIds,
	ServiceStatus: {
		Active: "active",
		Draft: "draft",
	},
}));

describe("Admin dashboard contact submissions module", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		dashboardMocks.getContactSubmissionMetrics.mockResolvedValue({
			total: 12,
			new: 4,
			contacted: 5,
			resolved: 3,
		});
		dashboardMocks.getProductCategoryCount.mockResolvedValue(2);
		dashboardMocks.getProductCounts.mockResolvedValue({
			active: 2,
			draft: 1,
		});
		dashboardMocks.getProductIds.mockResolvedValue(["product-1", "product-2", "product-3"]);
		dashboardMocks.getProjectCategoryCount.mockResolvedValue(1);
		dashboardMocks.getProjectCounts.mockResolvedValue({
			visibility: {
				active: 1,
				draft: 1,
			},
		});
		dashboardMocks.getProjectIds.mockResolvedValue(["project-1", "project-2"]);
		dashboardMocks.getServiceCounts.mockResolvedValue({
			active: 1,
			draft: 0,
		});
		dashboardMocks.getServiceIds.mockResolvedValue(["service-1"]);
	});

	it("shows customer care first with a clear attention state and a shortcut to the module", async () => {
		render(await AdminPage());

		expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeInTheDocument();
		expect(dashboardMocks.getContactSubmissionMetrics).toHaveBeenCalledTimes(1);

		const customerCareSummary = screen.getByTestId("customer-care-summary");
		const contentMetrics = screen.getByTestId("dashboard-content-metrics");

		expect(contentMetrics.previousElementSibling).toBe(customerCareSummary);
		expect(customerCareSummary).toHaveAttribute("data-tone", "attention");
		expect(customerCareSummary).toHaveClass("border-sky-300");
		expect(customerCareSummary).toHaveClass("from-[#F0FAFF]");
		expect(
			within(customerCareSummary).getByRole("heading", {
				name: "Khách hàng liên hệ",
			}),
		).toBeInTheDocument();
		expect(within(customerCareSummary).queryByText("Cần chăm sóc")).not.toBeInTheDocument();
		expect(customerCareSummary).not.toHaveTextContent("khách hàng mới cần chăm sóc");
		expect(customerCareSummary).toHaveTextContent("12");
		expect(customerCareSummary).toHaveTextContent("Tổng liên hệ");

		const newContactLabel = within(customerCareSummary).getByText("Liên hệ mới");

		expect(newContactLabel.previousElementSibling).toHaveTextContent("4");

		const summaryLink = within(customerCareSummary).getByRole("link", {
			name: "Xem khách hàng liên hệ",
		});

		expect(summaryLink).toHaveAttribute("href", "/admin/contact-submissions");

		const mainTaskLink = screen
			.getAllByRole("link", { name: /Khách hàng liên hệ/i })
			.find((link) => link.textContent?.includes("12 khách hàng"));

		expect(mainTaskLink).toHaveAttribute("href", "/admin/contact-submissions");
		expect(mainTaskLink).toHaveTextContent("4 liên hệ mới");
	});

	it("shows zero in the new contact metric when there is no new contact", async () => {
		dashboardMocks.getContactSubmissionMetrics.mockResolvedValue({
			total: 8,
			new: 0,
			contacted: 5,
			resolved: 3,
		});

		render(await AdminPage());

		const customerCareSummary = screen.getByTestId("customer-care-summary");
		const newContactLabel = within(customerCareSummary).getByText("Liên hệ mới");

		expect(customerCareSummary).toHaveAttribute("data-tone", "clear");
		expect(newContactLabel.previousElementSibling).toHaveTextContent("0");
		expect(within(customerCareSummary).queryByText("Đã xử lý hết")).not.toBeInTheDocument();
	});
});
