import { cacheTag } from "next/cache";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { getDatabase } from "src/lib/database";
import type { BlogPost, BlogPostDocument } from "./blog.types";
import { normalizeBlogPostDocument } from "./normalize-blogpost";

export async function getBlogPostBySlug(
	slug: string,
	locale: "vi" | "en",
): Promise<BlogPost | null> {
	"use cache";
	cacheTag(CACHE_TAGS.BLOG_POSTS);

	const db = await getDatabase();
	const slugKey = `slug.${locale}`;
	const exactLocaleDocument = await db.collection<BlogPostDocument>("blogPosts").findOne({
		[slugKey]: slug,
		status: "published",
	});

	if (exactLocaleDocument) {
		return normalizeBlogPostDocument(exactLocaleDocument);
	}

	/*
	 * Language switcher changes only the locale prefix, for example:
	 * /vi/blog/ong-gio-chong-chay-ei-la-gi -> /en/blog/ong-gio-chong-chay-ei-la-gi.
	 * Blog slugs are localized, so the incoming slug may belong to the other locale.
	 * Fallback lookup allows the detail page to find the post and redirect to the proper localized slug.
	 */
	const fallbackDocument = await db.collection<BlogPostDocument>("blogPosts").findOne({
		status: "published",
		$or: [{ "slug.vi": slug }, { "slug.en": slug }],
	});

	if (!fallbackDocument) return null;

	return normalizeBlogPostDocument(fallbackDocument);
}
