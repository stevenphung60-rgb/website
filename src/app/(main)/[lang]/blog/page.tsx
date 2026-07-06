import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "src/lib/i18n/config";
import {
	getBlogCategories,
	getBlogCategoryById,
	getFeaturedBlogPosts,
	getPublishedBlogPosts,
} from "src/server/blogs";
import { getBlogReadingTime, getLocalizedBlogText } from "src/server/blogs/blog-utils";

export const metadata: Metadata = {
	title: "Blog | Nghiệp Hưng",
	description: "Blog kiến thức kỹ thuật, sản phẩm và giải pháp ống gió từ Nghiệp Hưng.",
};

interface BlogListPageProps {
	params: Promise<{ lang: Locale }>;
	searchParams?: Promise<{ category?: string | string[] }>;
}

export default async function BlogListPage({ params, searchParams }: BlogListPageProps) {
	const { lang: locale } = await params;
	const resolvedSearchParams = await searchParams;
	const lang = locale === "en" ? "en" : "vi";
	const categoryParam = resolvedSearchParams?.category;
	const selectedCategoryId = Array.isArray(categoryParam)
		? categoryParam[0] || null
		: categoryParam || null;

	const [categories, featuredPosts, posts] = await Promise.all([
		getBlogCategories(),
		getFeaturedBlogPosts(3),
		getPublishedBlogPosts(selectedCategoryId),
	]);

	return (
		<main className="bg-[#FAF7F1] text-[#342312]">
			<section className="px-4 pb-10 pt-16 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
				<div className="mx-auto max-w-7xl">
					<p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A87E3C]">Blog</p>
					<h1 className="font-heading mt-4 max-w-4xl text-4xl font-black uppercase leading-tight text-[#342312] sm:text-5xl lg:text-6xl">Blog</h1>
					<p className="mt-4 max-w-3xl text-base leading-8 text-[#342312]/70">Kiến thức kỹ thuật, tiêu chuẩn, giải pháp sản xuất và thi công hệ thống ống gió.</p>
				</div>
			</section>

			{featuredPosts.length > 0 ? (
				<section className="px-4 pb-8 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
					<div className="mx-auto max-w-7xl">
						<h2 className="font-heading text-2xl font-bold text-[#342312]">Blog nổi bật</h2>
						<div className="mt-5 grid gap-5 lg:grid-cols-3">
							{featuredPosts.map((post) => <BlogCard key={post.id} post={post} locale={lang} />)}
						</div>
					</div>
				</section>
			) : null}

			<section className="px-4 py-10 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
				<div className="mx-auto max-w-7xl">
					<div className="mb-8 flex flex-wrap gap-3">
						<Link href={`/${locale}/blog`} className={["rounded-full border px-4 py-2 text-sm font-semibold", !selectedCategoryId ? "border-[#342312] bg-[#342312] text-[#E7D0AF]" : "border-[#E7D0AF] bg-white text-[#342312]"].join(" ")}>Tất cả</Link>
						{categories.map((category) => (
							<Link key={category.id} href={`/${locale}/blog?category=${category.id}`} className={["rounded-full border px-4 py-2 text-sm font-semibold", selectedCategoryId === category.id ? "border-[#342312] bg-[#342312] text-[#E7D0AF]" : "border-[#E7D0AF] bg-white text-[#342312]"].join(" ")}>{getLocalizedBlogText(category.name, lang)}</Link>
						))}
					</div>

					{posts.length > 0 ? (
						<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
							{posts.map((post) => <BlogCard key={post.id} post={post} locale={lang} />)}
						</div>
					) : (
						<div className="rounded-2xl border border-[#E7D0AF] bg-white px-5 py-12 text-center text-sm text-[#342312]/65">Chưa có blog phù hợp.</div>
					)}
				</div>
			</section>
		</main>
	);
}

async function BlogCard({ post, locale }: { post: Awaited<ReturnType<typeof getPublishedBlogPosts>>[number]; locale: "vi" | "en" }) {
	const category = post.categoryId ? await getBlogCategoryById(post.categoryId) : null;
	const title = getLocalizedBlogText(post.title, locale);
	const excerpt = getLocalizedBlogText(post.excerpt, locale);
	const slug = getLocalizedBlogText(post.slug, locale);
	const readTime = getBlogReadingTime(post.content[locale] || []);

	return (
		<Link href={`/${locale}/blog/${slug}`} className="group overflow-hidden rounded-2xl border border-[#E7D0AF] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
			<div className="relative aspect-[16/10] bg-[#F7F1E6]">
				{post.coverImage.url ? (
					<Image src={post.coverImage.url} alt={post.coverImage.alt[locale] || title} fill className="object-cover transition duration-500 group-hover:scale-105" />
				) : null}
			</div>
			<div className="p-5">
				<p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A87E3C]">{category ? getLocalizedBlogText(category.name, locale) : "Blog"}</p>
				<h3 className="font-heading mt-3 line-clamp-2 text-xl font-bold leading-tight text-[#342312] transition group-hover:text-[#A87E3C]">{title}</h3>
				<p className="mt-3 line-clamp-3 text-sm leading-7 text-[#342312]/65">{excerpt}</p>
				<p className="mt-4 text-xs font-medium text-[#342312]/55">{readTime} phút đọc</p>
			</div>
		</Link>
	);
}
