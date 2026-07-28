import { render, screen } from "@testing-library/react";
import { MobilePageIndicator } from "src/components/mobile-page-indicator";
import { describe, expect, it } from "vitest";

describe("MobilePageIndicator", () => {
	it("announces the current page and total number of pages", () => {
		render(
			<MobilePageIndicator currentPage={2} locale="vi" totalPages={4} />,
		);

		expect(screen.getByRole("status")).toHaveTextContent("Trang 2 / 4");
		expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
	});
});
