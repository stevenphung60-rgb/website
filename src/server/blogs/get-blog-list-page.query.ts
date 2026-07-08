import { cacheTag } from "next/cache";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type {
	BlogCategory,
	BlogCategoryDocument,
	BlogPost,
	BlogPostDocument,
} from "./blog.types";
import { normalizeBlogPostDocument } from "./normalize-blogpost";

export const BLOG_LIST_PAGE_SIZE = 6;


interface GetBlogListPageDataInput {
	categoryId?: string | null;
	page?: number;
	tag?: string | null;
}

export interface BlogCategorySummary {
	category: BlogCategory;
	count: number;
}

export interface BlogTagSummary {
	name: string;
	count: number;
}

export interface BlogListPageData {
	categories: BlogCategorySummary[];
	featuredPosts: BlogPost[];
	latestPost: BlogPost | null;
	posts: BlogPost[];
	tags: BlogTagSummary[];
	totalBlogCount: number;
	filteredBlogCount: number;
	listBlogCount: number;
	currentPage: number;
	totalPages: number;
	pageSize: number;
	selectedCategoryId: string | null;
	selectedTag: string | null;
}

function normalizePage(value?: number): number {
	if (!value || !Number.isFinite(value)) return 1;
	return Math.max(1, Math.floor(value));
}

function normalizeTag(value?: string | null): string | null {
	const tag = value?.trim();
	return tag || null;
}

function createPublishedBlogQuery(input: {
	categoryId?: string | null;
	tag?: string | null;
}) {
	const query: Record<string, unknown> = {
		status: "published",
	};

	if (input.categoryId) {
		query.categoryId = input.categoryId;
	}

	if (input.tag) {
		query.tags = input.tag;
	}

	return query;
}

const publicBlogSort = {
	publishedAt: -1,
	createdAt: -1,
	updatedAt: -1,
} as const;

async function getCategoryCounts(): Promise<Map<string, number>> {
	const db = await getDatabase();
	const groupedCategories = await db
		.collection<BlogPostDocument>("blogPosts")
		.aggregate<{ _id: string; count: number }>([
			{
				$match: {
					status: "published",
					categoryId: { $type: "string", $ne: "" },
				},
			},
			{ $group: { _id: "$categoryId", count: { $sum: 1 } } },
		])
		.toArray();

	return new Map(groupedCategories.map((item) => [item._id, item.count]));
}

async function getTagCounts(limit = 18): Promise<BlogTagSummary[]> {
	const db = await getDatabase();
	const groupedTags = await db
		.collection<BlogPostDocument>("blogPosts")
		.aggregate<{ _id: string; count: number }>([
			{
				$match: {
					status: "published",
					tags: { $exists: true, $ne: [] },
				},
			},
			{ $unwind: "$tags" },
			{ $match: { tags: { $type: "string", $ne: "" } } },
			{ $group: { _id: "$tags", count: { $sum: 1 } } },
			{ $sort: { count: -1, _id: 1 } },
			{ $limit: limit },
		])
		.toArray();

	return groupedTags.map((item) => ({
		name: item._id,
		count: item.count,
	}));
}

async function getCategorySummaries(): Promise<BlogCategorySummary[]> {
	const db = await getDatabase();
	const [categories, categoryCounts] = await Promise.all([
		db
			.collection<BlogCategoryDocument>("blogCategories")
			.find({})
			.sort({ updatedAt: -1 })
			.toArray(),
		getCategoryCounts(),
	]);

	return categories.map(({ _id, ...category }) => ({
		category,
		count: categoryCounts.get(category.id) || 0,
	}));
}

async function getFeaturedPosts(limit = 3): Promise<BlogPost[]> {
	const db = await getDatabase();
	const documents = await db
		.collection<BlogPostDocument>("blogPosts")
		.find({ status: "published", isFeatured: true })
		.sort(publicBlogSort)
		.limit(limit)
		.toArray();

	return documents.map(normalizeBlogPostDocument);
}

/**
 * Get all data needed for the public blog list page.
 * The latest matching blog is separated from the paginated list below it.
 * @param input - Blog list filters and pagination
 * @returns Blog list page data
 */
export async function getBlogListPageData(
	input: GetBlogListPageDataInput = {},
): Promise<BlogListPageData> {
	"use cache";
	cacheTag(CACHE_TAGS.BLOG_POSTS);
	cacheTag(CACHE_TAGS.BLOG_CATEGORIES);

	const selectedCategoryId = input.categoryId || null;
	const selectedTag = normalizeTag(input.tag);
	const requestedPage = normalizePage(input.page);
	const db = await getDatabase();
	const baseQuery = createPublishedBlogQuery({
		categoryId: selectedCategoryId,
		tag: selectedTag,
	});

	const [categories, featuredPosts, tags, totalBlogCount, filteredBlogCount, latestDocument] =
		await Promise.all([
			getCategorySummaries(),
			getFeaturedPosts(3),
			getTagCounts(),
			db.collection<BlogPostDocument>("blogPosts").countDocuments({ status: "published" }),
			db.collection<BlogPostDocument>("blogPosts").countDocuments(baseQuery),
			db
				.collection<BlogPostDocument>("blogPosts")
				.find(baseQuery)
				.sort(publicBlogSort)
				.limit(1)
				.next(),
		]);

	const latestPost = latestDocument ? normalizeBlogPostDocument(latestDocument) : null;
	const listBlogCount = Math.max(filteredBlogCount - (latestPost ? 1 : 0), 0);
	const totalPages = Math.max(1, Math.ceil(listBlogCount / BLOG_LIST_PAGE_SIZE));
	const currentPage = Math.min(requestedPage, totalPages);
	const skip = (currentPage - 1) * BLOG_LIST_PAGE_SIZE;
	const listQuery = latestPost
		? {
				...baseQuery,
				id: { $ne: latestPost.id },
			}
		: baseQuery;

	const postDocuments = await db
		.collection<BlogPostDocument>("blogPosts")
		.find(listQuery)
		.sort(publicBlogSort)
		.skip(skip)
		.limit(BLOG_LIST_PAGE_SIZE)
		.toArray();

	return {
		categories,
		featuredPosts,
		latestPost,
		posts: postDocuments.map(normalizeBlogPostDocument),
		tags,
		totalBlogCount,
		filteredBlogCount,
		listBlogCount,
		currentPage,
		totalPages,
		pageSize: BLOG_LIST_PAGE_SIZE,
		selectedCategoryId,
		selectedTag,
	};
}
