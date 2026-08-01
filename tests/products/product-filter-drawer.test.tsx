import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductFilterProvider } from "src/app/(main)/[lang]/products/product-filter/product-filter.state";
import { ProductMobileCategorySelect } from "src/app/(main)/[lang]/products/product-filter/product-filter-select";
import { beforeEach, describe, expect, it, vi } from "vitest";

const navigationMocks = vi.hoisted(() => {
	let currentQuery = "page=2&sort=name";
	const replace = vi.fn((href: string) => {
		currentQuery = href.split("?")[1] ?? "";
	});

	return {
		getSearchParams: () => new URLSearchParams(currentQuery),
		replace,
		reset: () => {
			currentQuery = "page=2&sort=name";
			replace.mockClear();
		},
	};
});

vi.mock("next/navigation", () => ({
	usePathname: () => "/vi/products",
	useRouter: () => ({ replace: navigationMocks.replace }),
	useSearchParams: () => navigationMocks.getSearchParams(),
}));

describe("ProductMobileCategorySelect drawer", () => {
	beforeEach(() => {
		navigationMocks.reset();
	});

	it("selects a category, preserves other query parameters, and closes after each selection", async () => {
		const user = userEvent.setup();

		render(
			<ProductFilterProvider>
				<ProductMobileCategorySelect
					allLabel="Tất cả"
					categories={[
						{ id: "ventilation", label: "Thông gió" },
						{ id: "exhaust", label: "Hút khói" },
					]}
					label="Danh mục sản phẩm"
				/>
			</ProductFilterProvider>,
		);

		const trigger = screen.getByRole("button", {
			name: "Danh mục sản phẩm",
		});

		await user.click(trigger);
		expect(screen.getByRole("dialog", { name: "Danh mục sản phẩm" })).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "Thông gió" }));

		await waitFor(() => {
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});
		expect(trigger).toHaveTextContent("Thông gió");
		expect(navigationMocks.replace).toHaveBeenLastCalledWith(
			"/vi/products?page=2&sort=name&category=ventilation",
			{ scroll: false },
		);

		await user.click(trigger);
		expect(screen.getByRole("button", { name: "Thông gió" })).toHaveAttribute(
			"aria-pressed",
			"true",
		);

		await user.click(screen.getByRole("button", { name: "Tất cả" }));

		await waitFor(() => {
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});
		expect(trigger).toHaveTextContent("Tất cả");
		expect(navigationMocks.replace).toHaveBeenLastCalledWith("/vi/products?page=2&sort=name", {
			scroll: false,
		});
	});
});
