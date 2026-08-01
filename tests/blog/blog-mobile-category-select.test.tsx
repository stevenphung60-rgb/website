import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BlogMobileCategorySelect } from "src/components/blog/blog-mobile-category-select";
import type { BlogCategorySummary } from "src/server/blogs";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { pushMock } = vi.hoisted(() => ({
	pushMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: pushMock }),
}));

const timestamp = new Date("2026-08-01T00:00:00.000Z");

const categories = [
	{
		category: {
			id: "industrial",
			name: { vi: "Công nghiệp", en: "Industrial" },
			slug: { vi: "cong-nghiep", en: "industrial" },
			description: { vi: "", en: "" },
			createdAt: timestamp,
			updatedAt: timestamp,
		},
		count: 7,
	},
	{
		category: {
			id: "technical-guides",
			name: { vi: "Hướng dẫn kỹ thuật", en: "Technical guides" },
			slug: { vi: "huong-dan-ky-thuat", en: "technical-guides" },
			description: { vi: "", en: "" },
			createdAt: timestamp,
			updatedAt: timestamp,
		},
		count: 4,
	},
] satisfies BlogCategorySummary[];

describe("BlogMobileCategorySelect", () => {
	beforeEach(() => {
		pushMock.mockReset();
	});

	it("opens the drawer, preserves the tag when choosing a category, resets pagination, and closes", async () => {
		const user = userEvent.setup();

		render(
			<BlogMobileCategorySelect
				allLabel="All"
				categories={categories}
				label="Choose blog category"
				locale="en"
				selectedCategoryId={null}
				selectedTag="case studies"
			/>,
		);

		await user.click(
			screen.getByRole("button", {
				name: "Choose blog category",
			}),
		);

		const drawer = await screen.findByRole("dialog", {
			name: "Choose blog category",
		});

		await user.click(
			within(drawer).getByRole("button", {
				name: "Technical guides (4)",
			}),
		);

		expect(pushMock).toHaveBeenCalledWith("/en/blog?category=technical-guides&tag=case+studies");
		expect(pushMock.mock.calls[0]?.[0]).not.toContain("page=");

		await waitFor(() => {
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});
	});

	it("removes the category when All is chosen while retaining the active tag", async () => {
		const user = userEvent.setup();

		render(
			<BlogMobileCategorySelect
				allLabel="All"
				categories={categories}
				label="Choose blog category"
				locale="en"
				selectedCategoryId="industrial"
				selectedTag="case studies"
			/>,
		);

		await user.click(
			screen.getByRole("button", {
				name: "Choose blog category",
			}),
		);

		const drawer = await screen.findByRole("dialog", {
			name: "Choose blog category",
		});

		await user.click(within(drawer).getByRole("button", { name: "All" }));

		expect(pushMock).toHaveBeenCalledWith("/en/blog?tag=case+studies");

		await waitFor(() => {
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});
	});
});
