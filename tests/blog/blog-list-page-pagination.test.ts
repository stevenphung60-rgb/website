import type { Document } from "mongodb";
import { type BlogPostDocument, DEFAULT_BLOG_APPEARANCE } from "src/server/blogs/blog.types";
import { getBlogListPageData } from "src/server/blogs/get-blog-list-page.query";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createTestDatabase, type TestDatabase } from "../utils/test-database";

const testDb: TestDatabase = createTestDatabase("blog-list-page-pagination");

vi.mock("next/cache", () => ({
	cacheTag: vi.fn(),
}));

vi.mock("src/lib/database", () => ({
	getDatabase: async () => testDb.getDb(),
}));

function createPublishedPost(index: number): BlogPostDocument {
	const publishedAt = new Date(Date.UTC(2026, 0, index));
	const localizedTitle = {
		vi: `Bài viết ${index}`,
		en: `Blog post ${index}`,
	};

	return {
		id: `blog-${index}`,
		slug: {
			vi: `bai-viet-${index}`,
			en: `blog-post-${index}`,
		},
		title: localizedTitle,
		excerpt: localizedTitle,
		coverImage: {
			url: `/blog-${index}.jpg`,
			alt: localizedTitle,
			order: 0,
			isMain: true,
		},
		categoryId: "category-1",
		tags: [],
		content: localizedTitle,
		gallery: [],
		relatedProductIds: [],
		relatedProductCategoryIds: [],
		relatedServiceIds: [],
		relatedProjectIds: [],
		relatedProjectCategoryIds: [],
		relatedBlogPostIds: [],
		appearance: DEFAULT_BLOG_APPEARANCE,
		seo: {
			title: localizedTitle,
			description: localizedTitle,
			keywords: [],
			ogImage: `/blog-${index}.jpg`,
		},
		status: "published",
		isFeatured: index === 14,
		publishedAt,
		createdAt: publishedAt,
		updatedAt: publishedAt,
	};
}

describe("getBlogListPageData responsive pagination", () => {
	beforeAll(async () => {
		await testDb.connect();
		await testDb
			.getDb()
			.collection<Document>("blogPosts")
			.insertMany(
				Array.from({ length: 14 }, (_, index) =>
					createPublishedPost(index + 1),
				) as unknown as Document[],
			);
	});

	afterAll(async () => {
		await testDb.destroy();
	});

	it("returns desktop and mobile page windows while excluding the latest post from both", async () => {
		const result = await getBlogListPageData({ page: 1 });

		expect(result.latestPost?.id).toBe("blog-14");
		expect(result.posts.map((post) => post.id)).toEqual([
			"blog-13",
			"blog-12",
			"blog-11",
			"blog-10",
			"blog-9",
			"blog-8",
		]);
		expect(result.mobilePosts.map((post) => post.id)).toEqual([
			"blog-13",
			"blog-12",
			"blog-11",
			"blog-10",
			"blog-9",
			"blog-8",
			"blog-7",
			"blog-6",
			"blog-5",
			"blog-4",
			"blog-3",
			"blog-2",
		]);
		expect(result.listBlogCount).toBe(13);
		expect(result.pageSize).toBe(6);
		expect(result.totalPages).toBe(3);
		expect(result.mobilePageSize).toBe(12);
		expect(result.mobileTotalPages).toBe(2);
	});

	it("clamps the mobile page independently when desktop has more pages", async () => {
		const result = await getBlogListPageData({ page: 3 });

		expect(result.currentPage).toBe(3);
		expect(result.posts.map((post) => post.id)).toEqual(["blog-1"]);
		expect(result.mobileCurrentPage).toBe(2);
		expect(result.mobilePosts.map((post) => post.id)).toEqual(["blog-1"]);
	});
});
