import { render, screen, waitFor, within } from "@testing-library/react";
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

	it("filters from the mobile drawer while preserving the other query parameters", async () => {
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

		const trigger = screen.getByRole("button", {
			name: /Danh mục dự án/i,
		});

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

		await user.click(trigger);

		const categoryDrawer = await screen.findByRole("dialog", {
			name: /Danh mục dự án/i,
		});

		await user.click(
			within(categoryDrawer).getByRole("button", {
				name: /Thương mại/i,
			}),
		);

		expect(trigger).toHaveTextContent(/Thương mại/i);
		expect(replaceMock).toHaveBeenCalledWith("/vi/projects?page=2&category=commercial", {
			scroll: false,
		});
		await waitFor(() => {
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});

		await user.click(trigger);

		const reopenedDrawer = await screen.findByRole("dialog", {
			name: /Danh mục dự án/i,
		});

		await user.click(
			within(reopenedDrawer).getByRole("button", {
				name: /Tất cả/i,
			}),
		);

		expect(trigger).toHaveTextContent(/Tất cả/i);
		expect(replaceMock).toHaveBeenLastCalledWith("/vi/projects?page=2", {
			scroll: false,
		});
		await waitFor(() => {
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});
	});
});
