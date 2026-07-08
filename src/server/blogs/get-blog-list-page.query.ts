import { cacheTag } from "next/cache";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { BlogCategory, BlogCategoryDocument, BlogPost, BlogPostDocument } from "./blog.types";
import { normalizeBlogPostDocument } from "./normalize-blogpost";

export const BLOG_LIST_PAGE_SIZE = 6;

export interface BlogCategoryFilterItem {
	id: string;
	name: BlogCategory["name"];
	count: number;
}

export interface BlogTagFilterItem {
	name: string;
	count: number;
}

export interface BlogListPagination {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	pageSize: number;
}

export interface BlogListPageData {
	latestBlog: BlogPost | null;
	blogs: BlogPost[];
	featuredBlogs: BlogPost[];
	categories: BlogCategoryFilterItem[];
	tags: BlogTagFilterItem[];
	pagination: BlogListPagination;
	selectedCategory: BlogCategory | null;
	selectedTag: string;
}

interface GetBlogListPageInput {
	categoryId?: string | null;
	tag?: string | null;
	page?: number;
}

function normalizePage(page?: number): number {
	if (!page || !Number.isFinite(page) || page < 1) return 1;
	return Math.floor(page);
}

function buildPublishedBlogQuery(input: GetBlogListPageInput): Record<string, unknown> {
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

async function getCategoryFilters(db: Awaited<ReturnType<typeof getDatabase>>) {
	const [categories, categoryCounts] = await Promise.all([
		db
			.collection<BlogCategoryDocument>("blogCategories")
			.find({})
			.sort({ updatedAt: -1 })
			.toArray(),
		db
			.collection<BlogPostDocument>("blogPosts")
			.aggregate<{ _id: string; count: number }>([
				{ $match: { status: "published", categoryId: { $ne: "" } } },
				{ $group: { _id: "$categoryId", count: { $sum: 1 } } },
			])
			.toArray(),
	]);

	const countMap = new Map(categoryCounts.map((item) => [item._id, item.count]));

	return categories.map(({ _id, ...category }) => ({
		id: category.id,
		name: category.name,
		count: countMap.get(category.id) || 0,
	}));
}

async function getTagFilters(db: Awaited<ReturnType<typeof getDatabase>>) {
	return db
		.collection<BlogPostDocument>("blogPosts")
		.aggregate<BlogTagFilterItem>([
			{ $match: { status: "published", tags: { $exists: true, $ne: [] } } },
			{ $unwind: "$tags" },
			{ $match: { tags: { $ne: "" } } },
			{ $group: { _id: "$tags", count: { $sum: 1 } } },
			{ $sort: { count: -1, _id: 1 } },
			{ $limit: 12 },
			{ $project: { _id: 0, name: "$_id", count: 1 } },
		])
		.toArray();
}

/**
 * Get public blog list page data with server-side pagination.
 * The newest matching blog is displayed separately, and the remaining blogs are paginated.
 * @param input - Blog list filter and pagination input
 * @returns Blog list page data
 */
export async function getBlogListPage(
	input: GetBlogListPageInput = {},
): Promise<BlogListPageData> {
	"use cache";
	cacheTag(CACHE_TAGS.BLOG_POSTS);
	cacheTag(CACHE_TAGS.BLOG_CATEGORIES);

	const db = await getDatabase();
	const requestedPage = normalizePage(input.page);
	const selectedTag = input.tag?.trim() || "";
	const query = buildPublishedBlogQuery({
		categoryId: input.categoryId || null,
		tag: selectedTag || null,
	});

	const [latestDocument, totalMatchingBlogs, categories, tags, featuredDocuments] = await Promise.all([
		db
			.collection<BlogPostDocument>("blogPosts")
			.find(query)
			.sort(publicBlogSort)
			.limit(1)
			.next(),
		db.collection<BlogPostDocument>("blogPosts").countDocuments(query),
		getCategoryFilters(db),
		getTagFilters(db),
		db
			.collection<BlogPostDocument>("blogPosts")
			.find({ status: "published", isFeatured: true })
			.sort(publicBlogSort)
			.limit(4)
			.toArray(),
	]);

	const latestBlog = latestDocument ? normalizeBlogPostDocument(latestDocument) : null;
	const listTotal = Math.max(totalMatchingBlogs - (latestBlog ? 1 : 0), 0);
	const totalPages = Math.max(1, Math.ceil(listTotal / BLOG_LIST_PAGE_SIZE));
	const currentPage = Math.min(requestedPage, totalPages);
	const skip = latestBlog ? 1 + (currentPage - 1) * BLOG_LIST_PAGE_SIZE : (currentPage - 1) * BLOG_LIST_PAGE_SIZE;

	const blogDocuments = listTotal > 0
		? await db
				.collection<BlogPostDocument>("blogPosts")
				.find(query)
				.sort(publicBlogSort)
				.skip(skip)
				.limit(BLOG_LIST_PAGE_SIZE)
				.toArray()
		: [];

	const selectedCategory = input.categoryId
		? await db.collection<BlogCategoryDocument>("blogCategories").findOne({ id: input.categoryId })
		: null;

	return {
		latestBlog,
		blogs: blogDocuments.map(normalizeBlogPostDocument),
		featuredBlogs: featuredDocuments
			.map(normalizeBlogPostDocument)
			.filter((blog) => blog.id !== latestBlog?.id),
		categories,
		tags,
		pagination: {
			currentPage,
			totalPages,
			totalItems: listTotal,
			pageSize: BLOG_LIST_PAGE_SIZE,
		},
		selectedCategory: selectedCategory
			? (({ _id, ...category }) => category)(selectedCategory)
			: null,
		selectedTag,
	};
}
