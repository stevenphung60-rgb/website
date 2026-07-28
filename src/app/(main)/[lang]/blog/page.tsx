import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BlogMobileCategorySelect } from "src/components/blog/blog-mobile-category-select";
import { MobilePageIndicator } from "src/components/mobile-page-indicator";
import type { Locale } from "src/lib/i18n/config";
import {
	type BlogCategorySummary,
	type BlogPost,
	type BlogTagSummary,
	getBlogListPageData,
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
		page?: string | string[];
		tag?: string | string[];
	}>;
}

type BlogLocale = "vi" | "en";

type BlogCategoryMap = Map<string, BlogCategorySummary["category"]>;

const blogText = {
	vi: {
		all: "Tất cả",
		blogCount: "blog",
		breadcrumbHome: "Trang chủ",
		categoryLabel: "Danh mục blog",
		empty: "Chưa có blog phù hợp.",
		featured: "Blog nổi bật",
		latest: "Blog mới nhất",
		list: "Danh sách blog",
		mobileCategoryLabel: "Chọn danh mục blog",
		readBlog: "Đọc blog",
		readMinute: "phút đọc",
		tags: "Tags",
	},
	en: {
		all: "All",
		blogCount: "blog",
		breadcrumbHome: "Home",
		categoryLabel: "Blog categories",
		empty: "No matching blog.",
		featured: "Featured blog",
		latest: "Latest blog",
		list: "Blog list",
		mobileCategoryLabel: "Choose blog category",
		readBlog: "Read blog",
		readMinute: "min read",
		tags: "Tags",
	},
};

function getSearchParam(value: string | string[] | undefined): string | null {
	if (Array.isArray(value)) return value[0] || null;
	return value || null;
}

function getPageParam(value: string | string[] | undefined): number {
	const rawValue = getSearchParam(value);
	const page = rawValue ? Number.parseInt(rawValue, 10) : 1;
	return Number.isFinite(page) && page > 0 ? page : 1;
}

function createBlogHref(
	locale: Locale,
	input: {
		categoryId?: string | null;
		page?: number;
		tag?: string | null;
	} = {},
) {
	const params = new URLSearchParams();

	if (input.categoryId) params.set("category", input.categoryId);
	if (input.tag) params.set("tag", input.tag);
	if (input.page && input.page > 1) params.set("page", String(input.page));

	const queryString = params.toString();
	return `/${locale}/blog${queryString ? `?${queryString}` : ""}`;
}

function formatDate(date: Date | null | undefined, locale: Locale): string {
	if (!date) return "";

	return new Date(date).toLocaleDateString(locale === "en" ? "en-US" : "vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
}

function getBlogCardImage(post: BlogPost) {
	return post.coverImage?.url ? post.coverImage : getMainBlogImage(post.gallery) || post.coverImage;
}

function createCategoryMap(categories: BlogCategorySummary[]): BlogCategoryMap {
	return new Map(categories.map(({ category }) => [category.id, category]));
}

function getCategoryName(categoryMap: BlogCategoryMap, categoryId: string, locale: BlogLocale) {
	const category = categoryMap.get(categoryId);
	return category ? getLocalizedBlogText(category.name, locale) : "Blog";
}

export default async function BlogListPage({ params, searchParams }: BlogListPageProps) {
	const { lang: locale } = await params;
	const resolvedSearchParams = await searchParams;
	const lang = locale === "en" ? "en" : "vi";
	const text = blogText[lang];
	const selectedCategoryId = getSearchParam(resolvedSearchParams?.category);
	const selectedTag = getSearchParam(resolvedSearchParams?.tag);
	const page = getPageParam(resolvedSearchParams?.page);
	const blogData = await getBlogListPageData({
		categoryId: selectedCategoryId,
		page,
		tag: selectedTag,
	});
	const categoryMap = createCategoryMap(blogData.categories);

	return (
		<main className="bg-[#FAF7F1] text-[#342312]">
			<style>{`
				@keyframes blogRevealUp {
					from { opacity: 0; transform: translateY(20px); }
					to { opacity: 1; transform: translateY(0); }
				}

				.blog-reveal {
					opacity: 0;
					animation: blogRevealUp 700ms ease forwards;
				}
			`}</style>

			<section className="px-4 pb-16 pt-10 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
				<div className="mx-auto max-w-[1560px]">
					<nav className="blog-reveal mb-7 text-sm text-[#342312]/55">
						<Link href={`/${locale}`} className="transition hover:text-[#A87E3C]">
							{text.breadcrumbHome}
						</Link>
						<span className="mx-2 text-[#A87E3C]/55">/</span>
						<span>Blog</span>
					</nav>

					<BlogMobileCategorySelect
						allLabel={text.all}
						categories={blogData.categories}
						label={text.mobileCategoryLabel}
						locale={locale}
						selectedCategoryId={blogData.selectedCategoryId}
						selectedTag={blogData.selectedTag}
					/>

					<div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
						<div className="min-w-0 space-y-14">
							<section className="blog-reveal" style={{ animationDelay: "80ms" }}>
								<SectionHeading
									count={`${blogData.filteredBlogCount} ${text.blogCount}`}
									title={text.latest}
								/>

								{blogData.latestPost ? (
									<LatestBlogCard
										categoryMap={categoryMap}
										locale={locale}
										post={blogData.latestPost}
										readBlogLabel={text.readBlog}
										readMinuteLabel={text.readMinute}
									/>
								) : (
									<EmptyBlogState>{text.empty}</EmptyBlogState>
								)}
							</section>

							{/* biome-ignore lint/correctness/useUniqueElementIds: This page renders one stable anchor for pagination. */}
							<section
								id="blog-list"
								className="blog-reveal scroll-mt-28 sm:scroll-mt-32"
								style={{ animationDelay: "180ms" }}
							>
								<SectionHeading
									count={`${blogData.listBlogCount} ${text.blogCount}`}
									title={text.list}
								/>

								<div data-blog-list-layout="mobile" className="lg:hidden">
									<MobilePageIndicator
										className="mb-4"
										currentPage={blogData.mobileCurrentPage}
										locale={locale}
										totalPages={blogData.mobileTotalPages}
									/>

									{blogData.mobilePosts.length > 0 ? (
										<div className="grid grid-cols-2 gap-3 md:gap-6">
											{blogData.mobilePosts.map((post, index) => (
												<BlogCard
													key={post.id}
													categoryMap={categoryMap}
													index={index}
													locale={locale}
													post={post}
													readBlogLabel={text.readBlog}
													readMinuteLabel={text.readMinute}
												/>
											))}
										</div>
									) : (
										<EmptyBlogState>{text.empty}</EmptyBlogState>
									)}

									<BlogPagination
										currentPage={blogData.mobileCurrentPage}
										locale={locale}
										selectedCategoryId={blogData.selectedCategoryId}
										selectedTag={blogData.selectedTag}
										totalPages={blogData.mobileTotalPages}
									/>
								</div>

								<div data-blog-list-layout="desktop" className="hidden lg:block">
									{blogData.posts.length > 0 ? (
										<div className="grid grid-cols-2 gap-6 xl:grid-cols-3">
											{blogData.posts.map((post, index) => (
												<BlogCard
													key={post.id}
													categoryMap={categoryMap}
													index={index}
													locale={locale}
													post={post}
													readBlogLabel={text.readBlog}
													readMinuteLabel={text.readMinute}
												/>
											))}
										</div>
									) : (
										<EmptyBlogState>{text.empty}</EmptyBlogState>
									)}

									<BlogPagination
										currentPage={blogData.currentPage}
										locale={locale}
										selectedCategoryId={blogData.selectedCategoryId}
										selectedTag={blogData.selectedTag}
										totalPages={blogData.totalPages}
									/>
								</div>
							</section>
						</div>

						<aside className="hidden lg:block lg:pt-[52px]">
							<div className="space-y-6">
								<CategorySidebar
									allLabel={text.all}
									categories={blogData.categories}
									locale={locale}
									selectedCategoryId={blogData.selectedCategoryId}
									selectedTag={blogData.selectedTag}
									title={text.categoryLabel}
									totalCount={blogData.totalBlogCount}
								/>

								<FeaturedSidebar
									categoryMap={categoryMap}
									locale={locale}
									posts={blogData.featuredPosts}
									readMinuteLabel={text.readMinute}
									title={text.featured}
								/>

								<TagSidebar
									locale={locale}
									selectedCategoryId={blogData.selectedCategoryId}
									selectedTag={blogData.selectedTag}
									tags={blogData.tags}
									title={text.tags}
								/>
							</div>
						</aside>
					</div>
				</div>
			</section>
		</main>
	);
}

function SectionHeading({ count, title }: { count?: string; title: string }) {
	return (
		<div className="mb-5 flex items-end justify-between gap-4 border-b border-[#E7D0AF] pb-3">
			<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A87E3C]">
				{title}
			</p>
			{count ? <p className="shrink-0 text-sm text-[#342312]/55">{count}</p> : null}
		</div>
	);
}

function LatestBlogCard({
	categoryMap,
	locale,
	post,
	readBlogLabel,
	readMinuteLabel,
}: {
	categoryMap: BlogCategoryMap;
	locale: Locale;
	post: BlogPost;
	readBlogLabel: string;
	readMinuteLabel: string;
}) {
	const lang = locale === "en" ? "en" : "vi";
	const image = getBlogCardImage(post);
	const title = getLocalizedBlogText(post.title, lang);
	const excerpt = getLocalizedBlogText(post.excerpt, lang);
	const slug = getLocalizedBlogText(post.slug, lang);
	const categoryName = getCategoryName(categoryMap, post.categoryId, lang);
	const readTime = getBlogReadingTime(post.content[lang] || "");
	const publishedDate = formatDate(post.publishedAt, locale);

	return (
		<Link
			href={`/${locale}/blog/${slug}`}
			className="group grid overflow-hidden border border-[#E7D0AF] bg-white shadow-sm transition hover:border-[#A87E3C]/70 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
		>
			<div className="relative min-h-[280px] bg-[#F7F1E6] sm:min-h-[360px] lg:min-h-[460px]">
				{image.url ? (
					<Image
						src={image.url}
						alt={image.alt?.[lang] || title}
						fill
						priority
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover"
					/>
				) : null}
			</div>

			<div className="flex min-h-[360px] flex-col justify-center px-6 py-8 sm:px-8 lg:px-12">
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A87E3C]">
					{categoryName}
				</p>
				<h2 className="mt-5 max-w-2xl font-heading text-[30px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#342312] transition group-hover:text-[#A87E3C] sm:text-[38px] lg:text-[46px]">
					{title}
				</h2>
				<p className="mt-5 max-w-xl text-base leading-8 text-[#342312]/68">
					{excerpt}
				</p>

				<div className="mt-8 border-t border-[#E7D0AF] pt-5">
					<div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[#342312]/62">
						<div className="flex flex-wrap items-center gap-4">
							{publishedDate ? (
								<span className="inline-flex items-center gap-1.5">
									<CalendarDays className="size-4 text-[#A87E3C]" />
									{publishedDate}
								</span>
							) : null}
							<span className="inline-flex items-center gap-1.5">
								<Clock3 className="size-4 text-[#A87E3C]" />
								{readTime} {readMinuteLabel}
							</span>
						</div>
						<span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#A87E3C]">
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
	categoryMap,
	index,
	locale,
	post,
	readBlogLabel,
	readMinuteLabel,
}: {
	categoryMap: BlogCategoryMap;
	index: number;
	locale: Locale;
	post: BlogPost;
	readBlogLabel: string;
	readMinuteLabel: string;
}) {
	const lang = locale === "en" ? "en" : "vi";
	const image = getBlogCardImage(post);
	const title = getLocalizedBlogText(post.title, lang);
	const excerpt = getLocalizedBlogText(post.excerpt, lang);
	const slug = getLocalizedBlogText(post.slug, lang);
	const categoryName = getCategoryName(categoryMap, post.categoryId, lang);
	const readTime = getBlogReadingTime(post.content[lang] || "");
	const publishedDate = formatDate(post.publishedAt, locale);

	return (
		<Link
			href={`/${locale}/blog/${slug}`}
			className="blog-reveal group flex min-h-[310px] flex-col overflow-hidden border border-[#E7D0AF] bg-white shadow-sm transition hover:border-[#A87E3C]/70 md:min-h-[460px]"
			style={{ animationDelay: `${260 + index * 70}ms` }}
		>
			<div className="relative aspect-[16/10] bg-[#F7F1E6]">
				{image.url ? (
					<Image
						src={image.url}
						alt={image.alt?.[lang] || title}
						fill
						sizes="(max-width: 767px) 50vw, (max-width: 1280px) 50vw, 24vw"
						className="object-cover"
					/>
				) : null}
			</div>

			<div className="flex flex-1 flex-col px-3 py-4 md:px-5 md:py-5">
				<p className="line-clamp-1 text-[9px] font-semibold uppercase leading-4 tracking-[0.1em] text-[#A87E3C] md:line-clamp-none md:text-[11px] md:leading-normal md:tracking-[0.16em]">
					{categoryName}
				</p>
				<h3 className="mt-2 line-clamp-2 font-heading text-[15px] font-semibold leading-[1.3] text-[#342312] transition group-hover:text-[#A87E3C] md:mt-3 md:text-xl md:leading-tight">
					{title}
				</h3>
				<p className="mt-3 hidden line-clamp-3 text-sm leading-7 text-[#342312]/65 md:block">
					{excerpt}
				</p>

				<div className="mt-auto pt-4 md:pt-5">
					<div className="flex flex-col items-start gap-1 text-[10px] text-[#342312]/55 md:flex-row md:items-center md:justify-between md:gap-3 md:text-xs">
						{publishedDate ? <span>{publishedDate}</span> : <span />}
						<span>
							{readTime} {readMinuteLabel}
						</span>
					</div>
					<div className="mt-3 flex justify-start text-[10px] font-bold uppercase tracking-[0.1em] text-[#A87E3C] md:mt-4 md:justify-end md:text-xs md:tracking-[0.14em]">
						<span className="inline-flex items-center gap-2">
							{readBlogLabel}
							<ArrowRight className="size-3.5 transition group-hover:translate-x-1 md:size-4" />
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
}

function EmptyBlogState({ children }: { children: string }) {
	return (
		<div className="border border-[#E7D0AF] bg-white px-5 py-12 text-center text-sm text-[#342312]/65">
			{children}
		</div>
	);
}

function CategorySidebar({
	allLabel,
	categories,
	locale,
	selectedCategoryId,
	selectedTag,
	title,
	totalCount,
}: {
	allLabel: string;
	categories: BlogCategorySummary[];
	locale: Locale;
	selectedCategoryId: string | null;
	selectedTag: string | null;
	title: string;
	totalCount: number;
}) {
	const lang = locale === "en" ? "en" : "vi";

	return (
		<SidebarCard title={title}>
			<div className="space-y-1">
				<SidebarFilterLink
					active={!selectedCategoryId}
					href={createBlogHref(locale, { tag: selectedTag })}
					label={allLabel}
					value={totalCount}
				/>
				{categories.map(({ category, count }) => (
					<SidebarFilterLink
						key={category.id}
						active={selectedCategoryId === category.id}
						href={createBlogHref(locale, { categoryId: category.id, tag: selectedTag })}
						label={getLocalizedBlogText(category.name, lang)}
						value={count}
					/>
				))}
			</div>
		</SidebarCard>
	);
}

function FeaturedSidebar({
	categoryMap,
	locale,
	posts,
	readMinuteLabel,
	title,
}: {
	categoryMap: BlogCategoryMap;
	locale: Locale;
	posts: BlogPost[];
	readMinuteLabel: string;
	title: string;
}) {
	const lang = locale === "en" ? "en" : "vi";

	if (posts.length === 0) return null;

	return (
		<SidebarCard title={title}>
			<div className="space-y-4">
				{posts.map((post) => {
					const image = getBlogCardImage(post);
					const titleText = getLocalizedBlogText(post.title, lang);
					const slug = getLocalizedBlogText(post.slug, lang);
					const readTime = getBlogReadingTime(post.content[lang] || "");

					return (
						<Link
							key={post.id}
							href={`/${locale}/blog/${slug}`}
							className="group grid grid-cols-[72px_minmax(0,1fr)] gap-3 border-b border-[#E7D0AF]/70 pb-4 last:border-b-0 last:pb-0"
						>
							<div className="relative aspect-square border border-[#E7D0AF] bg-[#F7F1E6]">
								{image.url ? (
									<Image
										src={image.url}
										alt={image.alt?.[lang] || titleText}
										fill
										sizes="72px"
										className="object-cover"
									/>
								) : null}
							</div>
							<div className="min-w-0">
								<p className="line-clamp-2 text-sm font-semibold leading-5 text-[#342312] transition group-hover:text-[#A87E3C]">
									{titleText}
								</p>
								<p className="mt-1 text-xs text-[#342312]/55">
									{readTime} {readMinuteLabel}
								</p>
								<p className="sr-only">{getCategoryName(categoryMap, post.categoryId, lang)}</p>
							</div>
						</Link>
					);
				})}
			</div>
		</SidebarCard>
	);
}

function TagSidebar({
	locale,
	selectedCategoryId,
	selectedTag,
	tags,
	title,
}: {
	locale: Locale;
	selectedCategoryId: string | null;
	selectedTag: string | null;
	tags: BlogTagSummary[];
	title: string;
}) {
	if (tags.length === 0) return null;

	return (
		<SidebarCard title={title}>
			<div className="flex flex-wrap gap-2">
				{tags.map((tag) => (
					<Link
						key={tag.name}
						href={createBlogHref(locale, {
							categoryId: selectedCategoryId,
							tag: selectedTag === tag.name ? null : tag.name,
						})}
						className={[
							"rounded-full border px-3 py-1.5 text-xs font-semibold transition",
							selectedTag === tag.name
								? "border-[#342312] bg-[#342312] text-[#E7D0AF]"
								: "border-[#E7D0AF] bg-[#FAF7F1] text-[#342312]/70 hover:border-[#A87E3C] hover:text-[#342312]",
						].join(" ")}
					>
						{tag.name} <span className="text-current/55">{tag.count}</span>
					</Link>
				))}
			</div>
		</SidebarCard>
	);
}

function SidebarCard({ children, title }: { children: ReactNode; title: string }) {
	return (
		<div className="border border-[#E7D0AF] bg-white px-5 py-5 shadow-sm">
			<h2 className="font-heading text-2xl font-semibold text-[#342312]">{title}</h2>
			<div className="mt-5">{children}</div>
		</div>
	);
}

function SidebarFilterLink({
	active,
	href,
	label,
	value,
}: {
	active: boolean;
	href: string;
	label: string;
	value: number;
}) {
	return (
		<Link
			href={href}
			className={[
				"flex items-center justify-between gap-4 px-4 py-3 text-sm font-semibold transition",
				active
					? "bg-[#342312] text-[#E7D0AF]"
					: "text-[#342312]/78 hover:bg-[#FAF7F1] hover:text-[#342312]",
			].join(" ")}
		>
			<span>{label}</span>
			<span className="text-current/65">{value}</span>
		</Link>
	);
}

function BlogPagination({
	currentPage,
	locale,
	selectedCategoryId,
	selectedTag,
	totalPages,
}: {
	currentPage: number;
	locale: Locale;
	selectedCategoryId: string | null;
	selectedTag: string | null;
	totalPages: number;
}) {
	if (totalPages <= 1) return null;

	const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

	return (
		<div className="mt-10 flex items-center justify-center gap-2">
			<PaginationButton
				disabled={currentPage <= 1}
				href={`${createBlogHref(locale, {
					categoryId: selectedCategoryId,
					page: currentPage - 1,
					tag: selectedTag,
				})}#blog-list`}
			>
				‹
			</PaginationButton>
			{pages.map((page) => (
				<PaginationButton
					key={page}
					active={page === currentPage}
					href={`${createBlogHref(locale, {
						categoryId: selectedCategoryId,
						page,
						tag: selectedTag,
					})}#blog-list`}
				>
					{page}
				</PaginationButton>
			))}
			<PaginationButton
				disabled={currentPage >= totalPages}
				href={`${createBlogHref(locale, {
					categoryId: selectedCategoryId,
					page: currentPage + 1,
					tag: selectedTag,
				})}#blog-list`}
			>
				›
			</PaginationButton>
		</div>
	);
}

function PaginationButton({
	active,
	children,
	disabled,
	href,
}: {
	active?: boolean;
	children: ReactNode;
	disabled?: boolean;
	href: string;
}) {
	const className = [
		"flex size-10 items-center justify-center rounded-full border text-sm font-semibold transition",
		active
			? "border-[#342312] bg-[#342312] text-[#E7D0AF]"
			: "border-[#E7D0AF] bg-white text-[#342312] hover:border-[#A87E3C] hover:text-[#A87E3C]",
		disabled ? "pointer-events-none opacity-40" : "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<Link href={href} className={className} aria-disabled={disabled || undefined}>
			{children}
		</Link>
	);
}
