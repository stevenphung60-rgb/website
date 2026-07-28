import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useId } from "react";
import {
	RelatedContentMobilePageIndicator,
	RelatedContentMobilePaginationControls,
	useRelatedContentMobilePagination,
} from "src/components/related-content-mobile-pagination";
import { beforeEach, describe, expect, it, vi } from "vitest";

const itemIds = Array.from({ length: 13 }, (_, index) => `related-item-${index + 1}`);

function RelatedContentPaginationHarness({ locale = "vi" }: { locale?: "vi" | "en" }) {
	const listStartId = useId();
	const { currentPage, goToPage, isItemVisible, isMobile, isReady, totalPages } =
		useRelatedContentMobilePagination({
			contentKey: "related-items",
			itemCount: itemIds.length,
		});

	return (
		<div>
			<p data-testid="pagination-mode">{isReady ? (isMobile ? "mobile" : "desktop") : "pending"}</p>

			<div id={listStartId} data-testid="related-list-start">
				<RelatedContentMobilePageIndicator
					currentPage={currentPage}
					locale={locale}
					totalPages={totalPages}
				/>

				<div data-testid="related-grid">
					{itemIds.map((id, index) =>
						isItemVisible(index) ? (
							<article key={id} data-testid="related-card">
								{id}
							</article>
						) : null,
					)}
				</div>
			</div>

			<RelatedContentMobilePaginationControls
				currentPage={currentPage}
				locale={locale}
				onPageChange={goToPage}
				scrollTargetId={listStartId}
				totalPages={totalPages}
			/>
		</div>
	);
}

describe("related content mobile pagination", () => {
	beforeEach(() => {
		Object.defineProperty(window, "innerWidth", {
			configurable: true,
			writable: true,
			value: 375,
		});
		Object.defineProperty(window, "requestAnimationFrame", {
			configurable: true,
			value: (callback: FrameRequestCallback) => {
				callback(0);
				return 1;
			},
		});
		Object.defineProperty(window, "scrollTo", {
			configurable: true,
			value: vi.fn(),
		});
	});

	it("shows 12 of 13 related cards and announces the first mobile page", async () => {
		render(<RelatedContentPaginationHarness />);

		await waitFor(() => {
			expect(screen.getByTestId("pagination-mode")).toHaveTextContent("mobile");
		});

		expect(screen.getAllByTestId("related-card")).toHaveLength(12);
		expect(screen.queryByText("related-item-13")).not.toBeInTheDocument();
		expect(screen.getByRole("status")).toHaveTextContent("Trang 1 / 2");
		expect(screen.getByRole("button", { name: "Trang 1" })).toHaveAttribute("aria-current", "page");
		expect(screen.getByRole("button", { name: "Trang trước" })).toBeDisabled();
	});

	it("shows the final card, updates the indicator, and scrolls to the list after next", async () => {
		const user = userEvent.setup();
		render(<RelatedContentPaginationHarness />);

		const listStart = screen.getByTestId("related-list-start");
		const listStartRect = vi.spyOn(listStart as HTMLElement, "getBoundingClientRect");

		await user.click(screen.getByRole("button", { name: "Trang sau" }));

		await waitFor(() => {
			expect(screen.getAllByTestId("related-card")).toHaveLength(1);
		});

		expect(screen.getByTestId("related-card")).toHaveTextContent("related-item-13");
		expect(screen.getByRole("status")).toHaveTextContent("Trang 2 / 2");
		expect(screen.getByRole("button", { name: "Trang 2" })).toHaveAttribute("aria-current", "page");
		expect(screen.getByRole("button", { name: "Trang sau" })).toBeDisabled();
		expect(listStartRect).toHaveBeenCalled();
		expect(window.scrollTo).toHaveBeenCalledWith({
			behavior: "smooth",
			top: 0,
		});
	});

	it("keeps every item visible and disables pagination in desktop mode", async () => {
		window.innerWidth = 1024;
		render(<RelatedContentPaginationHarness locale="en" />);

		await waitFor(() => {
			expect(screen.getByTestId("pagination-mode")).toHaveTextContent("desktop");
		});

		expect(screen.getAllByTestId("related-card")).toHaveLength(13);
		expect(screen.getByRole("status")).toHaveTextContent("Page 1 / 1");
		expect(
			screen.queryByRole("navigation", { name: "Related content pagination" }),
		).not.toBeInTheDocument();
	});
});
