import { render, screen } from "@testing-library/react";
import { AdminNavigationMenu } from "src/components/admin/admin-navigation-menu";
import { beforeEach, describe, expect, it, vi } from "vitest";

const navigationMocks = vi.hoisted(() => ({
	pathname: "/admin",
}));

vi.mock("next/navigation", () => ({
	usePathname: () => navigationMocks.pathname,
}));

describe("AdminNavigationMenu contact submissions link", () => {
	beforeEach(() => {
		navigationMocks.pathname = "/admin";
	});

	it("places the contact submissions module immediately after Dashboard", () => {
		render(<AdminNavigationMenu isCollapsed={false} onRequestExpand={vi.fn()} />);

		const links = screen.getAllByRole("link");
		const dashboardIndex = links.findIndex((link) => link.getAttribute("href") === "/admin");
		const contactSubmissionsIndex = links.findIndex(
			(link) => link.getAttribute("href") === "/admin/contact-submissions",
		);

		expect(screen.getByRole("link", { name: "DASHBOARD" })).toHaveAttribute("aria-current", "page");
		expect(contactSubmissionsIndex).toBe(dashboardIndex + 1);
		expect(links[contactSubmissionsIndex]).toHaveTextContent("KHÁCH HÀNG LIÊN HỆ");
	});

	it("marks only the contact submissions module active on its route", () => {
		navigationMocks.pathname = "/admin/contact-submissions";

		render(<AdminNavigationMenu isCollapsed={false} onRequestExpand={vi.fn()} />);

		expect(screen.getByRole("link", { name: "KHÁCH HÀNG LIÊN HỆ" })).toHaveAttribute(
			"aria-current",
			"page",
		);
		expect(screen.getByRole("link", { name: "DASHBOARD" })).not.toHaveAttribute("aria-current");
	});
});
