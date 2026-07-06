"use server";

import { Buffer } from "buffer";
import fs from "fs/promises";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { SITE_FONT_OPTIONS } from "src/lib/font-presets";
import {
	createBlogPost,
	deleteBlogPost,
	updateBlogPost,
	type BlogAppearanceSettings,
	type BlogFontSelection,
	type BlogImage,
	type BlogPostFormData,
	type BlogPostStatus,
} from "src/server/blogs";
import { getMainBlogImage, normalizeBlogImages, slugify } from "src/server/blogs/blog-utils";

type UploadBlogImageResult =
	| {
			success: true;
			data: string;
	  }
	| {
			success: false;
			error: string;
	  };

function getFormString(formData: FormData, key: string): string {
	return ((formData.get(key) as string | null) || "").trim();
}

function getFormBoolean(formData: FormData, key: string): boolean {
	return formData.get(key) === "on" || formData.get(key) === "true";
}

function parseCsv(value: string): string[] {
	return value
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);
}

function parseDate(value: string): Date | null {
	if (!value) return null;

	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

function parseJsonArray<T>(value: string, fallback: T[]): T[] {
	try {
		const parsedValue = JSON.parse(value || "[]");

		return Array.isArray(parsedValue) ? parsedValue : fallback;
	} catch {
		return fallback;
	}
}

function isBlogPostStatus(value: string): value is BlogPostStatus {
	return value === "draft" || value === "published" || value === "hidden";
}

function isFontSelection(value: string): value is BlogFontSelection {
	return value === "site" || value in SITE_FONT_OPTIONS;
}

function parseAppearance(formData: FormData): BlogAppearanceSettings {
	const headingFontId = getFormString(formData, "headingFontId");
	const bodyFontId = getFormString(formData, "bodyFontId");
	const bodySize = getFormString(formData, "bodySize");
	const lineHeight = getFormString(formData, "lineHeight");
	const contentWidth = getFormString(formData, "contentWidth");

	return {
		headingFontId: isFontSelection(headingFontId) ? headingFontId : "site",
		bodyFontId: isFontSelection(bodyFontId) ? bodyFontId : "site",
		bodySize:
			bodySize === "compact" ||
			bodySize === "standard" ||
			bodySize === "comfortable" ||
			bodySize === "large"
				? bodySize
				: "standard",
		lineHeight:
			lineHeight === "compact" || lineHeight === "standard" || lineHeight === "relaxed"
				? lineHeight
				: "relaxed",
		contentWidth:
			contentWidth === "narrow" || contentWidth === "standard" || contentWidth === "wide"
				? contentWidth
				: "standard",
	};
}

function normalizeHtml(value: string): string {
	return value.trim();
}

function createFallbackImage(titleVi: string, titleEn: string): BlogImage {
	return {
		url: "",
		alt: {
			vi: titleVi,
			en: titleEn || titleVi,
		},
		caption: {
			vi: "",
			en: "",
		},
		order: 0,
		isMain: false,
	};
}

function parseBlogPostFormData(formData: FormData): BlogPostFormData {
	const titleVi = getFormString(formData, "titleVi");
	const titleEn = getFormString(formData, "titleEn") || titleVi;
	const statusValue = getFormString(formData, "status");
	const gallery = normalizeBlogImages(
		parseJsonArray<BlogImage>(getFormString(formData, "gallery"), []),
	);
	const mainImage = getMainBlogImage(gallery) || createFallbackImage(titleVi, titleEn);
	const excerptVi = getFormString(formData, "excerptVi");
	const excerptEn = getFormString(formData, "excerptEn") || excerptVi;
	const contentVi = normalizeHtml(getFormString(formData, "contentHtmlVi"));
	const contentEn = normalizeHtml(getFormString(formData, "contentHtmlEn")) || contentVi;

	if (!titleVi) {
		throw new Error("Tiêu đề tiếng Việt là bắt buộc");
	}

	return {
		blogPostId: getFormString(formData, "blogPostId") || undefined,
		title: {
			vi: titleVi,
			en: titleEn,
		},
		slug: {
			vi: slugify(titleVi),
			en: slugify(titleEn || titleVi),
		},
		excerpt: {
			vi: excerptVi,
			en: excerptEn,
		},
		coverImage: mainImage,
		categoryId: getFormString(formData, "categoryId"),
		tags: parseCsv(getFormString(formData, "tags")),
		content: {
			vi: contentVi,
			en: contentEn,
		},
		gallery,
		relatedProductIds: parseCsv(getFormString(formData, "relatedProductIds")),
		relatedProductCategoryIds: parseCsv(
			getFormString(formData, "relatedProductCategoryIds"),
		),
		relatedServiceIds: parseCsv(getFormString(formData, "relatedServiceIds")),
		relatedProjectIds: parseCsv(getFormString(formData, "relatedProjectIds")),
		relatedProjectCategoryIds: parseCsv(
			getFormString(formData, "relatedProjectCategoryIds"),
		),
		relatedBlogPostIds: parseCsv(getFormString(formData, "relatedBlogPostIds")),
		appearance: parseAppearance(formData),
		seo: {
			title: {
				vi: titleVi,
				en: titleEn,
			},
			description: {
				vi: excerptVi,
				en: excerptEn,
			},
			keywords: parseCsv(getFormString(formData, "tags")),
			ogImage: mainImage.url,
		},
		status: isBlogPostStatus(statusValue) ? statusValue : "draft",
		isFeatured: getFormBoolean(formData, "isFeatured"),
		publishedAt: parseDate(getFormString(formData, "publishedAt")),
	};
}

function revalidateBlogPages(input?: BlogPostFormData) {
	revalidateTag(CACHE_TAGS.BLOG_POSTS, "max");
	revalidateTag(CACHE_TAGS.BLOG_CATEGORIES, "max");
	revalidatePath("/admin/blogs");
	revalidatePath("/admin/blogcategories");
	revalidatePath("/vi/blog");
	revalidatePath("/en/blog");
	revalidatePath("/vi", "layout");
	revalidatePath("/en", "layout");

	if (input) {
		revalidatePath(`/vi/blog/${input.slug.vi}`);
		revalidatePath(`/en/blog/${input.slug.en}`);
	}
}

export async function createBlogPostAction(formData: FormData) {
	const input = parseBlogPostFormData(formData);
	await createBlogPost(input);
	revalidateBlogPages(input);
	redirect("/admin/blogs");
}

export async function updateBlogPostAction(formData: FormData) {
	const input = parseBlogPostFormData(formData);
	await updateBlogPost(input);
	revalidateBlogPages(input);
	redirect("/admin/blogs");
}

export async function deleteBlogPostAction(formData: FormData) {
	const blogPostId = getFormString(formData, "blogPostId");

	if (blogPostId) {
		await deleteBlogPost(blogPostId);
	}

	revalidateBlogPages();
	redirect("/admin/blogs");
}

export async function uploadBlogImageAction(formData: FormData): Promise<UploadBlogImageResult> {
	try {
		const file = formData.get("image") as File | null;

		if (!file || file.size === 0) {
			return {
				success: false,
				error: "Vui lòng chọn ảnh",
			};
		}

		const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

		if (!allowedTypes.includes(file.type)) {
			return {
				success: false,
				error: "Chỉ hỗ trợ ảnh JPG, PNG, WEBP hoặc SVG",
			};
		}

		const maxFileSize = 10 * 1024 * 1024;

		if (file.size > maxFileSize) {
			return {
				success: false,
				error: "Ảnh không được vượt quá 10MB",
			};
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const uploadDir = path.join(process.cwd(), "public", "uploads", "blog");

		await fs.mkdir(uploadDir, { recursive: true });

		const ext = file.name.split(".").pop() || "jpg";
		const fileName = `blog-${Date.now()}.${ext}`;
		const filePath = path.join(uploadDir, fileName);

		await fs.writeFile(filePath, buffer);

		return {
			success: true,
			data: `/uploads/blog/${fileName}`,
		};
	} catch (error) {
		console.error("Upload blog image error:", error);

		return {
			success: false,
			error: "Không thể tải ảnh lên. Vui lòng thử lại.",
		};
	}
}
