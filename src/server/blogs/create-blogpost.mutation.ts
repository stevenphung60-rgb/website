import { randomUUID } from "crypto";
import { getDatabase } from "src/lib/database";
import type { BlogPostDocument, BlogPostFormData } from "./blog.types";

export async function createBlogPost(input: BlogPostFormData): Promise<string> {
	const db = await getDatabase();
	const now = new Date();
	const id = randomUUID();

	const document: BlogPostDocument = {
		id,
		slug: input.slug,
		title: input.title,
		excerpt: input.excerpt,
		coverImage: input.coverImage,
		categoryId: input.categoryId,
		tags: input.tags,
		content: input.content,
		gallery: input.gallery,
		relatedProductIds: input.relatedProductIds,
		relatedProductCategoryIds: input.relatedProductCategoryIds,
		relatedServiceIds: input.relatedServiceIds,
		relatedProjectIds: input.relatedProjectIds,
		relatedProjectCategoryIds: input.relatedProjectCategoryIds,
		relatedBlogPostIds: input.relatedBlogPostIds,
		appearance: input.appearance,
		seo: input.seo,
		status: input.status,
		isFeatured: input.isFeatured,
		publishedAt:
			input.status === "published" ? input.publishedAt || now : input.publishedAt,
		createdAt: now,
		updatedAt: now,
	};

	await db.collection<BlogPostDocument>("blogPosts").insertOne(document);

	return id;
}
