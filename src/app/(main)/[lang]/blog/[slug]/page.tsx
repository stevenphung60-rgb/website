import { ArrowUpRight, CalendarDays, Clock, FolderOpen } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BlogContentRenderer } from "src/components/blog/blog-content-renderer";
import { BlogDetailScrollToTop } from "src/components/blog/blog-detail-scroll-to-top";
import { BlogGalleryViewer } from "src/components/blog/blog-gallery-viewer";
import { BlogHeroCover } from "src/components/blog/blog-hero-cover";
import {
	BlogRelatedCarousel,
	type BlogRelatedCarouselItem,
} from "src/components/blog/blog-related-carousel";
import type { Locale } from "src/lib/i18n/config";
import { getProductCategoryById } from "src/server/productcategories";
import { getProductById } from "src/server/products";
import { getProjectCategoryById } from "src/server/projectcategories";
import { getProjectById } from "src/server/projects";
import { getServiceById } from "src/server/services";
import {
	getBlogCategoryById,
	getBlogPostBySlug,
	getFeaturedBlogPosts,
	getPublishedBlogPosts,
	type BlogImage,
	type BlogPost,
} from "src/server/blogs";
import {
	getBlogReadingTime,
	getLocalizedBlogText,
	getMainBlogImage,
} from "src/server/blogs/blog-utils";

interface BlogDetailPageProps {
	params: Promise<{ lang: Locale; slug: string }>;
}

interface QuickLinkItem {
	label: string;
	href: string;
	type: string;
}

const blogText = {
	vi: {
		home: "Trang chủ",
		readMinute: "phút đọc",
		gallery: "Hình ảnh trong bài",
		articleInfo: "Thông tin bài viết",
		published: "Ngày đăng",
		readingTime: "Thời gian đọc",
		category: "Danh mục",
		featuredBlog: "Blog nổi bật",
		quickLinks: "Liên kết nhanh",
		relatedArticles: "Nội dung liên quan",
		blogEyebrow: "Blog",
		readArticle: "Đọc bài",
		articles: "bài viết",
		linkTypes: {
			productCategory: "Loại sản phẩm",
			product: "Sản phẩm",
			service: "Dịch vụ",
			projectCategory: "Loại dự án",
			project: "Dự án",
		},
	},
	en: {
		home: "Home",
		readMinute: "min read",
		gallery: "Article gallery",
		articleInfo: "Article info",
		published: "Published",
		readingTime: "Reading time",
		category: "Category",
		featuredBlog: "Featured blog",
		quickLinks: "Quick links",
		relatedArticles: "Related articles",
		blogEyebrow: "Blog",
		readArticle: "Read article",
		articles: "articles",
		linkTypes: {
			productCategory: "Product category",
			product: "Product",
			service: "Service",
			projectCategory: "Project category",
			project: "Project",
		},
	},
};

function localized(value: unknown, locale: Locale): string {
	if (typeof value === "string") return value;

	if (value && typeof value === "object") {
		const record = value as Partial<Record<"vi" | "en", string>>;
		return record[locale] || record.vi || record.en || "";
	}

	return "";
}

function formatDate(value: Date | string | null | undefined, locale: Locale): string {
	if (!value) return "Blog";

	return new Date(value).toLocaleDateString(locale === "en" ? "en-US" : "vi-VN");
}

function getDisplayBlogImage(post: BlogPost): BlogImage {
	return getMainBlogImage(post.gallery) || post.coverImage;
}

function isSameImage(firstImage?: BlogImage | null, secondImage?: BlogImage | null) {
	if (!firstImage?.url || !secondImage?.url) return false;

	return firstImage.url === secondImage.url;
}

function createQuickLink(label: string, href: string, type: string): QuickLinkItem | null {
	if (!label || !href) return null;

	return {
		label,
		href,
		type,
	};
}

function toRelatedCarouselItem({
	post,
	locale,
	categoryName,
	readMinuteLabel,
	readLabel,
}: {
	post: BlogPost;
	locale: Locale;
	categoryName: string;
	readMinuteLabel: string;
	readLabel: string;
}): BlogRelatedCarouselItem {
	const image = getDisplayBlogImage(post);
	const title = getLocalizedBlogText(post.title, locale);
	const excerpt = getLocalizedBlogText(post.excerpt, locale);
	const slug = getLocalizedBlogText(post.slug, locale);
	const readingTime = getBlogReadingTime(post.content[locale] || "");

	return {
		id: post.id,
		href: `/${locale}/blog/${slug}`,
		image: image?.url || "/placeholder.svg",
		category: categoryName || "Blog",
		title,
		excerpt,
		date: formatDate(post.publishedAt, locale),
		readingTime: `${readingTime} ${readMinuteLabel}`,
		readLabel,
	};
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
	const { lang: locale, slug } = await params;
	const lang = locale === "en" ? "en" : "vi";
	const post = await getBlogPostBySlug(slug, lang);

	if (!post) {
		return {
			title: "Blog | Nghiệp Hưng",
		};
	}

	const title = getLocalizedBlogText(post.title, lang);
	const description = getLocalizedBlogText(post.excerpt, lang);
	const mainImage = getDisplayBlogImage(post);

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			images: mainImage.url ? [mainImage.url] : undefined,
		},
	};
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
	const { lang: locale, slug } = await params;
	const lang = locale === "en" ? "en" : "vi";
	const text = blogText[lang];
	const post = await getBlogPostBySlug(slug, lang);

	if (!post) {
		notFound();
	}

	const expectedSlug = getLocalizedBlogText(post.slug, lang);

	if (expectedSlug && slug !== expectedSlug) {
		redirect(`/${locale}/blog/${expectedSlug}`);
	}

	const category = post.categoryId ? await getBlogCategoryById(post.categoryId) : null;
	const title = getLocalizedBlogText(post.title, lang);
	const excerpt = getLocalizedBlogText(post.excerpt, lang);
	const contentHtml = post.content[lang] || "";
	const readTime = getBlogReadingTime(contentHtml);
	const mainImage = getDisplayBlogImage(post);
	const categoryName = category ? getLocalizedBlogText(category.name, lang) : "Blog";
	const galleryImages = post.gallery.filter(
		(image) => image.url && !isSameImage(image, mainImage),
	);

	const [
		relatedProductCategories,
		relatedProducts,
		relatedServices,
		relatedProjectCategories,
		relatedProjects,
		featuredBlogPosts,
		sameCategoryBlogPosts,
	] = await Promise.all([
		Promise.all(post.relatedProductCategoryIds.map((id) => getProductCategoryById(id))),
		Promise.all(post.relatedProductIds.map((id) => getProductById(id))),
		Promise.all(post.relatedServiceIds.map((id) => getServiceById(id))),
		Promise.all(post.relatedProjectCategoryIds.map((id) => getProjectCategoryById(id))),
		Promise.all(post.relatedProjectIds.map((id) => getProjectById(id))),
		getFeaturedBlogPosts(6),
		post.categoryId ? getPublishedBlogPosts(post.categoryId) : Promise.resolve([]),
	]);

	const quickLinks = [
		...relatedProductCategories.map((category) =>
			category
				? createQuickLink(
						localized(category.name, locale),
						`/${locale}/products?category=${category.id}`,
						text.linkTypes.productCategory,
					)
				: null,
		),
		...relatedProducts.map((product) =>
			product
				? createQuickLink(
						localized(product.name, locale),
						`/${locale}/products/${product.id}`,
						text.linkTypes.product,
					)
				: null,
		),
		...relatedServices.map((service) =>
			service
				? createQuickLink(
						localized(service.name, locale),
						`/${locale}/services/${service.id}`,
						text.linkTypes.service,
					)
				: null,
		),
		...relatedProjectCategories.map((category) =>
			category
				? createQuickLink(
						localized(category.name, locale),
						`/${locale}/projects?category=${category.id}`,
						text.linkTypes.projectCategory,
					)
				: null,
		),
		...relatedProjects.map((project) =>
			project
				? createQuickLink(
						localized(project.name, locale),
						`/${locale}/projects/${project.id}`,
						text.linkTypes.project,
					)
				: null,
		),
	].filter((item): item is QuickLinkItem => item !== null);

	const featuredPosts = featuredBlogPosts
		.filter((featuredPost) => featuredPost.id !== post.id)
		.slice(0, 3);
	const relatedArticleItems = sameCategoryBlogPosts
		.filter((relatedPost) => relatedPost.id !== post.id)
		.map((relatedPost) =>
			toRelatedCarouselItem({
				post: relatedPost,
				locale,
				categoryName,
				readMinuteLabel: text.readMinute,
				readLabel: text.readArticle,
			}),
		);

	return (
		<main className="bg-[#FAF7F1] text-[#342312]">
			<BlogDetailScrollToTop />

			<section className="px-4 pb-14 pt-10 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
				<div className="mx-auto max-w-[1500px]">
					<div className="mb-8 text-sm text-[#342312]/58">
						<Link href={`/${locale}`} className="transition hover:text-[#A87E3C]">
							{text.home}
						</Link>

						<span className="mx-2">/</span>

						<Link href={`/${locale}/blog`} className="transition hover:text-[#A87E3C]">
							Blog
						</Link>

						{category ? (
							<>
								<span className="mx-2">/</span>
								<span>{categoryName}</span>
							</>
						) : null}
					</div>

					<div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start xl:gap-14">
						<article className="min-w-0">
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A87E3C]">
								{categoryName}
							</p>

							<h1 className="font-heading mt-4 max-w-5xl text-[40px] font-extrabold leading-[1.08] tracking-[-0.02em] text-[#342312] sm:text-5xl lg:text-[64px]">
								{title}
							</h1>

							<p className="mt-5 max-w-3xl text-[17px] leading-8 text-[#342312]/72 sm:text-[18px]">
								{excerpt}
							</p>

							<div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[#342312]/55">
								<span>{formatDate(post.publishedAt, locale)}</span>
								<span className="size-1 rounded-full bg-[#A87E3C]/55" />
								<span>
									{readTime} {text.readMinute}
								</span>
							</div>

							<BlogHeroCover image={mainImage} locale={lang} title={title} />

							<div className="mt-10 lg:mt-12">
								<BlogContentRenderer html={contentHtml} appearance={post.appearance} />
								<BlogGalleryViewer images={galleryImages} locale={lang} title={text.gallery} />
							</div>
						</article>

						<aside className="space-y-5 lg:pt-12">
							<ArticleInfoCard
								text={text}
								categoryName={categoryName}
								publishedAt={post.publishedAt}
								readTime={`${readTime} ${text.readMinute}`}
								locale={locale}
							/>

							<FeaturedBlogCard
								title={text.featuredBlog}
								posts={featuredPosts}
								locale={locale}
								readMinuteLabel={text.readMinute}
							/>

							<QuickLinksCard title={text.quickLinks} items={quickLinks} />
						</aside>
					</div>
				</div>
			</section>


			<BlogRelatedCarousel
				eyebrow={text.blogEyebrow}
				title={text.relatedArticles}
				items={relatedArticleItems}
				countLabel={`${relatedArticleItems.length} ${text.articles}`}
			/>
		</main>
	);
}

function ArticleInfoCard({
	text,
	categoryName,
	publishedAt,
	readTime,
	locale,
}: {
	text: (typeof blogText)[Locale];
	categoryName: string;
	publishedAt: Date | string | null;
	readTime: string;
	locale: Locale;
}) {
	return (
		<div className="border border-[#E7D0AF] bg-white px-5 py-5 shadow-sm">
			<h2 className="font-heading text-lg font-bold uppercase tracking-[0.08em] text-[#342312]">
				{text.articleInfo}
			</h2>

			<div className="mt-4 space-y-3 text-sm leading-6 text-[#342312]/72">
				<div className="flex gap-2">
					<CalendarDays className="mt-1 size-4 shrink-0 text-[#A87E3C]" />
					<span>
						{text.published}: {formatDate(publishedAt, locale)}
					</span>
				</div>

				<div className="flex gap-2">
					<Clock className="mt-1 size-4 shrink-0 text-[#A87E3C]" />
					<span>
						{text.readingTime}: {readTime}
					</span>
				</div>

				<div className="flex gap-2">
					<FolderOpen className="mt-1 size-4 shrink-0 text-[#A87E3C]" />
					<span>
						{text.category}: {categoryName}
					</span>
				</div>
			</div>
		</div>
	);
}

function FeaturedBlogCard({
	title,
	posts,
	locale,
	readMinuteLabel,
}: {
	title: string;
	posts: BlogPost[];
	locale: Locale;
	readMinuteLabel: string;
}) {
	if (posts.length === 0) return null;

	return (
		<div className="border border-[#E7D0AF] bg-white px-5 py-5 shadow-sm">
			<h2 className="font-heading text-lg font-bold uppercase tracking-[0.08em] text-[#342312]">
				{title}
			</h2>

			<div className="mt-4 divide-y divide-[#E7D0AF]/70">
				{posts.map((post) => {
					const blogTitle = getLocalizedBlogText(post.title, locale);
					const slug = getLocalizedBlogText(post.slug, locale);
					const image = getDisplayBlogImage(post);
					const readTime = getBlogReadingTime(post.content[locale] || "");

					return (
						<Link
							key={post.id}
							href={`/${locale}/blog/${slug}`}
							scroll
							className="group grid grid-cols-[76px_minmax(0,1fr)] gap-3 py-3 first:pt-0 last:pb-0"
						>
							<div className="relative aspect-[4/3] overflow-hidden border border-[#E7D0AF] bg-[#F7F1E6]">
								{image.url ? (
									<Image
										src={image.url}
										alt={blogTitle}
										fill
										sizes="76px"
										className="object-cover"
									/>
								) : null}
							</div>

							<div className="min-w-0">
								<p className="line-clamp-2 text-sm font-bold leading-5 text-[#342312] transition group-hover:text-[#A87E3C]">
									{blogTitle}
								</p>

								<p className="mt-1 text-xs text-[#342312]/55">
									{readTime} {readMinuteLabel}
								</p>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}

function QuickLinksCard({ title, items }: { title: string; items: QuickLinkItem[] }) {
	if (items.length === 0) return null;

	return (
		<div className="border border-[#E7D0AF] bg-white px-5 py-5 shadow-sm">
			<h2 className="font-heading text-lg font-bold uppercase tracking-[0.08em] text-[#342312]">
				{title}
			</h2>

			<div className="mt-4 divide-y divide-[#E7D0AF]/70">
				{items.map((item) => (
					<Link
						key={`${item.type}-${item.href}`}
						href={item.href}
						className="group flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
					>
						<div className="min-w-0">
							<p className="truncate text-sm font-bold uppercase tracking-[0.04em] text-[#342312] transition group-hover:text-[#A87E3C]">
								{item.label}
							</p>

							<p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#A87E3C]">
								{item.type}
							</p>
						</div>

						<ArrowUpRight className="size-4 shrink-0 text-[#A87E3C] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</Link>
				))}
			</div>
		</div>
	);
}
