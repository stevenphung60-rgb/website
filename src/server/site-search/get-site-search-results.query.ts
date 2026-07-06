import { getDatabase } from "src/lib/database";
import type { BlogPostDocument } from "src/server/blogs";
import type { ProductDocument } from "src/server/products";
import { ProductStatus } from "src/server/products";
import type { ProjectDocument } from "src/server/projects";
import { ProjectVisibilityStatus } from "src/server/projects";
import type { ServiceDocument } from "src/server/services";
import { ServiceStatus } from "src/server/services";
import type { SiteSearchInput, SiteSearchResult, SiteSearchResultType } from "./site-search.types";

const typeLabels: Record<"vi" | "en", Record<SiteSearchResultType, string>> = {
	vi: {
		product: "Sản phẩm",
		service: "Dịch vụ",
		project: "Dự án",
		blog: "Blog",
	},
	en: {
		product: "Product",
		service: "Service",
		project: "Project",
		blog: "Blog",
	},
};

function normalizeSearchText(value: string): string {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/đ/g, "d")
		.replace(/Đ/g, "D")
		.toLowerCase()
		.trim();
}

function getLocalizedText(
	value: unknown,
	locale: "vi" | "en",
	fallbackLocale: "vi" | "en" = "vi",
): string {
	if (typeof value === "string") return value;

	if (value && typeof value === "object") {
		const record = value as Partial<Record<"vi" | "en", string>>;
		return record[locale] || record[fallbackLocale] || record.en || record.vi || "";
	}

	return "";
}

function stripHtml(value: string): string {
	return value
		.replace(/<style[\s\S]*?<\/style>/gi, " ")
		.replace(/<script[\s\S]*?<\/script>/gi, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\s+/g, " ")
		.trim();
}

function truncate(value: string, maxLength = 150): string {
	const normalizedValue = value.replace(/\s+/g, " ").trim();

	if (normalizedValue.length <= maxLength) {
		return normalizedValue;
	}

	return `${normalizedValue.slice(0, maxLength).trim()}...`;
}

function collectBlogBlockText(block: unknown, locale: "vi" | "en"): string[] {
	if (!block || typeof block !== "object") return [];

	const blockRecord = block as Record<string, unknown>;
	const type = blockRecord.type;

	if (type === "paragraph" || type === "heading" || type === "quote") {
		return [String(blockRecord.text || "")];
	}

	if (type === "list" && Array.isArray(blockRecord.items)) {
		return blockRecord.items.map((item) => String(item || ""));
	}

	if (type === "table" && Array.isArray(blockRecord.rows)) {
		return blockRecord.rows.flatMap((row) =>
			Array.isArray(row) ? row.map((cell) => String(cell || "")) : [],
		);
	}

	if (type === "image") {
		const image = blockRecord.image as Record<string, unknown> | undefined;
		return [
			getLocalizedText(image?.alt, locale),
			getLocalizedText(image?.caption, locale),
		];
	}

	if (type === "gallery" && Array.isArray(blockRecord.images)) {
		return blockRecord.images.flatMap((image) => {
			const imageRecord = image as Record<string, unknown>;
			return [
				getLocalizedText(imageRecord.alt, locale),
				getLocalizedText(imageRecord.caption, locale),
			];
		});
	}

	return [];
}

function getBlogContentText(post: BlogPostDocument, locale: "vi" | "en"): string {
	const postRecord = post as unknown as Record<string, unknown>;
	const contentHtml = postRecord.contentHtml as Partial<Record<"vi" | "en", string>> | undefined;

	if (contentHtml?.[locale]) {
		return stripHtml(contentHtml[locale] || "");
	}

	const content = postRecord.content as Partial<Record<"vi" | "en", unknown>> | undefined;
	const blocks = content?.[locale];

	if (Array.isArray(blocks)) {
		return blocks.flatMap((block) => collectBlogBlockText(block, locale)).join(" ");
	}

	if (typeof blocks === "string") {
		return stripHtml(blocks);
	}

	return "";
}

function scoreResult(query: string, title: string, description: string, searchText: string): number {
	const normalizedQuery = normalizeSearchText(query);
	const normalizedTitle = normalizeSearchText(title);
	const normalizedDescription = normalizeSearchText(description);
	const normalizedSearchText = normalizeSearchText(searchText);

	if (!normalizedQuery) return 0;

	let score = 0;

	if (normalizedTitle === normalizedQuery) score += 120;
	if (normalizedTitle.includes(normalizedQuery)) score += 90;
	if (normalizedDescription.includes(normalizedQuery)) score += 55;
	if (normalizedSearchText.includes(normalizedQuery)) score += 35;

	return score;
}

function createResult(input: {
	id: string;
	type: SiteSearchResultType;
	locale: "vi" | "en";
	title: string;
	description: string;
	searchText: string;
	href: string;
	query: string;
}): SiteSearchResult | null {
	const title = input.title.trim();
	const description = input.description.trim();
	const searchText = input.searchText.trim();
	const score = scoreResult(input.query, title, description, searchText);

	if (!title || score <= 0) {
		return null;
	}

	return {
		id: input.id,
		type: input.type,
		label: typeLabels[input.locale][input.type],
		title,
		description: truncate(description || searchText || title),
		href: input.href,
		score,
	};
}

/**
 * Search public website content across products, services, projects and blog posts.
 * @param input - Search input
 * @returns Matching search results
 */
export async function getSiteSearchResults(input: SiteSearchInput): Promise<SiteSearchResult[]> {
	const query = input.query.trim();
	const locale = input.locale === "en" ? "en" : "vi";
	const limit = input.limit && input.limit > 0 ? input.limit : 8;

	if (query.length < 2) {
		return [];
	}

	const db = await getDatabase();

	const [products, services, projects, blogPosts] = await Promise.all([
		db.collection<ProductDocument>("products").find({ status: ProductStatus.Active }).toArray(),
		db.collection<ServiceDocument>("services").find({ status: ServiceStatus.Active }).toArray(),
		db.collection<ProjectDocument>("projects").find({ visibilityStatus: ProjectVisibilityStatus.Active }).toArray(),
		db.collection<BlogPostDocument>("blogPosts").find({ status: "published" }).toArray(),
	]);

	const results: SiteSearchResult[] = [];

	for (const product of products) {
		const title = getLocalizedText(product.name, locale);
		const description = getLocalizedText(product.description, locale);
		const searchText = [title, description, product.code].join(" ");
		const result = createResult({
			id: product.id,
			type: "product",
			locale,
			title,
			description,
			searchText,
			href: `/${locale}/products/${product.id}`,
			query,
		});

		if (result) results.push(result);
	}

	for (const service of services) {
		const title = getLocalizedText(service.name, locale);
		const description = getLocalizedText(service.description, locale);
		const result = createResult({
			id: service.id,
			type: "service",
			locale,
			title,
			description,
			searchText: [title, description].join(" "),
			href: `/${locale}/services#service-card-${service.id}`,
			query,
		});

		if (result) results.push(result);
	}

	for (const project of projects) {
		const title = getLocalizedText(project.name, locale);
		const description = getLocalizedText(project.description, locale);
		const location = getLocalizedText(project.location, locale);
		const year = getLocalizedText(project.year, locale);
		const specs = Array.isArray(project.specs)
			? project.specs.map((spec) => getLocalizedText(spec, locale)).join(" ")
			: "";
		const result = createResult({
			id: project.id,
			type: "project",
			locale,
			title,
			description,
			searchText: [title, description, location, year, specs].join(" "),
			href: `/${locale}/projects/${project.id}`,
			query,
		});

		if (result) results.push(result);
	}

	for (const blogPost of blogPosts) {
		const title = getLocalizedText(blogPost.title, locale);
		const description = getLocalizedText(blogPost.excerpt, locale);
		const contentText = getBlogContentText(blogPost, locale);
		const slug = getLocalizedText(blogPost.slug, locale);

		if (!slug) continue;

		const result = createResult({
			id: blogPost.id,
			type: "blog",
			locale,
			title,
			description,
			searchText: [title, description, contentText, blogPost.tags?.join(" ") || ""].join(" "),
			href: `/${locale}/blog/${slug}`,
			query,
		});

		if (result) results.push(result);
	}

	return results
		.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, locale))
		.slice(0, limit);
}
