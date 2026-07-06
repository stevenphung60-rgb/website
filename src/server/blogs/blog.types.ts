import type { SiteFontId } from "src/lib/font-presets";

export interface LocalizedText {
	en: string;
	vi: string;
}

export interface BlogImage {
	url: string;
	alt: LocalizedText;
	caption?: LocalizedText;
	order: number;
}

export type BlogPostStatus = "draft" | "published" | "hidden";
export type BlogContentAlign = "left" | "center";
export type BlogTextSize = "small" | "standard" | "large";
export type BlogHeadingSize = "standard" | "large" | "xlarge";
export type BlogListStyle = "bullet" | "numbered";
export type BlogBodySize = "compact" | "standard" | "comfortable" | "large";
export type BlogLineHeight = "compact" | "standard" | "relaxed";
export type BlogContentWidth = "narrow" | "standard" | "wide";
export type BlogFontSelection = SiteFontId | "site";

interface BlogBlockBase {
	id: string;
}

export interface BlogParagraphBlock extends BlogBlockBase {
	type: "paragraph";
	text: string;
	size: BlogTextSize;
	align: BlogContentAlign;
}

export interface BlogHeadingBlock extends BlogBlockBase {
	type: "heading";
	level: 2 | 3;
	text: string;
	size: BlogHeadingSize;
	align: BlogContentAlign;
}

export interface BlogQuoteBlock extends BlogBlockBase {
	type: "quote";
	text: string;
}

export interface BlogListBlock extends BlogBlockBase {
	type: "list";
	style: BlogListStyle;
	items: string[];
}

export interface BlogImageBlock extends BlogBlockBase {
	type: "image";
	image: BlogImage;
}

export interface BlogGalleryBlock extends BlogBlockBase {
	type: "gallery";
	images: BlogImage[];
	columns: 2 | 3;
}

export interface BlogTableBlock extends BlogBlockBase {
	type: "table";
	rows: string[][];
}

export type BlogContentBlock =
	| BlogParagraphBlock
	| BlogHeadingBlock
	| BlogQuoteBlock
	| BlogListBlock
	| BlogImageBlock
	| BlogGalleryBlock
	| BlogTableBlock;

export interface BlogAppearanceSettings {
	headingFontId: BlogFontSelection;
	bodyFontId: BlogFontSelection;
	bodySize: BlogBodySize;
	lineHeight: BlogLineHeight;
	contentWidth: BlogContentWidth;
}

export interface BlogSeoSettings {
	title: LocalizedText;
	description: LocalizedText;
	keywords: string[];
	ogImage: string;
}

export interface BlogCategory {
	id: string;
	name: LocalizedText;
	slug: LocalizedText;
	description: LocalizedText;
	createdAt: Date;
	updatedAt: Date;
}

export interface BlogCategoryDocument extends BlogCategory {
	_id?: unknown;
}

export interface BlogPost {
	id: string;
	slug: LocalizedText;
	title: LocalizedText;
	excerpt: LocalizedText;
	coverImage: BlogImage;
	categoryId: string;
	tags: string[];
	content: {
		vi: BlogContentBlock[];
		en: BlogContentBlock[];
	};
	gallery: BlogImage[];
	relatedProductIds: string[];
	relatedServiceIds: string[];
	relatedProjectIds: string[];
	relatedBlogPostIds: string[];
	appearance: BlogAppearanceSettings;
	seo: BlogSeoSettings;
	status: BlogPostStatus;
	isFeatured: boolean;
	publishedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface BlogPostDocument extends BlogPost {
	_id?: unknown;
}

export interface BlogPostFormData {
	blogPostId?: string;
	slug: LocalizedText;
	title: LocalizedText;
	excerpt: LocalizedText;
	coverImage: BlogImage;
	categoryId: string;
	tags: string[];
	content: {
		vi: BlogContentBlock[];
		en: BlogContentBlock[];
	};
	gallery: BlogImage[];
	relatedProductIds: string[];
	relatedServiceIds: string[];
	relatedProjectIds: string[];
	relatedBlogPostIds: string[];
	appearance: BlogAppearanceSettings;
	seo: BlogSeoSettings;
	status: BlogPostStatus;
	isFeatured: boolean;
	publishedAt: Date | null;
}

export const BLOG_POST_STATUSES: BlogPostStatus[] = [
	"draft",
	"published",
	"hidden",
];

export const DEFAULT_BLOG_APPEARANCE: BlogAppearanceSettings = {
	headingFontId: "site",
	bodyFontId: "site",
	bodySize: "standard",
	lineHeight: "relaxed",
	contentWidth: "standard",
};

export const EMPTY_LOCALIZED_TEXT: LocalizedText = {
	en: "",
	vi: "",
};

export const EMPTY_BLOG_IMAGE: BlogImage = {
	url: "",
	alt: EMPTY_LOCALIZED_TEXT,
	caption: EMPTY_LOCALIZED_TEXT,
	order: 0,
};
