import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogContentRenderer } from "src/components/blog/blog-content-renderer";
import type { Locale } from "src/lib/i18n/config";
import {
	getBlogCategoryById,
	getBlogPostById,
	getBlogPostBySlug,
	getBlogPosts,
} from "src/server/blogs";
import { getBlogReadingTime, getLocalizedBlogText } from "src/server/blogs/blog-utils";

interface BlogDetailPageProps {
	params: Promise<{ lang: Locale; slug: string }>;
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

	return {
		title: getLocalizedBlogText(post.seo.title, lang) || getLocalizedBlogText(post.title, lang),
		description: getLocalizedBlogText(post.seo.description, lang) || getLocalizedBlogText(post.excerpt, lang),
		openGraph: {
			title: getLocalizedBlogText(post.seo.title, lang) || getLocalizedBlogText(post.title, lang),
			description: getLocalizedBlogText(post.seo.description, lang) || getLocalizedBlogText(post.excerpt, lang),
			images: post.seo.ogImage || post.coverImage.url ? [post.seo.ogImage || post.coverImage.url] : undefined,
		},
	};
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
	const { lang: locale, slug } = await params;
	const lang = locale === "en" ? "en" : "vi";
	const post = await getBlogPostBySlug(slug, lang);

	if (!post) {
		notFound();
	}

	const category = post.categoryId ? await getBlogCategoryById(post.categoryId) : null;
	const title = getLocalizedBlogText(post.title, lang);
	const excerpt = getLocalizedBlogText(post.excerpt, lang);
	const blocks = post.content[lang] || [];
	const readTime = getBlogReadingTime(blocks);
	const relatedPosts = post.relatedBlogPostIds.length > 0
		? (await Promise.all(post.relatedBlogPostIds.map((id) => getBlogPostById(id)))).filter(Boolean)
		: (await getBlogPosts({ status: "published", limit: 3 })).filter((relatedPost) => relatedPost.id !== post.id);

	return (
		<main className="bg-[#FAF7F1] text-[#342312]">
			<article>
				<section className="px-4 pb-8 pt-14 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
					<div className="mx-auto max-w-5xl">
						<div className="mb-6 text-sm text-[#342312]/60">
							<Link href={`/${locale}`} className="hover:text-[#A87E3C]">Trang chủ</Link>
							<span className="mx-2">/</span>
							<Link href={`/${locale}/blog`} className="hover:text-[#A87E3C]">Blog</Link>
							{category ? <><span className="mx-2">/</span><span>{getLocalizedBlogText(category.name, lang)}</span></> : null}
						</div>

						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A87E3C]">{category ? getLocalizedBlogText(category.name, lang) : "Blog"}</p>
						<h1 className="font-heading mt-4 text-4xl font-black uppercase leading-tight text-[#342312] sm:text-5xl lg:text-6xl">{title}</h1>
						<p className="mt-5 max-w-3xl text-base leading-8 text-[#342312]/70 sm:text-lg">{excerpt}</p>
						<p className="mt-4 text-sm text-[#342312]/55">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(locale === "en" ? "en-US" : "vi-VN") : "Blog"} · {readTime} phút đọc</p>
					</div>
				</section>

				{post.coverImage.url ? (
					<section className="px-4 pb-10 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
						<figure className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-[#E7D0AF] bg-white">
							<div className="relative aspect-[16/8] bg-[#F7F1E6]">
								<Image src={post.coverImage.url} alt={post.coverImage.alt[lang] || title} fill className="object-cover" priority />
							</div>
							{post.coverImage.caption?.[lang] ? <figcaption className="border-t border-[#E7D0AF]/70 px-5 py-3 text-sm italic text-[#342312]/60">{post.coverImage.caption[lang]}</figcaption> : null}
						</figure>
					</section>
				) : null}

				<section className="px-4 py-10 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
					<BlogContentRenderer blocks={blocks} appearance={post.appearance} />
				</section>

				{post.gallery.length > 0 ? (
					<section className="px-4 py-8 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
						<div className="mx-auto max-w-6xl">
							<h2 className="font-heading text-2xl font-bold text-[#342312]">Gallery</h2>
							<div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{post.gallery.map((image) => <img key={image.url} src={image.url} alt={image.alt[lang] || "Blog gallery"} className="aspect-[4/3] w-full rounded-2xl border border-[#E7D0AF] object-cover" />)}
							</div>
						</div>
					</section>
				) : null}
			</article>

			{relatedPosts.length > 0 ? (
				<section className="px-4 py-12 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
					<div className="mx-auto max-w-7xl">
						<h2 className="font-heading text-2xl font-bold text-[#342312]">Blog liên quan</h2>
						<div className="mt-5 grid gap-5 md:grid-cols-3">
							{relatedPosts.slice(0, 3).map((relatedPost) => relatedPost ? <Link key={relatedPost.id} href={`/${locale}/blog/${getLocalizedBlogText(relatedPost.slug, lang)}`} className="rounded-2xl border border-[#E7D0AF] bg-white p-5 transition hover:bg-[#FAF7F1]"><p className="font-heading text-lg font-bold text-[#342312]">{getLocalizedBlogText(relatedPost.title, lang)}</p><p className="mt-2 line-clamp-2 text-sm leading-6 text-[#342312]/65">{getLocalizedBlogText(relatedPost.excerpt, lang)}</p></Link> : null)}
						</div>
					</div>
				</section>
			) : null}
		</main>
	);
}
