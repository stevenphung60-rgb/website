import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCardWrapper } from "src/app/(main)/[lang]/products/product-card-wrapper";
import { ProductFilterProvider } from "src/app/(main)/[lang]/products/product-filter/product-filter.state";
import { ProductGridController } from "src/app/(main)/[lang]/products/product-visibility/product-grid-controller";
import { ProductMobilePageIndicator } from "src/app/(main)/[lang]/products/product-visibility/product-mobile-page-indicator";
import { ViewAllButton } from "src/app/(main)/[lang]/products/product-visibility/view-all-button";
import { beforeEach, describe, expect, it, vi } from "vitest";

const productIds = Array.from({ length: 13 }, (_, index) => `product-${index + 1}`);

describe("product mobile pagination", () => {
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

	it("shows 12 products and the current page out of the total on mobile", async () => {
		render(
			<ProductFilterProvider>
				<ProductGridController productIds={productIds} limitRows>
					<ProductMobilePageIndicator locale="vi" />

					{productIds.map((id) => (
						<ProductCardWrapper key={id} id={id} categoryId={null}>
							<div data-testid="product-page-card">{id}</div>
						</ProductCardWrapper>
					))}
				</ProductGridController>
			</ProductFilterProvider>,
		);

		await waitFor(() => {
			expect(screen.getAllByTestId("product-page-card")).toHaveLength(12);
		});

		expect(screen.getByRole("status")).toHaveTextContent("Trang 1 / 2");
	});

	it("shows the remaining product and updates the indicator after moving to page two", async () => {
		const user = userEvent.setup();

		render(
			<ProductFilterProvider>
				<ProductGridController productIds={productIds} limitRows>
					<div id="products-filter">
						<div id="products-list-start">
							<ProductMobilePageIndicator locale="vi" />
						</div>

						{productIds.map((id) => (
							<ProductCardWrapper key={id} id={id} categoryId={null}>
								<div data-testid="product-page-card">{id}</div>
							</ProductCardWrapper>
						))}

						<ViewAllButton />
					</div>
				</ProductGridController>
			</ProductFilterProvider>,
		);

		await waitFor(() => {
			expect(screen.getAllByTestId("product-page-card")).toHaveLength(12);
		});

		const listStart = document.getElementById("products-list-start");
		const filter = document.getElementById("products-filter");
		const listStartRect = vi.spyOn(listStart as HTMLElement, "getBoundingClientRect");
		const filterRect = vi.spyOn(filter as HTMLElement, "getBoundingClientRect");

		await user.click(screen.getByRole("button", { name: "Next page" }));

		await waitFor(() => {
			expect(screen.getAllByTestId("product-page-card")).toHaveLength(1);
		});

		expect(screen.getByTestId("product-page-card")).toHaveTextContent("product-13");
		expect(screen.getByRole("status")).toHaveTextContent("Trang 2 / 2");
		expect(listStartRect).toHaveBeenCalled();
		expect(filterRect).not.toHaveBeenCalled();
	});
});
