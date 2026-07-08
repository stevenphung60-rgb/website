import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { BlogMobileCategorySelect } from "src/components/blog/blog-mobile-category-select";
import type { Locale } from "src/lib/i18n/config";
import {
	getBlogListPage,
	type BlogCategoryFilterItem,
	type BlogTagFilterItem,
	type BlogPost,
} from "src/server/blogs";
import {
	getBlogReadingTime,
	getLocalizedBlogText,
	getMainBlogImage,
} from "src/server/blogs/blog-utils";

export const metadata: Metadata = {
	title: "Blog | Nghiệp Hưng",
	description: "Blog của Nghiệp Hưng.",
};

interface BlogListPageProps {
	params: Promise<{ lang: Locale }>;
	searchParams?: Promise<{
		category?: string | string[];
		tag?: string | string[];
		page?: string | string[];
	}>;
}

const blogText = {
	vi: {
		blog: "Blog",
		latest: "Blog mới nhất",
		list: "Danh sách blog",
		categories: "Danh mục blog",
		featured: "Blog nổi bật",
		tags: "Tags",
		all: "Tất cả",
		empty: "Chưa có blog phù hợp.",
		readMinute: "phút đọc",
		readBlog: "Đọc blog",
		page: "Trang",
	},
	en: {
		blog: "Blog",
		latest: "Latest blog",
		list: "Blog list",
		categories: "Blog categories",
		featured: "Featured blog",
		tags: "Tags",
		all: "All",
		empty: "No matching blogs.",
		readMinute: "min read",
		readBlog: "Read blog",
		page: "Page",
	},
};

function getSingleSearchParam(value?: string | string[]): string {
	return Array.isArray(value) ? value[0] || "" : value || "";
}

function parsePage(value?: string | string[]): number {
	const page = Number(getSingleSearchParam(value));
	return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

function getBlogHref(locale: Locale, options: { category?: string; tag?: string; page?: number }) {
	const params = new URLSearchParams();

	if (options.category) params.set("category", options.category);
	if (options.tag) params.set("tag", options.tag);
	if (options.page && options.page > 1) params.set("page", String(options.page));

	const query = params.toString();
	return `/${locale}/blog${query ? `?${query}` : ""}`;
}

function getBlogImage(post: BlogPost) {
	return post.coverImage?.url ? post.coverImage : getMainBlogImage(post.gallery) || post.coverImage;
}

export default async function BlogListPage({ params, searchParams }: BlogListPageProps) {
	const { lang: locale } = await params;
	const resolvedSearchParams = await searchParams;
	const lang = locale === "en" ? "en" : "vi";
	const text = blogText[lang];
	const selectedCategoryId = getSingleSearchParam(resolvedSearchParams?.category);
	const selectedTag = getSingleSearchParam(resolvedSearchParams?.tag);
	const currentPage = parsePage(resolvedSearchParams?.page);

	const blogPage = await getBlogListPage({
		categoryId: selectedCategoryId || null,
		tag: selectedTag || null,
		page: currentPage,
	});

	const activeFilterLabel = blogPage.selectedCategory
		? getLocalizedBlogText(blogPage.selectedCategory.name, lang)
		: blogPage.selectedTag || text.all;

	return (
		<main className="bg-[#FAF7F1] text-[#342312]">
			<style>{`
				@keyframes blogListFadeUp {
					from { opacity: 0; transform: translateY(18px); }
					to { opacity: 1; transform: translateY(0); }
				}
				.blog-list-reveal {
					opacity: 0;
					animation: blogListFadeUp 0.72s ease forwards;
				}
			`}</style>

			<section className="blog-list-reveal border-b border-[#E7D0AF] px-4 pb-10 pt-14 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
				<div className="mx-auto max-w-[1480px]">
					<div className="text-sm text-[#342312]/58">
						<Link href={`/${locale}`} className="transition hover:text-[#A87E3C]">
							Home
						</Link>
						<span className="mx-2">/</span>
						<span>{text.blog}</span>
					</div>

					<p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-[#A87E3C]">
						{text.blog}
					</p>
					<h1 className="font-heading mt-3 text-[58px] font-black uppercase leading-none tracking-[-0.04em] text-[#342312] sm:text-[76px] lg:text-[96px]">
						{text.blog}
					</h1>
				</div>
			</section>

			<section className="px-4 py-10 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
				<div className="mx-auto max-w-[1480px]">
					<BlogMobileCategorySelect
						locale={locale}
						categories={blogPage.categories}
						selectedCategoryId={selectedCategoryId}
						allLabel={text.all}
						label={text.categories}
					/>

					<div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
						<div className="min-w-0 space-y-12">
							{blogPage.latestBlog ? (
								<section className="blog-list-reveal" style={{ animationDelay: "120ms" }}>
									<div className="mb-5 flex items-center justify-between border-b border-[#E7D0AF] pb-3">
										<p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A87E3C]">
											{text.latest}
										</p>
										<p className="hidden text-sm text-[#342312]/55 sm:block">{activeFilterLabel}</p>
									</div>

									<LatestBlogCard post={blogPage.latestBlog} locale={lang} readMinuteLabel={text.readMinute} readBlogLabel={text.readBlog} />
								</section>
							) : null}

							<section className="blog-list-reveal" style={{ animationDelay: "220ms" }}>
								<div className="mb-5 flex flex-col gap-2 border-b border-[#E7D0AF] pb-3 sm:flex-row sm:items-end sm:justify-between">
									<div>
										<p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A87E3C]">
											{text.blog}
										</p>
										<h2 className="font-heading mt-2 text-3xl font-bold text-[#342312]">
											{text.list}
										</h2>
									</div>
									<p className="text-sm text-[#342312]/55">
										{text.page} {blogPage.pagination.currentPage} / {blogPage.pagination.totalPages}
									</p>
								</div>

								{blogPage.blogs.length > 0 ? (
									<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
										{blogPage.blogs.map((post, index) => (
											<BlogCard
												key={post.id}
												post={post}
												locale={lang}
												readMinuteLabel={text.readMinute}
												readBlogLabel={text.readBlog}
												animationDelay={`${300 + index * 70}ms`}
											/>
										))}
									</div>
								) : (
									<div className="border border-[#E7D0AF] bg-white px-5 py-12 text-center text-sm text-[#342312]/65">
										{text.empty}
									</div>
								)}

								<BlogPagination
									locale={locale}
									category={selectedCategoryId}
									tag={selectedTag}
									currentPage={blogPage.pagination.currentPage}
									totalPages={blogPage.pagination.totalPages}
								/>
							</section>
						</div>

						<aside className="hidden space-y-5 lg:block">
							<BlogCategorySidebar
								locale={locale}
								categories={blogPage.categories}
								selectedCategoryId={selectedCategoryId}
								allLabel={text.all}
								title={text.categories}
							/>

							<FeaturedBlogSidebar
								locale={lang}
								blogs={blogPage.featuredBlogs}
								title={text.featured}
								readMinuteLabel={text.readMinute}
							/>

							<BlogTagSidebar locale={locale} tags={blogPage.tags} selectedTag={selectedTag} title={text.tags} />
						</aside>
					</div>
				</div>
			</section>
		</main>
	);
}

function LatestBlogCard({
	post,
	locale,
	readMinuteLabel,
	readBlogLabel,
}: {
	post: BlogPost;
	locale: "vi" | "en";
	readMinuteLabel: string;
	readBlogLabel: string;
}) {
	const title = getLocalizedBlogText(post.title, locale);
	const excerpt = getLocalizedBlogText(post.excerpt, locale);
	const slug = getLocalizedBlogText(post.slug, locale);
	const mainImage = getBlogImage(post);
	const readTime = getBlogReadingTime(post.content[locale] || "");

	return (
		<Link href={`/${locale}/blog/${slug}`} className="group grid overflow-hidden border border-[#E7D0AF] bg-white shadow-sm transition hover:border-[#A87E3C]/55 lg:grid-cols-[1.05fr_0.95fr]">
			<div className="relative min-h-[320px] bg-[#F7F1E6] sm:min-h-[420px] lg:min-h-[500px]">
				{mainImage.url ? (
					<Image
						src={mainImage.url}
						alt={mainImage.alt[locale] || title}
						fill
						priority
						sizes="(max-width: 1024px) 100vw, 55vw"
						className="object-cover"
					/>
				) : null}
			</div>

			<div className="flex min-h-[360px] flex-col justify-center p-6 sm:p-9 lg:p-12">
				<p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A87E3C]">{post.tags[0] || "Blog"}</p>
				<h2 className="font-heading mt-5 text-[34px] font-black uppercase leading-[1.02] tracking-[-0.02em] text-[#342312] sm:text-[46px] lg:text-[56px]">
					{title}
				</h2>
				<p className="mt-5 line-clamp-4 text-[16px] leading-8 text-[#342312]/68 sm:text-[17px]">
					{excerpt}
				</p>
				<div className="mt-8 border-t border-[#E7D0AF] pt-5">
					<div className="flex items-center justify-between gap-4 text-sm text-[#342312]/58">
						<span>{readTime} {readMinuteLabel}</span>
						<span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#A87E3C]">
							{readBlogLabel}
							<ArrowRight className="size-4 transition group-hover:translate-x-1" />
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
}

function BlogCard({
	post,
	locale,
	readMinuteLabel,
	readBlogLabel,
	animationDelay,
}: {
	post: BlogPost;
	locale: "vi" | "en";
	readMinuteLabel: string;
	readBlogLabel: string;
	animationDelay: string;
}) {
	const title = getLocalizedBlogText(post.title, locale);
	const excerpt = getLocalizedBlogText(post.excerpt, locale);
	const slug = getLocalizedBlogText(post.slug, locale);
	const mainImage = getBlogImage(post);
	const readTime = getBlogReadingTime(post.content[locale] || "");

	return (
		<Link
			href={`/${locale}/blog/${slug}`}
			className="blog-list-reveal group flex h-full flex-col overflow-hidden border border-[#E7D0AF] bg-white shadow-sm transition hover:border-[#A87E3C]/55"
			style={{ animationDelay }}
		>
			<div className="relative aspect-[16/10] bg-[#F7F1E6]">
				{mainImage.url ? (
					<Image
						src={mainImage.url}
						alt={mainImage.alt[locale] || title}
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
						className="object-cover"
					/>
				) : null}
			</div>

			<div className="flex flex-1 flex-col p-5">
				<p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A87E3C]">{post.tags[0] || "Blog"}</p>
				<h3 className="font-heading mt-3 line-clamp-2 text-2xl font-bold leading-tight text-[#342312] transition group-hover:text-[#A87E3C]">
					{title}
				</h3>
				<p className="mt-3 line-clamp-3 text-sm leading-7 text-[#342312]/65">{excerpt}</p>
				<div className="mt-auto flex items-center justify-between gap-4 pt-6 text-xs text-[#342312]/55">
					<span>{readTime} {readMinuteLabel}</span>
					<span className="inline-flex items-center gap-1 font-bold uppercase tracking-[0.12em] text-[#A87E3C]">
						{readBlogLabel}
						<ArrowRight className="size-3.5" />
					</span>
				</div>
			</div>
		</Link>
	);
}

function BlogCategorySidebar({
	locale,
	categories,
	selectedCategoryId,
	allLabel,
	title,
}: {
	locale: Locale;
	categories: BlogCategoryFilterItem[];
	selectedCategoryId: string;
	allLabel: string;
	title: string;
}) {
	const lang = locale === "en" ? "en" : "vi";
	const totalCount = categories.reduce((sum, category) => sum + category.count, 0);

	return (
		<section className="border border-[#E7D0AF] bg-white p-6 shadow-sm">
			<h2 className="font-heading text-xl font-bold text-[#342312]">{title}</h2>
			<div className="mt-5 space-y-1">
				<SidebarFilterLink href={`/${locale}/blog`} label={allLabel} count={totalCount} active={!selectedCategoryId} />
				{categories.map((category) => (
					<SidebarFilterLink
						key={category.id}
						href={getBlogHref(locale, { category: category.id })}
						label={getLocalizedBlogText(category.name, lang)}
						count={category.count}
						active={selectedCategoryId === category.id}
					/>
				))}
			</div>
		</section>
	);
}

function FeaturedBlogSidebar({
	locale,
	blogs,
	title,
	readMinuteLabel,
}: {
	locale: "vi" | "en";
	blogs: BlogPost[];
	title: string;
	readMinuteLabel: string;
}) {
	if (blogs.length === 0) return null;

	return (
		<section className="border border-[#E7D0AF] bg-white p-6 shadow-sm">
			<h2 className="font-heading text-xl font-bold text-[#342312]">{title}</h2>
			<div className="mt-5 divide-y divide-[#E7D0AF]">
				{blogs.slice(0, 4).map((blog) => {
					const title = getLocalizedBlogText(blog.title, locale);
					const slug = getLocalizedBlogText(blog.slug, locale);
					const mainImage = getBlogImage(blog);
					const readTime = getBlogReadingTime(blog.content[locale] || "");

					return (
						<Link key={blog.id} href={`/${locale}/blog/${slug}`} className="group grid grid-cols-[72px_minmax(0,1fr)] gap-3 py-3 first:pt-0 last:pb-0">
							<div className="relative aspect-square border border-[#E7D0AF] bg-[#F7F1E6]">
								{mainImage.url ? <Image src={mainImage.url} alt={mainImage.alt[locale] || title} fill sizes="72px" className="object-cover" /> : null}
							</div>
							<div className="min-w-0">
								<p className="line-clamp-2 text-sm font-bold leading-5 text-[#342312] transition group-hover:text-[#A87E3C]">{title}</p>
								<p className="mt-1 text-xs text-[#342312]/55">{readTime} {readMinuteLabel}</p>
							</div>
						</Link>
					);
				})}
			</div>
		</section>
	);
}

function BlogTagSidebar({
	locale,
	tags,
	selectedTag,
	title,
}: {
	locale: Locale;
	tags: BlogTagFilterItem[];
	selectedTag: string;
	title: string;
}) {
	if (tags.length === 0) return null;

	return (
		<section className="border border-[#E7D0AF] bg-white p-6 shadow-sm">
			<h2 className="font-heading text-xl font-bold text-[#342312]">{title}</h2>
			<div className="mt-5 flex flex-wrap gap-2">
				{tags.map((tag) => (
					<Link
						key={tag.name}
						href={getBlogHref(locale, { tag: tag.name })}
						className={[
							"rounded-full border px-3 py-1.5 text-xs font-semibold transition",
							selectedTag === tag.name
								? "border-[#342312] bg-[#342312] text-[#E7D0AF]"
								: "border-[#E7D0AF] bg-[#FAF7F1] text-[#342312] hover:border-[#A87E3C]",
						].join(" ")}
					>
						{tag.name}
					</Link>
				))}
			</div>
		</section>
	);
}

function SidebarFilterLink({
	href,
	label,
	count,
	active,
}: {
	href: string;
	label: string;
	count: number;
	active: boolean;
}) {
	return (
		<Link
			href={href}
			className={[
				"flex items-center justify-between gap-4 px-3 py-3 text-sm font-semibold transition",
				active ? "bg-[#342312] text-[#E7D0AF]" : "text-[#342312]/78 hover:bg-[#FAF7F1] hover:text-[#342312]",
			].join(" ")}
		>
			<span className="line-clamp-1">{label}</span>
			<span className={active ? "text-[#E7D0AF]/80" : "text-[#342312]/45"}>{count}</span>
		</Link>
	);
}

function BlogPagination({
	locale,
	category,
	tag,
	currentPage,
	totalPages,
}: {
	locale: Locale;
	category: string;
	tag: string;
	currentPage: number;
	totalPages: number;
}) {
	if (totalPages <= 1) return null;

	const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
	const previousPage = Math.max(currentPage - 1, 1);
	const nextPage = Math.min(currentPage + 1, totalPages);

	return (
		<nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Blog pagination">
			<PaginationCircle href={getBlogHref(locale, { category, tag, page: previousPage })} disabled={currentPage === 1}>
				<ChevronLeft className="size-4" />
			</PaginationCircle>

			{pages.map((page) => (
				<PaginationCircle key={page} href={getBlogHref(locale, { category, tag, page })} active={page === currentPage}>
					{page}
				</PaginationCircle>
			))}

			<PaginationCircle href={getBlogHref(locale, { category, tag, page: nextPage })} disabled={currentPage === totalPages}>
				<ChevronRight className="size-4" />
			</PaginationCircle>
		</nav>
	);
}

function PaginationCircle({
	href,
	children,
	active,
	disabled,
}: {
	href: string;
	children: ReactNode;
	active?: boolean;
	disabled?: boolean;
}) {
	if (disabled) {
		return (
			<span className="flex size-10 items-center justify-center rounded-full border border-[#E7D0AF] bg-white text-sm font-semibold text-[#342312]/30">
				{children}
			</span>
		);
	}

	return (
		<Link
			href={href}
			className={[
				"flex size-10 items-center justify-center rounded-full border text-sm font-semibold transition",
				active
					? "border-[#342312] bg-[#342312] text-[#E7D0AF]"
					: "border-[#E7D0AF] bg-white text-[#342312] hover:border-[#A87E3C] hover:text-[#A87E3C]",
			].join(" ")}
		>
			{children}
		</Link>
	);
}
