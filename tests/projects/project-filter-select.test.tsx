import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectFilterProvider } from "src/app/(main)/[lang]/projects/project-filter/project-filter.state";
import { ProjectMobileCategorySelect } from "src/app/(main)/[lang]/projects/project-filter/project-filter-select";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const { replaceMock } = vi.hoisted(() => ({
	replaceMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	usePathname: () => "/vi/projects",
	useRouter: () => ({ replace: replaceMock }),
	useSearchParams: () => new URLSearchParams("page=2"),
}));

describe("ProjectMobileCategorySelect", () => {
	beforeAll(() => {
		Object.defineProperties(Element.prototype, {
			hasPointerCapture: {
				configurable: true,
				value: vi.fn(() => false),
			},
			releasePointerCapture: {
				configurable: true,
				value: vi.fn(),
			},
			setPointerCapture: {
				configurable: true,
				value: vi.fn(),
			},
		});

		Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
			configurable: true,
			value: vi.fn(),
		});
	});

	beforeEach(() => {
		replaceMock.mockReset();
	});

	it("updates the selected category and keeps the other query parameters", async () => {
		const user = userEvent.setup();

		render(
			<ProjectFilterProvider>
				<ProjectMobileCategorySelect
					allLabel="Tất cả"
					categories={[
						{ id: "commercial", label: "Thương mại" },
						{ id: "industrial", label: "Công nghiệp" },
					]}
					label="Danh mục dự án"
				/>
			</ProjectFilterProvider>,
		);

		const select = screen.getByRole("combobox", {
			name: "Danh mục dự án",
		});

		await user.click(select);
		await user.click(
			await screen.findByRole("option", {
				name: "Thương mại",
			}),
		);

		expect(select).toHaveTextContent("Thương mại");
		expect(replaceMock).toHaveBeenCalledWith("/vi/projects?page=2&category=commercial", {
			scroll: false,
		});

		await user.click(select);
		await user.click(
			await screen.findByRole("option", {
				name: "Tất cả",
			}),
		);

		expect(select).toHaveTextContent("Tất cả");
		expect(replaceMock).toHaveBeenLastCalledWith("/vi/projects?page=2", {
			scroll: false,
		});
	});
});
