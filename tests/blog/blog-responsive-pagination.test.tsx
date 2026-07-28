import { render, screen, within } from "@testing-library/react";
import BlogListPage from "src/app/(main)/[lang]/blog/page";
import { getBlogListPageData } from "src/server/blogs";
import { type BlogPost, DEFAULT_BLOG_APPEARANCE } from "src/server/blogs/blog.types";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("src/components/blog/blog-mobile-category-select", () => ({
	BlogMobileCategorySelect: () => <div data-testid="blog-mobile-filter" />,
}));

vi.mock("src/server/blogs", () => ({
	getBlogListPageData: vi.fn(),
}));

function createPost(id: string): BlogPost {
	const timestamp = new Date("2026-07-28T08:00:00.000Z");

	return {
		id,
		slug: { vi: id, en: id },
		title: { vi: `Bài viết ${id}`, en: `Post ${id}` },
		excerpt: { vi: "Tóm tắt", en: "Summary" },
		coverImage: {
			url: "",
			alt: { vi: "", en: "" },
			order: 0,
		},
		categoryId: "",
		tags: [],
		content: { vi: "Nội dung", en: "Content" },
		gallery: [],
		relatedProductIds: [],
		relatedProductCategoryIds: [],
		relatedServiceIds: [],
		relatedProjectIds: [],
		relatedProjectCategoryIds: [],
		relatedBlogPostIds: [],
		appearance: DEFAULT_BLOG_APPEARANCE,
		seo: {
			title: { vi: "", en: "" },
			description: { vi: "", en: "" },
			keywords: [],
			ogImage: "",
		},
		status: "published",
		isFeatured: false,
		publishedAt: timestamp,
		createdAt: timestamp,
		updatedAt: timestamp,
	};
}

describe("blog responsive pagination", () => {
	beforeEach(() => {
		vi.mocked(getBlogListPageData).mockResolvedValue({
			categories: [],
			featuredPosts: [],
			latestPost: createPost("latest-post"),
			posts: Array.from({ length: 6 }, (_, index) => createPost(`desktop-post-${index + 1}`)),
			mobilePosts: Array.from({ length: 12 }, (_, index) => createPost(`mobile-post-${index + 1}`)),
			tags: [],
			totalBlogCount: 14,
			filteredBlogCount: 14,
			listBlogCount: 13,
			currentPage: 1,
			totalPages: 3,
			pageSize: 6,
			mobileCurrentPage: 1,
			mobileTotalPages: 2,
			mobilePageSize: 12,
			selectedCategoryId: null,
			selectedTag: null,
		});
	});

	it("renders a 12-card mobile page with its page indicator while keeping six desktop cards", async () => {
		const page = await BlogListPage({
			params: Promise.resolve({ lang: "vi" }),
			searchParams: Promise.resolve({}),
		});
		const { container } = render(page);
		const mobileList = container.querySelector('[data-blog-list-layout="mobile"]');
		const desktopList = container.querySelector('[data-blog-list-layout="desktop"]');

		expect(mobileList).not.toBeNull();
		expect(desktopList).not.toBeNull();
		expect(mobileList?.querySelectorAll('a[href^="/vi/blog/mobile-post-"]')).toHaveLength(12);
		expect(desktopList?.querySelectorAll('a[href^="/vi/blog/desktop-post-"]')).toHaveLength(6);
		expect(screen.getByRole("status")).toHaveTextContent("Trang 1 / 2");
		expect(within(mobileList as HTMLElement).getByRole("link", { name: "2" })).toHaveAttribute(
			"href",
			"/vi/blog?page=2#blog-list",
		);
	});
});
