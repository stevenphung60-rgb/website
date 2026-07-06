import type { BlogContentBlock, BlogImage, LocalizedText } from "./blog.types";

/**
 * Convert text to URL-safe slug with Vietnamese character support
 * @param value - Source text
 * @returns URL slug
 */
export function slugify(value: string): string {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/đ/g, "d")
		.replace(/Đ/g, "d")
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

/**
 * Resolve localized text with fallback
 * @param value - Localized text
 * @param locale - Locale key
 * @returns Localized value
 */
export function getLocalizedBlogText(value: LocalizedText, locale: "vi" | "en") {
	return value?.[locale] || value?.vi || value?.en || "";
}

function stripHtml(value: string): string {
	return value
		.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
		.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/\s+/g, " ")
		.trim();
}

function getLegacyBlockText(blocks: BlogContentBlock[]): string {
	return blocks
		.map((block) => {
			if (block.type === "paragraph" || block.type === "heading" || block.type === "quote") {
				return block.text;
			}

			if (block.type === "list") {
				return block.items.join(" ");
			}

			if (block.type === "table") {
				return block.rows.flat().join(" ");
			}

			return "";
		})
		.join(" ");
}

/**
 * Estimate reading time from HTML content or legacy content blocks
 * @param content - Blog content html or legacy blocks
 * @returns Reading time in minutes
 */
export function getBlogReadingTime(content: string | BlogContentBlock[]): number {
	const plainText = Array.isArray(content) ? getLegacyBlockText(content) : stripHtml(content);
	const wordCount = plainText.split(/\s+/).filter(Boolean).length;

	return Math.max(1, Math.ceil(wordCount / 220));
}

/**
 * Normalize image array ordering and main image selection
 * @param images - Input images
 * @returns Images with stable order and exactly one main image when possible
 */
export function normalizeBlogImages(images: BlogImage[]): BlogImage[] {
	const normalizedImages = images
		.filter((image) => image.url)
		.map((image, index) => ({
			url: image.url,
			alt: {
				vi: image.alt?.vi || "",
				en: image.alt?.en || image.alt?.vi || "",
			},
			caption: {
				vi: image.caption?.vi || "",
				en: image.caption?.en || image.caption?.vi || "",
			},
			order: Number.isFinite(image.order) ? image.order : index,
			isMain: Boolean(image.isMain),
		}))
		.sort((a, b) => a.order - b.order)
		.map((image, index) => ({
			...image,
			order: index,
		}));

	if (normalizedImages.length === 0) {
		return [];
	}

	const mainImageIndex = normalizedImages.findIndex((image) => image.isMain);

	return normalizedImages.map((image, index) => ({
		...image,
		isMain: mainImageIndex >= 0 ? index === mainImageIndex : index === 0,
	}));
}

/**
 * Get main blog image from gallery
 * @param images - Blog image gallery
 * @returns Main image or null
 */
export function getMainBlogImage(images: BlogImage[]): BlogImage | null {
	const normalizedImages = normalizeBlogImages(images);

	return normalizedImages.find((image) => image.isMain) || normalizedImages[0] || null;
}
