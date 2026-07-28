import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectCardWrapper } from "src/app/(main)/[lang]/projects/project-card-wrapper";
import {
	ProjectFilterProvider,
	useProjectFilterActions,
} from "src/app/(main)/[lang]/projects/project-filter/project-filter.state";
import { ProjectGridController } from "src/app/(main)/[lang]/projects/project-visibility/project-grid-controller";
import { ProjectMobilePageIndicator } from "src/app/(main)/[lang]/projects/project-visibility/project-mobile-page-indicator";
import { useProjectVisibility } from "src/app/(main)/[lang]/projects/project-visibility/project-visibility.state";
import { ViewAllButton } from "src/app/(main)/[lang]/projects/project-visibility/view-all-button";
import { beforeEach, describe, expect, it, vi } from "vitest";

const projectIds = Array.from({ length: 13 }, (_, index) => `project-${index + 1}`);

function ProjectPaginationTestControls() {
	const { goToPage } = useProjectVisibility();
	const { selectCategory } = useProjectFilterActions();

	return (
		<>
			<button type="button" onClick={() => goToPage(2)}>
				Go to page two
			</button>
			<button type="button" onClick={() => selectCategory("category-a")}>
				Filter category A
			</button>
		</>
	);
}

describe("project responsive pagination", () => {
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

	it("shows 12 projects on mobile while retaining 5 projects per page on desktop", async () => {
		render(
			<ProjectFilterProvider>
				<ProjectGridController projectIds={projectIds} limitRows>
					<ProjectMobilePageIndicator locale="vi" />

					{projectIds.map((id) => (
						<ProjectCardWrapper key={id} id={id} categoryId={null}>
							<div data-testid="project-page-card">{id}</div>
						</ProjectCardWrapper>
					))}
				</ProjectGridController>
			</ProjectFilterProvider>,
		);

		await waitFor(() => {
			expect(screen.getAllByTestId("project-page-card")).toHaveLength(12);
		});
		expect(screen.getByRole("status")).toHaveTextContent("Trang 1 / 2");

		act(() => {
			window.innerWidth = 1024;
			window.dispatchEvent(new Event("resize"));
		});

		await waitFor(() => {
			expect(screen.getAllByTestId("project-page-card")).toHaveLength(5);
		});
	});

	it("returns to page one when the project category changes", async () => {
		const user = userEvent.setup();

		render(
			<ProjectFilterProvider>
				<ProjectGridController projectIds={projectIds} limitRows>
					<ProjectMobilePageIndicator locale="vi" />
					<ProjectPaginationTestControls />

					{projectIds.map((id, index) => (
						<ProjectCardWrapper
							key={id}
							id={id}
							categoryId={index < 12 ? "category-a" : "category-b"}
						>
							<div data-testid="project-page-card">{id}</div>
						</ProjectCardWrapper>
					))}
				</ProjectGridController>
			</ProjectFilterProvider>,
		);

		await waitFor(() => {
			expect(screen.getAllByTestId("project-page-card")).toHaveLength(12);
		});

		await user.click(screen.getByRole("button", { name: "Go to page two" }));
		await waitFor(() => {
			expect(screen.getByRole("status")).toHaveTextContent("Trang 2 / 2");
		});

		await user.click(screen.getByRole("button", { name: "Filter category A" }));

		await waitFor(() => {
			expect(screen.getByRole("status")).toHaveTextContent("Trang 1 / 1");
		});
		expect(screen.getAllByTestId("project-page-card")).toHaveLength(12);
	});

	it("returns to the exact project list start after changing pages", async () => {
		const user = userEvent.setup();

		render(
			<ProjectFilterProvider>
				<ProjectGridController projectIds={projectIds} limitRows>
					<div id="projects-filter">
						<div id="projects-list-start">
							<ProjectMobilePageIndicator locale="vi" />
						</div>

						{projectIds.map((id) => (
							<ProjectCardWrapper key={id} id={id} categoryId={null}>
								<div data-testid="project-page-card">{id}</div>
							</ProjectCardWrapper>
						))}

						<ViewAllButton />
					</div>
				</ProjectGridController>
			</ProjectFilterProvider>,
		);

		await waitFor(() => {
			expect(screen.getAllByTestId("project-page-card")).toHaveLength(12);
		});

		const listStart = document.getElementById("projects-list-start");
		const filter = document.getElementById("projects-filter");
		const listStartRect = vi.spyOn(listStart as HTMLElement, "getBoundingClientRect");
		const filterRect = vi.spyOn(filter as HTMLElement, "getBoundingClientRect");

		await user.click(screen.getByRole("button", { name: "Next page" }));

		expect(listStartRect).toHaveBeenCalled();
		expect(filterRect).not.toHaveBeenCalled();
	});
});
