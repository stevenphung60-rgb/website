import {
	DEFAULT_BLOG_APPEARANCE,
	EMPTY_BLOG_IMAGE,
	type BlogContentBlock,
	type BlogImage,
	type BlogPost,
	type BlogPostDocument,
	EMPTY_LOCALIZED_TEXT,
} from "./blog.types";
import { getMainBlogImage, normalizeBlogImages } from "./blog-utils";

function legacyBlocksToHtml(blocks: BlogContentBlock[]): string {
	return blocks
		.map((block) => {
			if (block.type === "heading") {
				const tag = block.level === 2 ? "h2" : "h3";
				return `<${tag}>${block.text}</${tag}>`;
			}

			if (block.type === "paragraph") {
				return `<p>${block.text}</p>`;
			}

			if (block.type === "quote") {
				return `<blockquote>${block.text}</blockquote>`;
			}

			if (block.type === "list") {
				const tag = block.style === "numbered" ? "ol" : "ul";
				return `<${tag}>${block.items.map((item) => `<li>${item}</li>`).join("")}</${tag}>`;
			}

			if (block.type === "table") {
				return `<table>${block.rows
					.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
					.join("")}</table>`;
			}

			return "";
		})
		.join("\n");
}

function normalizeContent(value: unknown): { vi: string; en: string } {
	if (value && typeof value === "object" && !Array.isArray(value)) {
		const content = value as Partial<Record<"vi" | "en", unknown>>;
		const vi = Array.isArray(content.vi)
			? legacyBlocksToHtml(content.vi as BlogContentBlock[])
			: typeof content.vi === "string"
				? content.vi
				: "";
		const en = Array.isArray(content.en)
			? legacyBlocksToHtml(content.en as BlogContentBlock[])
			: typeof content.en === "string"
				? content.en
				: vi;

		return {
			vi,
			en: en || vi,
		};
	}

	return EMPTY_LOCALIZED_TEXT;
}

function normalizeImage(value: unknown): BlogImage {
	if (!value || typeof value !== "object") {
		return EMPTY_BLOG_IMAGE;
	}

	const image = value as Partial<BlogImage>;

	return {
		url: image.url || "",
		alt: {
			vi: image.alt?.vi || "",
			en: image.alt?.en || image.alt?.vi || "",
		},
		caption: {
			vi: image.caption?.vi || "",
			en: image.caption?.en || image.caption?.vi || "",
		},
		order: Number.isFinite(image.order) ? Number(image.order) : 0,
		isMain: Boolean(image.isMain),
	};
}

/**
 * Normalize blog post document for backward compatibility.
 * @param document - Raw MongoDB blog post document
 * @returns Safe blog post object
 */
export function normalizeBlogPostDocument(document: BlogPostDocument): BlogPost {
	const gallery = normalizeBlogImages(
		Array.isArray(document.gallery) ? document.gallery.map(normalizeImage) : [],
	);
	const coverImage = getMainBlogImage(gallery) || normalizeImage(document.coverImage);

	return {
		id: document.id,
		slug: document.slug || EMPTY_LOCALIZED_TEXT,
		title: document.title || EMPTY_LOCALIZED_TEXT,
		excerpt: document.excerpt || EMPTY_LOCALIZED_TEXT,
		coverImage,
		categoryId: document.categoryId || "",
		tags: Array.isArray(document.tags) ? document.tags : [],
		content: normalizeContent(document.content),
		gallery,
		relatedProductIds: Array.isArray(document.relatedProductIds)
			? document.relatedProductIds
			: [],
		relatedProductCategoryIds: Array.isArray(document.relatedProductCategoryIds)
			? document.relatedProductCategoryIds
			: [],
		relatedServiceIds: Array.isArray(document.relatedServiceIds)
			? document.relatedServiceIds
			: [],
		relatedProjectIds: Array.isArray(document.relatedProjectIds)
			? document.relatedProjectIds
			: [],
		relatedProjectCategoryIds: Array.isArray(document.relatedProjectCategoryIds)
			? document.relatedProjectCategoryIds
			: [],
		relatedBlogPostIds: Array.isArray(document.relatedBlogPostIds)
			? document.relatedBlogPostIds
			: [],
		appearance: document.appearance || DEFAULT_BLOG_APPEARANCE,
		seo: document.seo || {
			title: document.title || EMPTY_LOCALIZED_TEXT,
			description: document.excerpt || EMPTY_LOCALIZED_TEXT,
			keywords: Array.isArray(document.tags) ? document.tags : [],
			ogImage: coverImage.url,
		},
		status: document.status || "draft",
		isFeatured: Boolean(document.isFeatured),
		publishedAt: document.publishedAt || null,
		createdAt: document.createdAt || new Date(),
		updatedAt: document.updatedAt || new Date(),
	};
}
