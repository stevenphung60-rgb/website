import type { Locale } from "src/lib/i18n/config";
import { getProductCategories } from "src/server/productcategories";
import { getProductById, getProductIds } from "src/server/products";
import { getProjectById, getProjectIds } from "src/server/projects";
import { getProjectCategoryById, getProjectCategoryIds } from "src/server/projectcategories";
import { getServiceById, getServiceIds } from "src/server/services";
import { getBlogPosts } from "src/server/blogs";
import { getLocalizedBlogText } from "src/server/blogs/blog-utils";
import type { RelatedContentOption } from "./blog-related-content-selector";

function localized(value: unknown, locale: Locale = "vi"): string {
	if (typeof value === "string") return value;

	if (value && typeof value === "object") {
		const record = value as Partial<Record<"vi" | "en", string>>;
		return record[locale] || record.vi || record.en || "";
	}

	return "";
}

async function getProductOptions(locale: Locale): Promise<RelatedContentOption[]> {
	const productIds = await getProductIds();
	const products = await Promise.all(productIds.map((productId) => getProductById(productId)));

	return products
		.filter((product): product is NonNullable<(typeof products)[number]> => Boolean(product))
		.map((product) => ({
			id: product.id,
			label: localized(product.name, locale),
			meta: product.code || undefined,
		}));
}

async function getProductCategoryOptions(locale: Locale): Promise<RelatedContentOption[]> {
	const categories = await getProductCategories();

	return categories.map((category) => ({
		id: category.id,
		label: localized(category.name, locale),
	}));
}

async function getServiceOptions(locale: Locale): Promise<RelatedContentOption[]> {
	const serviceIds = await getServiceIds();
	const services = await Promise.all(serviceIds.map((serviceId) => getServiceById(serviceId)));

	return services
		.filter((service): service is NonNullable<(typeof services)[number]> => Boolean(service))
		.map((service) => ({
			id: service.id,
			label: localized(service.name, locale),
		}));
}

async function getProjectOptions(locale: Locale): Promise<RelatedContentOption[]> {
	const projectIds = await getProjectIds();
	const projects = await Promise.all(projectIds.map((projectId) => getProjectById(projectId)));

	return projects
		.filter((project): project is NonNullable<(typeof projects)[number]> => Boolean(project))
		.map((project) => ({
			id: project.id,
			label: localized(project.name, locale),
			meta: localized(project.location, locale) || localized(project.year, locale) || undefined,
		}));
}

async function getProjectCategoryOptions(locale: Locale): Promise<RelatedContentOption[]> {
	const projectCategoryIds = await getProjectCategoryIds();
	const categories = await Promise.all(
		projectCategoryIds.map((categoryId) => getProjectCategoryById(categoryId)),
	);

	return categories
		.filter((category): category is NonNullable<(typeof categories)[number]> => Boolean(category))
		.map((category) => ({
			id: category.id,
			label: localized(category.name, locale),
		}));
}

async function getBlogPostOptions(
	locale: "vi" | "en",
	excludeBlogPostId?: string,
): Promise<RelatedContentOption[]> {
	const blogPosts = await getBlogPosts();

	return blogPosts
		.filter((blogPost) => blogPost.id !== excludeBlogPostId)
		.map((blogPost) => ({
			id: blogPost.id,
			label: getLocalizedBlogText(blogPost.title, locale),
			meta: blogPost.status === "published" ? "Đã xuất bản" : "Chưa xuất bản",
		}));
}

/**
 * Get all selectable related content options for blog admin form.
 * @param input - Optional excluded blog post ID
 * @returns Related content options grouped by module
 */
export async function getBlogRelatedOptions(input: { excludeBlogPostId?: string } = {}) {
	const locale: Locale = "vi";

	const [
		products,
		productCategories,
		services,
		projects,
		projectCategories,
		blogPosts,
	] = await Promise.all([
		getProductOptions(locale),
		getProductCategoryOptions(locale),
		getServiceOptions(locale),
		getProjectOptions(locale),
		getProjectCategoryOptions(locale),
		getBlogPostOptions(locale, input.excludeBlogPostId),
	]);

	return {
		products,
		productCategories,
		services,
		projects,
		projectCategories,
		blogPosts,
	};
}
