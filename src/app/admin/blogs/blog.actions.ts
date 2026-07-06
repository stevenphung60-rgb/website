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
	type BlogContentBlock,
	type BlogFontSelection,
	type BlogImage,
	type BlogPostFormData,
	type BlogPostStatus,
} from "src/server/blogs";
import { slugify } from "src/server/blogs/blog-utils";

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

function normalizeImages(images: BlogImage[]): BlogImage[] {
	return images
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
			order: index,
		}));
}

function parseBlogPostFormData(formData: FormData): BlogPostFormData {
	const titleVi = getFormString(formData, "titleVi");
	const titleEn = getFormString(formData, "titleEn") || titleVi;
	const slugVi = getFormString(formData, "slugVi") || slugify(titleVi);
	const slugEn = getFormString(formData, "slugEn") || slugify(titleEn || titleVi);
	const statusValue = getFormString(formData, "status");
	const coverImageUrl = getFormString(formData, "coverImageUrl");
	const gallery = normalizeImages(parseJsonArray<BlogImage>(getFormString(formData, "gallery"), []));
	const contentVi = parseJsonArray<BlogContentBlock>(getFormString(formData, "contentVi"), []);
	const contentEn = parseJsonArray<BlogContentBlock>(getFormString(formData, "contentEn"), contentVi);

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
			vi: slugVi,
			en: slugEn,
		},
		excerpt: {
			vi: getFormString(formData, "excerptVi"),
			en: getFormString(formData, "excerptEn") || getFormString(formData, "excerptVi"),
		},
		coverImage: {
			url: coverImageUrl,
			alt: {
				vi: getFormString(formData, "coverImageAltVi") || titleVi,
				en: getFormString(formData, "coverImageAltEn") || titleEn,
			},
			caption: {
				vi: getFormString(formData, "coverImageCaptionVi"),
				en: getFormString(formData, "coverImageCaptionEn"),
			},
			order: 0,
		},
		categoryId: getFormString(formData, "categoryId"),
		tags: parseCsv(getFormString(formData, "tags")),
		content: {
			vi: contentVi,
			en: contentEn,
		},
		gallery,
		relatedProductIds: parseCsv(getFormString(formData, "relatedProductIds")),
		relatedServiceIds: parseCsv(getFormString(formData, "relatedServiceIds")),
		relatedProjectIds: parseCsv(getFormString(formData, "relatedProjectIds")),
		relatedBlogPostIds: parseCsv(getFormString(formData, "relatedBlogPostIds")),
		appearance: parseAppearance(formData),
		seo: {
			title: {
				vi: getFormString(formData, "seoTitleVi") || titleVi,
				en: getFormString(formData, "seoTitleEn") || titleEn,
			},
			description: {
				vi: getFormString(formData, "seoDescriptionVi") || getFormString(formData, "excerptVi"),
				en: getFormString(formData, "seoDescriptionEn") || getFormString(formData, "excerptEn") || getFormString(formData, "excerptVi"),
			},
			keywords: parseCsv(getFormString(formData, "seoKeywords")),
			ogImage: getFormString(formData, "seoOgImage") || coverImageUrl,
		},
		status: isBlogPostStatus(statusValue) ? statusValue : "draft",
		isFeatured: getFormBoolean(formData, "isFeatured"),
		publishedAt: parseDate(getFormString(formData, "publishedAt")),
	};
}

function revalidateBlogPages() {
	revalidateTag(CACHE_TAGS.BLOG_POSTS, "max");
	revalidateTag(CACHE_TAGS.BLOG_CATEGORIES, "max");
	revalidatePath("/admin/blogs");
	revalidatePath("/admin/blogcategories");
	revalidatePath("/vi/blog");
	revalidatePath("/en/blog");
	revalidatePath("/vi", "layout");
	revalidatePath("/en", "layout");
}

export async function createBlogPostAction(formData: FormData) {
	const input = parseBlogPostFormData(formData);
	await createBlogPost(input);
	revalidateBlogPages();
	redirect("/admin/blogs");
}

export async function updateBlogPostAction(formData: FormData) {
	const input = parseBlogPostFormData(formData);
	await updateBlogPost(input);
	revalidateBlogPages();
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
