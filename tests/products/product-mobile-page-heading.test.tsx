import { render, screen } from "@testing-library/react";
import { ProductMobilePageHeading } from "src/app/(main)/[lang]/products/product-filter/product-mobile-page-heading";
import { describe, expect, it } from "vitest";

describe("ProductMobilePageHeading", () => {
	it("presents the product page identity with the brand heading and gold decoration", () => {
		render(<ProductMobilePageHeading title="SẢN PHẨM" />);

		const heading = screen.getByRole("heading", {
			level: 1,
			name: "SẢN PHẨM",
		});

		expect(heading).toHaveClass("text-[#342312]");
		expect(screen.getAllByTestId("product-heading-line")).toHaveLength(2);
	});
});
