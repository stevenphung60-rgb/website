import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { BlogContentRenderer } from "src/components/blog/blog-content-renderer";
import { BlogGalleryViewer } from "src/components/blog/blog-gallery-viewer";
import type { Locale } from "src/lib/i18n/config";
import { getProductCategoryById } from "src/server/productcategories";
import { getProductById } from "src/server/products";
import { getProjectCategoryById } from "src/server/projectcategories";
import { getProjectById } from "src/server/projects";
import { getServiceById } from "src/server/services";
import {
	getBlogCategoryById,
	getBlogPostById,
	getBlogPostBySlug,
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

interface RelatedItem {
	label: string;
	href: string;
	description?: string;
}

interface RelatedGroup {
	title: string;
	items: RelatedItem[];
}

const blogText = {
	vi: {
		home: "Trang chủ",
		readMinute: "phút đọc",
		gallery: "Hình ảnh trong bài",
		relatedContent: "Nội dung liên quan",
		relatedProductCategories: "Loại sản phẩm",
		relatedProducts: "Sản phẩm",
		relatedServices: "Dịch vụ",
		relatedProjectCategories: "Loại dự án",
		relatedProjects: "Dự án",
		relatedBlogs: "Blog",
	},
	en: {
		home: "Home",
		readMinute: "min read",
		gallery: "Article gallery",
		relatedContent: "Related content",
		relatedProductCategories: "Product categories",
		relatedProducts: "Products",
		relatedServices: "Services",
		relatedProjectCategories: "Project categories",
		relatedProjects: "Projects",
		relatedBlogs: "Blog",
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

function getDisplayBlogImage(post: BlogPost): BlogImage {
	return post.coverImage?.url
		? post.coverImage
		: getMainBlogImage(post.gallery) || post.coverImage;
}

function isSameImage(firstImage?: BlogImage | null, secondImage?: BlogImage | null) {
	if (!firstImage?.url || !secondImage?.url) return false;

	return firstImage.url === secondImage.url;
}

function createRelatedItem(label: string, href: string, description?: string): RelatedItem | null {
	if (!label || !href) return null;

	return {
		label,
		href,
		description,
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
	const galleryImages = post.gallery.filter(
		(image) => image.url && !isSameImage(image, mainImage),
	);

	const [
		relatedProductCategories,
		relatedProducts,
		relatedServices,
		relatedProjectCategories,
		relatedProjects,
		relatedBlogs,
	] = await Promise.all([
		Promise.all(post.relatedProductCategoryIds.map((id) => getProductCategoryById(id))),
		Promise.all(post.relatedProductIds.map((id) => getProductById(id))),
		Promise.all(post.relatedServiceIds.map((id) => getServiceById(id))),
		Promise.all(post.relatedProjectCategoryIds.map((id) => getProjectCategoryById(id))),
		Promise.all(post.relatedProjectIds.map((id) => getProjectById(id))),
		Promise.all(post.relatedBlogPostIds.map((id) => getBlogPostById(id))),
	]);

	const relatedGroups: RelatedGroup[] = [
		{
			title: text.relatedProductCategories,
			items: relatedProductCategories
				.map((category) =>
					category
						? createRelatedItem(
								localized(category.name, locale),
								`/${locale}/products?category=${category.id}`,
								localized(category.description, locale),
							)
						: null,
				)
				.filter((item): item is RelatedItem => item !== null),
		},
		{
			title: text.relatedProducts,
			items: relatedProducts
				.map((product) =>
					product
						? createRelatedItem(
								localized(product.name, locale),
								`/${locale}/products/${product.id}`,
								product.code,
							)
						: null,
				)
				.filter((item): item is RelatedItem => item !== null),
		},
		{
			title: text.relatedServices,
			items: relatedServices
				.map((service) =>
					service
						? createRelatedItem(
								localized(service.name, locale),
								`/${locale}/services/${service.id}`,
								localized(service.description, locale),
							)
						: null,
				)
				.filter((item): item is RelatedItem => item !== null),
		},
		{
			title: text.relatedProjectCategories,
			items: relatedProjectCategories
				.map((category) =>
					category
						? createRelatedItem(
								localized(category.name, locale),
								`/${locale}/projects?category=${category.id}`,
								localized(category.description, locale),
							)
						: null,
				)
				.filter((item): item is RelatedItem => item !== null),
		},
		{
			title: text.relatedProjects,
			items: relatedProjects
				.map((project) =>
					project
						? createRelatedItem(
								localized(project.name, locale),
								`/${locale}/projects/${project.id}`,
								localized(project.location, locale) || localized(project.year, locale),
							)
						: null,
				)
				.filter((item): item is RelatedItem => item !== null),
		},
		{
			title: text.relatedBlogs,
			items: relatedBlogs
				.map((relatedBlog) =>
					relatedBlog
						? createRelatedItem(
								getLocalizedBlogText(relatedBlog.title, lang),
								`/${locale}/blog/${getLocalizedBlogText(relatedBlog.slug, lang)}`,
								getLocalizedBlogText(relatedBlog.excerpt, lang),
							)
						: null,
				)
				.filter((item): item is RelatedItem => item !== null),
		},
	];

	return (
		<main className="bg-[#FAF7F1] text-[#342312]">
			<article>
				<section className="px-4 pb-7 pt-12 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
					<div className="mx-auto max-w-6xl">
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
									<span>{getLocalizedBlogText(category.name, lang)}</span>
								</>
							) : null}
						</div>

						<div className="max-w-4xl">
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A87E3C]">
								{category ? getLocalizedBlogText(category.name, lang) : "Blog"}
							</p>

							<h1 className="font-heading mt-4 text-[38px] font-extrabold leading-[1.08] tracking-[-0.02em] text-[#342312] sm:text-5xl lg:text-[64px]">
								{title}
							</h1>

							<p className="mt-5 max-w-3xl text-[17px] leading-8 text-[#342312]/72 sm:text-[18px]">
								{excerpt}
							</p>

							<div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[#342312]/55">
								<span>
									{post.publishedAt
										? new Date(post.publishedAt).toLocaleDateString(
												locale === "en" ? "en-US" : "vi-VN",
											)
										: "Blog"}
								</span>

								<span className="size-1 rounded-full bg-[#A87E3C]/55" />

								<span>
									{readTime} {text.readMinute}
								</span>
							</div>
						</div>
					</div>
				</section>

				{mainImage.url ? (
					<section className="px-4 pb-12 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
						<figure className="mx-auto max-w-6xl overflow-hidden rounded-xl border border-[#E7D0AF] bg-white shadow-[0_18px_46px_rgba(52,35,18,0.08)]">
							<div className="relative aspect-[16/8] bg-[#F7F1E6]">
								<Image
									src={mainImage.url}
									alt={mainImage.alt?.[lang] || title}
									fill
									className="object-cover"
									priority
								/>
							</div>

							{mainImage.caption?.[lang] ? (
								<figcaption className="border-t border-[#E7D0AF]/70 px-5 py-3 text-sm italic text-[#342312]/60">
									{mainImage.caption[lang]}
								</figcaption>
							) : null}
						</figure>
					</section>
				) : null}

				<section className="px-4 py-10 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
					<BlogContentRenderer html={contentHtml} appearance={post.appearance} />
				</section>

				<BlogGalleryViewer images={galleryImages} locale={lang} title={text.gallery} />
			</article>

			<RelatedContentGroups title={text.relatedContent} groups={relatedGroups} />
		</main>
	);
}

function RelatedContentGroups({
	title,
	groups,
}: {
	title: string;
	groups: RelatedGroup[];
}) {
	const visibleGroups = groups
		.map((group) => ({
			...group,
			items: group.items.filter((item) => item.label && item.href),
		}))
		.filter((group) => group.items.length > 0);

	if (visibleGroups.length === 0) return null;

	return (
		<section className="px-4 pb-14 pt-8 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
			<div className="mx-auto max-w-6xl border-t border-[#E7D0AF] pt-10">
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A87E3C]">
					Blog
				</p>

				<h2 className="font-heading mt-2 text-2xl font-bold text-[#342312] sm:text-3xl">
					{title}
				</h2>

				<div className="mt-6 space-y-8">
					{visibleGroups.map((group) => (
						<div key={group.title}>
							<h3 className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-[#342312]/68">
								{group.title}
							</h3>

							<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
								{group.items.map((item) => (
									<Link
										key={`${group.title}-${item.href}`}
										href={item.href}
										className="group flex min-h-[104px] flex-col justify-between rounded-xl border border-[#E7D0AF] bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#A87E3C]/65 hover:shadow-md"
									>
										<div>
											<p className="line-clamp-2 text-sm font-bold leading-6 text-[#342312] transition group-hover:text-[#A87E3C]">
												{item.label}
											</p>

											{item.description ? (
												<p className="mt-1 line-clamp-2 text-xs leading-5 text-[#342312]/60">
													{item.description}
												</p>
											) : null}
										</div>

										<div className="mt-3 flex justify-end text-[#A87E3C]">
											<ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
										</div>
									</Link>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
