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
	const document = await db.collection<BlogPostDocument>("blogPosts").findOne({
		[slugKey]: slug,
		status: "published",
	});

	if (!document) return null;

	return normalizeBlogPostDocument(document);
}
