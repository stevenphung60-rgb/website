import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ServicesSectionDatabase from "src/app/(main)/[lang]/services/services-section-database";
import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceIds = Array.from({ length: 13 }, (_, index) => `service-${index + 1}`);

vi.mock("next/cache", () => ({
	cacheTag: vi.fn(),
}));

vi.mock("src/server/services", () => ({
	getActiveServiceIds: vi.fn(async () => serviceIds),
	getServiceById: vi.fn(async (id: string) => ({
		id,
		name: { en: id, vi: id },
	})),
}));

vi.mock("src/app/(main)/[lang]/services/service-dialog", () => ({
	default: ({ serviceId }: { serviceId: string }) => (
		<div data-testid="service-card-content">{serviceId}</div>
	),
}));

describe("service mobile card animation delay", () => {
	beforeEach(() => {
		Object.defineProperty(window, "innerWidth", {
			configurable: true,
			writable: true,
			value: 375,
		});
		Object.defineProperty(window, "scrollTo", {
			configurable: true,
			value: vi.fn(),
		});
		Object.defineProperty(window, "requestAnimationFrame", {
			configurable: true,
			value: (callback: FrameRequestCallback) => {
				callback(0);
				return 1;
			},
		});
	});

	it("restarts the stagger delay on the second mobile page", async () => {
		const user = userEvent.setup();
		const view = await ServicesSectionDatabase({ locale: "vi", viewAll: true });

		render(view);

		await waitFor(() => {
			expect(screen.getAllByTestId("service-card-content")).toHaveLength(12);
		});

		await user.click(screen.getByRole("button", { name: "Trang sau" }));

		const card = await screen.findByTestId("service-card-content");
		const wrapper = card.closest("[data-service-id]");

		expect(wrapper).toHaveStyle({
			"--service-mobile-animation-delay": "0ms",
			"--service-desktop-animation-delay": "1680ms",
		});
	});
});
