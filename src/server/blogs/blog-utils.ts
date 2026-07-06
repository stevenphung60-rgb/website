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

/**
 * Estimate reading time from content blocks
 * @param blocks - Blog content blocks
 * @returns Reading time in minutes
 */
export function getBlogReadingTime(blocks: BlogContentBlock[]): number {
	const wordCount = blocks.reduce((total, block) => {
		if (block.type === "paragraph" || block.type === "heading" || block.type === "quote") {
			return total + block.text.split(/\s+/).filter(Boolean).length;
		}

		if (block.type === "list") {
			return (
				total +
				block.items.join(" ").split(/\s+/).filter(Boolean).length
			);
		}

		if (block.type === "table") {
			return (
				total +
				block.rows.flat().join(" ").split(/\s+/).filter(Boolean).length
			);
		}

		return total;
	}, 0);

	return Math.max(1, Math.ceil(wordCount / 220));
}

/**
 * Normalize image array ordering
 * @param images - Input images
 * @returns Images with stable order
 */
export function normalizeBlogImages(images: BlogImage[]): BlogImage[] {
	return images
		.filter((image) => image.url)
		.map((image, index) => ({
			...image,
			order: Number.isFinite(image.order) ? image.order : index,
		}))
		.sort((a, b) => a.order - b.order)
		.map((image, index) => ({
			...image,
			order: index,
		}));
}
