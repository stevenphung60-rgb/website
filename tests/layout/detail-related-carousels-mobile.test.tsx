import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { RelatedProductsCarousel } from "src/app/(main)/[lang]/products/[id]/related-products-carousel";
import RelatedProjectsCarousel from "src/app/(main)/[lang]/projects/[id]/related-projects-carousel";
import RelatedServicesCarousel from "src/app/(main)/[lang]/services/[id]/related-services-carousel";
import { BlogRelatedCarousel } from "src/components/blog/blog-related-carousel";
import {
	type Project,
	ProjectCompletionStatus,
	ProjectVisibilityStatus,
} from "src/server/projects";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("src/components/behaviors/LocaleLink", () => ({
	default: ({
		children,
		className,
		href,
	}: {
		children: ReactNode;
		className?: string;
		href: string;
	}) => (
		<a className={className} href={href}>
			{children}
		</a>
	),
}));

vi.mock("next/image", () => ({
	default: ({
		alt,
		fill,
		src,
		...props
	}: {
		alt: string;
		fill?: boolean;
		src: string;
		[key: string]: unknown;
	}) => {
		void fill;

		// biome-ignore lint/performance/noImgElement: A plain image keeps this layout test independent from Next Image.
		return <img alt={alt} src={src} {...props} />;
	},
}));

vi.mock("next/link", () => ({
	default: ({
		children,
		href,
		scroll,
		...props
	}: {
		children: ReactNode;
		href: string;
		scroll?: boolean;
		[key: string]: unknown;
	}) => {
		void scroll;

		return (
			<a href={href} {...props}>
				{children}
			</a>
		);
	},
}));

const relatedItemCount = 13;
const productIds = Array.from({ length: relatedItemCount }, (_, index) => `product-${index + 1}`);
const serviceIds = Array.from({ length: relatedItemCount }, (_, index) => `service-${index + 1}`);

const projects: Project[] = Array.from({ length: relatedItemCount }, (_, index) => {
	const timestamp = new Date("2026-07-28T08:00:00.000Z");

	return {
		id: `project-${index + 1}`,
		name: { vi: `Du an ${index + 1}`, en: `Project ${index + 1}` },
		categoryId: "category-1",
		location: { vi: "TP.HCM", en: "HCMC" },
		year: { vi: "2026", en: "2026" },
		description: { vi: "Mo ta du an", en: "Project description" },
		specs: [],
		visibilityStatus: ProjectVisibilityStatus.Active,
		completionStatus: ProjectCompletionStatus.Completed,
		gallery: [],
		createdAt: timestamp,
		updatedAt: timestamp,
	};
});

const blogItems = Array.from({ length: relatedItemCount }, (_, index) => ({
	id: `blog-${index + 1}`,
	href: `/en/blog/blog-${index + 1}`,
	image: "",
	category: "Knowledge",
	title: `Article ${index + 1}`,
	excerpt: "Article summary",
	date: "28/07/2026",
	readingTime: "5 min read",
	readLabel: "Read",
}));

function getCarouselTrack(container: HTMLElement) {
	const track = container.querySelector(".snap-mandatory");

	expect(track).not.toBeNull();
	expect(track).toHaveClass("flex", "overflow-x-auto");

	return track as HTMLElement;
}

describe("detail related-content responsive pagination", () => {
	beforeEach(() => {
		Object.defineProperty(window, "innerWidth", {
			configurable: true,
			writable: true,
			value: 390,
		});
		Object.defineProperty(window, "requestAnimationFrame", {
			configurable: true,
			value: (callback: FrameRequestCallback) => {
				callback(0);
				return 1;
			},
		});
		Object.defineProperty(HTMLElement.prototype, "scrollBy", {
			configurable: true,
			value: vi.fn(),
		});
		Object.defineProperty(window, "scrollTo", {
			configurable: true,
			value: vi.fn(),
		});
	});

	it("paginates related products into a 12-card, two-column mobile grid", async () => {
		const user = userEvent.setup();
		const { container } = render(
			<RelatedProductsCarousel contentKey="products" itemCount={productIds.length} locale="en">
				{productIds.map((id) => (
					<div key={id} data-testid="related-product-card">
						{id}
					</div>
				))}
			</RelatedProductsCarousel>,
		);

		await waitFor(() => {
			expect(screen.getAllByTestId("related-product-card")).toHaveLength(12);
		});
		expect(container.querySelector("#related-products-list-start > .grid")).toHaveClass(
			"grid-cols-2",
		);
		expect(screen.getByRole("status")).toHaveTextContent("Page 1 / 2");

		await user.click(screen.getByRole("button", { name: "Next page" }));

		await waitFor(() => {
			expect(screen.getAllByTestId("related-product-card")).toHaveLength(1);
		});
		expect(screen.getByRole("status")).toHaveTextContent("Page 2 / 2");
	});

	it("paginates related services into a 12-card, two-column mobile grid", async () => {
		const user = userEvent.setup();
		const { container } = render(
			<RelatedServicesCarousel contentKey="services" itemCount={serviceIds.length} locale="en">
				{serviceIds.map((id) => (
					<article key={id} data-testid="related-service-card">
						{id}
					</article>
				))}
			</RelatedServicesCarousel>,
		);

		await waitFor(() => {
			expect(screen.getAllByTestId("related-service-card")).toHaveLength(12);
		});
		expect(container.querySelector("#related-services-list-start > .grid")).toHaveClass(
			"grid-cols-2",
		);
		expect(screen.getByRole("status")).toHaveTextContent("Page 1 / 2");

		await user.click(screen.getByRole("button", { name: "Next page" }));

		await waitFor(() => {
			expect(screen.getAllByTestId("related-service-card")).toHaveLength(1);
		});
		expect(screen.getByRole("status")).toHaveTextContent("Page 2 / 2");
	});

	it("paginates related projects into a 12-card, one-column mobile grid", async () => {
		const user = userEvent.setup();
		const { container } = render(
			<RelatedProjectsCarousel
				categoryName="Projects"
				locale="en"
				projects={projects}
				title="Related projects"
			/>,
		);

		await waitFor(() => {
			expect(container.querySelectorAll('a[href^="/projects/project-"]')).toHaveLength(12);
		});
		expect(container.querySelector("#related-projects-list > .grid")).toHaveClass("grid-cols-1");
		expect(container.querySelector('a[href="/projects/project-1"] article')).toHaveClass(
			"bg-[#F7F1E6]",
		);
		expect(screen.getByRole("status")).toHaveTextContent("Page 1 / 2");

		await user.click(screen.getByRole("button", { name: "Next page" }));

		await waitFor(() => {
			expect(container.querySelectorAll('a[href^="/projects/project-"]')).toHaveLength(1);
		});
		expect(screen.getByRole("status")).toHaveTextContent("Page 2 / 2");
	});

	it("paginates related blog posts into a 12-card, two-column mobile grid", async () => {
		const user = userEvent.setup();
		const { container } = render(
			<BlogRelatedCarousel
				countLabel="13 articles"
				eyebrow="Blog"
				items={blogItems}
				locale="en"
				title="Related articles"
			/>,
		);

		await waitFor(() => {
			expect(container.querySelectorAll('a[href^="/en/blog/blog-"]')).toHaveLength(12);
		});
		expect(container.querySelector("#related-blog-list > .grid")).toHaveClass("grid-cols-2");
		expect(screen.getByRole("status")).toHaveTextContent("Page 1 / 2");

		await user.click(screen.getByRole("button", { name: "Next page" }));

		await waitFor(() => {
			expect(container.querySelectorAll('a[href^="/en/blog/blog-"]')).toHaveLength(1);
		});
		expect(screen.getByRole("status")).toHaveTextContent("Page 2 / 2");
	});

	it("preserves every related card in the existing desktop carousels", async () => {
		window.innerWidth = 1024;

		const productsRender = render(
			<RelatedProductsCarousel
				contentKey="desktop-products"
				itemCount={productIds.length}
				locale="en"
			>
				{productIds.map((id) => (
					<div key={id}>{id}</div>
				))}
			</RelatedProductsCarousel>,
		);
		await waitFor(() => {
			expect(getCarouselTrack(productsRender.container).children).toHaveLength(13);
		});
		expect(getCarouselTrack(productsRender.container).firstElementChild).toHaveClass(
			"lg:basis-[calc((100%_-_72px)/4)]",
		);
		productsRender.unmount();

		const servicesRender = render(
			<RelatedServicesCarousel
				contentKey="desktop-services"
				itemCount={serviceIds.length}
				locale="en"
			>
				{serviceIds.map((id) => (
					<article key={id}>{id}</article>
				))}
			</RelatedServicesCarousel>,
		);
		await waitFor(() => {
			expect(getCarouselTrack(servicesRender.container).children).toHaveLength(13);
		});
		expect(getCarouselTrack(servicesRender.container).firstElementChild).toHaveClass(
			"lg:basis-[calc((100%_-_2.5rem)_/_3)]",
		);
		servicesRender.unmount();

		const projectsRender = render(
			<RelatedProjectsCarousel
				categoryName="Projects"
				locale="en"
				projects={projects}
				title="Related projects"
			/>,
		);
		await waitFor(() => {
			expect(getCarouselTrack(projectsRender.container).children).toHaveLength(13);
		});
		expect(getCarouselTrack(projectsRender.container).firstElementChild).toHaveClass(
			"lg:basis-[calc((100%_-_2.5rem)_/_3)]",
		);
		projectsRender.unmount();

		const blogsRender = render(
			<BlogRelatedCarousel
				countLabel="13 articles"
				eyebrow="Blog"
				items={blogItems}
				locale="en"
				title="Related articles"
			/>,
		);
		await waitFor(() => {
			expect(getCarouselTrack(blogsRender.container).children).toHaveLength(13);
		});
		expect(getCarouselTrack(blogsRender.container).firstElementChild).toHaveClass(
			"lg:basis-[calc((100%-2.5rem)/3)]",
		);
	});
});
