import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
	ServiceMobilePageIndicator,
	ServiceMobilePaginationControls,
	ServiceMobilePaginationController,
	ServiceMobilePaginationItem,
} from "src/app/(main)/[lang]/services/service-mobile-pagination";
import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceIds = Array.from({ length: 13 }, (_, index) => `service-${index + 1}`);

describe("service responsive pagination", () => {
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

	it("shows 12 services on mobile and all services from the desktop layout", async () => {
		render(
			<ServiceMobilePaginationController serviceIds={serviceIds}>
				<ServiceMobilePageIndicator locale="vi" />

				{serviceIds.map((id) => (
					<ServiceMobilePaginationItem key={id} id={id}>
						<div data-testid="service-page-card">{id}</div>
					</ServiceMobilePaginationItem>
				))}
			</ServiceMobilePaginationController>,
		);

		await waitFor(() => {
			expect(screen.getAllByTestId("service-page-card")).toHaveLength(12);
		});
		expect(screen.getByRole("status")).toHaveTextContent("Trang 1 / 2");

		act(() => {
			window.innerWidth = 768;
			window.dispatchEvent(new Event("resize"));
		});

		await waitFor(() => {
			expect(screen.getAllByTestId("service-page-card")).toHaveLength(13);
		});
	});

	it("shows the remaining service and returns to the list start on page two", async () => {
		const user = userEvent.setup();

		render(
			<ServiceMobilePaginationController serviceIds={serviceIds}>
				<div id="services-list-start">
					<ServiceMobilePageIndicator locale="vi" />

					{serviceIds.map((id) => (
						<ServiceMobilePaginationItem key={id} id={id}>
							<div data-testid="service-page-card">{id}</div>
						</ServiceMobilePaginationItem>
					))}

					<ServiceMobilePaginationControls locale="vi" />
				</div>
			</ServiceMobilePaginationController>,
		);

		await waitFor(() => {
			expect(screen.getAllByTestId("service-page-card")).toHaveLength(12);
		});

		await user.click(screen.getByRole("button", { name: "Trang sau" }));

		await waitFor(() => {
			expect(screen.getAllByTestId("service-page-card")).toHaveLength(1);
		});
		expect(screen.getByTestId("service-page-card")).toHaveTextContent("service-13");
		expect(screen.getByRole("status")).toHaveTextContent("Trang 2 / 2");
		expect(window.scrollTo).toHaveBeenCalled();
	});
});
