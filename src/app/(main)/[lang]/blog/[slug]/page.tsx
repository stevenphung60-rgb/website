import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogContentRenderer } from "src/components/blog/blog-content-renderer";
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
} from "src/server/blogs";
import {
	getBlogReadingTime,
	getLocalizedBlogText,
	getMainBlogImage,
} from "src/server/blogs/blog-utils";

interface BlogDetailPageProps {
	params: Promise<{ lang: Locale; slug: string }>;
}

const blogText = {
	vi: {
		home: "Trang chủ",
		readMinute: "phút đọc",
		gallery: "Gallery",
		relatedProductCategories: "Loại sản phẩm liên quan",
		relatedProducts: "Sản phẩm liên quan",
		relatedServices: "Dịch vụ liên quan",
		relatedProjectCategories: "Loại dự án liên quan",
		relatedProjects: "Dự án liên quan",
		relatedBlogs: "Blog liên quan",
	},
	en: {
		home: "Home",
		readMinute: "min read",
		gallery: "Gallery",
		relatedProductCategories: "Related product categories",
		relatedProducts: "Related products",
		relatedServices: "Related services",
		relatedProjectCategories: "Related project categories",
		relatedProjects: "Related projects",
		relatedBlogs: "Related blog",
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
	const mainImage = getMainBlogImage(post.gallery) || post.coverImage;

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

	const category = post.categoryId ? await getBlogCategoryById(post.categoryId) : null;
	const title = getLocalizedBlogText(post.title, lang);
	const excerpt = getLocalizedBlogText(post.excerpt, lang);
	const contentHtml = post.content[lang] || "";
	const readTime = getBlogReadingTime(contentHtml);
	const mainImage = getMainBlogImage(post.gallery) || post.coverImage;
	const galleryImages = post.gallery.filter((image) => image.url);

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

	return (
		<main className="bg-[#FAF7F1] text-[#342312]">
			<article>
				<section className="px-4 pb-8 pt-14 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
					<div className="mx-auto max-w-5xl">
						<div className="mb-6 text-sm text-[#342312]/60">
							<Link href={`/${locale}`} className="hover:text-[#A87E3C]">{text.home}</Link>
							<span className="mx-2">/</span>
							<Link href={`/${locale}/blog`} className="hover:text-[#A87E3C]">Blog</Link>
							{category ? <><span className="mx-2">/</span><span>{getLocalizedBlogText(category.name, lang)}</span></> : null}
						</div>

						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A87E3C]">{category ? getLocalizedBlogText(category.name, lang) : "Blog"}</p>
						<h1 className="font-heading mt-4 text-4xl font-black uppercase leading-tight text-[#342312] sm:text-5xl lg:text-6xl">{title}</h1>
						<p className="mt-5 max-w-3xl text-base leading-8 text-[#342312]/70 sm:text-lg">{excerpt}</p>
						<p className="mt-4 text-sm text-[#342312]/55">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(locale === "en" ? "en-US" : "vi-VN") : "Blog"} · {readTime} {text.readMinute}</p>
					</div>
				</section>

				{mainImage.url ? (
					<section className="px-4 pb-10 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
						<figure className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-[#E7D0AF] bg-white">
							<div className="relative aspect-[16/8] bg-[#F7F1E6]">
								<Image src={mainImage.url} alt={mainImage.alt[lang] || title} fill className="object-cover" priority />
							</div>
							{mainImage.caption?.[lang] ? <figcaption className="border-t border-[#E7D0AF]/70 px-5 py-3 text-sm italic text-[#342312]/60">{mainImage.caption[lang]}</figcaption> : null}
						</figure>
					</section>
				) : null}

				<section className="px-4 py-10 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
					<BlogContentRenderer html={contentHtml} appearance={post.appearance} />
				</section>

				{galleryImages.length > 0 ? (
					<section className="px-4 py-8 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
						<div className="mx-auto max-w-6xl">
							<h2 className="font-heading text-2xl font-bold text-[#342312]">{text.gallery}</h2>
							<div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{galleryImages.map((image) => <BlogGalleryImage key={`${image.url}-${image.order}`} image={image} locale={lang} />)}
							</div>
						</div>
					</section>
				) : null}
			</article>

			<RelatedLinkSection title={text.relatedProductCategories} items={relatedProductCategories.filter(Boolean).map((category) => ({ label: localized(category?.name, locale), href: `/${locale}/products?category=${category?.id}` }))} />
			<RelatedLinkSection title={text.relatedProducts} items={relatedProducts.filter(Boolean).map((product) => ({ label: localized(product?.name, locale), href: `/${locale}/products/${product?.id}`, description: product?.code }))} />
			<RelatedLinkSection title={text.relatedServices} items={relatedServices.filter(Boolean).map((service) => ({ label: localized(service?.name, locale), href: `/${locale}/services#${service?.id}` }))} />
			<RelatedLinkSection title={text.relatedProjectCategories} items={relatedProjectCategories.filter(Boolean).map((category) => ({ label: localized(category?.name, locale), href: `/${locale}/projects?category=${category?.id}` }))} />
			<RelatedLinkSection title={text.relatedProjects} items={relatedProjects.filter(Boolean).map((project) => ({ label: localized(project?.name, locale), href: `/${locale}/projects/${project?.id}`, description: localized(project?.location, locale) || localized(project?.year, locale) }))} />
			<RelatedLinkSection title={text.relatedBlogs} items={relatedBlogs.filter(Boolean).map((relatedBlog) => ({ label: getLocalizedBlogText(relatedBlog?.title || { vi: "", en: "" }, lang), href: `/${locale}/blog/${getLocalizedBlogText(relatedBlog?.slug || { vi: "", en: "" }, lang)}`, description: getLocalizedBlogText(relatedBlog?.excerpt || { vi: "", en: "" }, lang) }))} />
		</main>
	);
}

function BlogGalleryImage({ image, locale }: { image: BlogImage; locale: "vi" | "en" }) {
	return (
		<figure className="overflow-hidden rounded-2xl border border-[#E7D0AF] bg-white">
			<img src={image.url} alt={image.alt[locale] || "Blog gallery"} className="aspect-[4/3] w-full object-cover" />
			{image.caption?.[locale] ? (
				<figcaption className="border-t border-[#E7D0AF]/70 px-4 py-3 text-sm italic text-[#342312]/60">{image.caption[locale]}</figcaption>
			) : null}
		</figure>
	);
}

function RelatedLinkSection({
	title,
	items,
}: {
	title: string;
	items: Array<{ label: string; href: string; description?: string }>;
}) {
	const visibleItems = items.filter((item) => item.label && item.href);

	if (visibleItems.length === 0) return null;

	return (
		<section className="px-4 py-8 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
			<div className="mx-auto max-w-7xl">
				<h2 className="font-heading text-2xl font-bold text-[#342312]">{title}</h2>
				<div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{visibleItems.map((item) => (
						<Link key={item.href} href={item.href} className="rounded-2xl border border-[#E7D0AF] bg-white p-5 transition hover:bg-[#FAF7F1]">
							<p className="font-heading text-lg font-bold text-[#342312]">{item.label}</p>
							{item.description ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#342312]/65">{item.description}</p> : null}
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
