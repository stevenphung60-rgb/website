import { ArrowRight, ChevronRight, Phone } from "lucide-react";
import { notFound } from "next/navigation";
import LocaleLink from "src/components/behaviors/LocaleLink";
import ScrollToTopHandler from "src/components/scroll-to-top-handler";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import { getContactInfo } from "src/server/contact";
import { getProductCategoryById } from "src/server/productcategories/get-productcategory-by-id.query";
import { getActiveProductIds, getProductById } from "src/server/products";
import ProductDialog from "../product-dialog";
import { ProductGallery } from "./product-gallery";
import { RelatedProductsCarousel } from "./related-products-carousel";

interface ProductDetailPageProps {
	params: Promise<{
		lang: Locale;
		id: string;
	}>;
}

export default async function ProductDetailPage({
	params,
}: ProductDetailPageProps) {
	const { lang: locale, id } = await params;

	const contactInfo = await getContactInfo();
	const phone = contactInfo?.phone1 ?? "";

	const dictionary = getDictionary(locale);
	const product = await getProductById(id);

	if (!product) {
		notFound();
	}

	const category = product.categoryId
		? await getProductCategoryById(product.categoryId)
		: null;

	const activeProductIds = await getActiveProductIds();

	const allProducts = await Promise.all(
		activeProductIds.map((productId) => getProductById(productId)),
	);

	const relatedProducts = product.categoryId
		? allProducts
				.filter((item): item is NonNullable<typeof item> => Boolean(item))
				.filter((item) => item.id !== product.id)
				.filter((item) => item.categoryId === product.categoryId)
		: [];

	const productName = product.name?.[locale] ?? product.name?.en ?? "";
	const productDescription =
		product.description?.[locale] ?? product.description?.en ?? "";

	const categoryName =
		category?.name?.[locale] ?? category?.name?.en ?? dictionary.nav.products;

	const categoryFilterId = category?.id ?? product.categoryId ?? "";
	const thumbnails = product.gallery ?? [];

	return (
		<section className="w-full bg-[#FAF7F0] py-6 sm:py-8">
			<ScrollToTopHandler />

			<div className="w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
				<div
					className="reveal-item mb-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-[#A87E3C] sm:mb-8 sm:text-[14px]"
					style={{ animationDelay: "0ms" }}
				>
					<LocaleLink href="/" className="shrink-0 hover:text-[#342312]">
						{dictionary.nav.home}
					</LocaleLink>

					<ChevronRight className="size-3 shrink-0 sm:size-4" />

					<LocaleLink
						href={
							categoryFilterId
								? `/products?category=${encodeURIComponent(categoryFilterId)}`
								: "/products"
						}
						className="shrink-0 hover:text-[#342312]"
					>
						{categoryName}
					</LocaleLink>

					<ChevronRight className="size-3 shrink-0 sm:size-4" />

					<span className="min-w-0 break-words font-semibold text-[#342312]">
						{productName}
					</span>
				</div>

				<div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-24">
					<div className="reveal-item min-w-0" style={{ animationDelay: "100ms" }}>
						<ProductGallery images={thumbnails} productName={productName} />
					</div>

					<div
						className="reveal-item min-w-0"
						style={{ animationDelay: "200ms" }}
					>
						<h1 className="mb-4 text-2xl font-semibold leading-tight tracking-[0.02em] text-[#342312] sm:mb-6 sm:text-[28px]">
							{productName}
						</h1>

						<div className="rounded-xl bg-[#F7F1E6] p-4 sm:p-6 lg:p-8">
							<div className="space-y-5 text-[16px]">
								<div className="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr] sm:gap-4">
									<span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#64748B] sm:text-[14px] sm:normal-case sm:tracking-normal">
										{dictionary.product.code}
									</span>

									<span className="break-words text-[15px] font-medium text-[#342312] sm:text-[16px]">
										{product.code || "-"}
									</span>
								</div>

								<div className="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr] sm:gap-4">
									<span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#64748B] sm:text-[14px] sm:normal-case sm:tracking-normal">
										{dictionary.product.description}
									</span>

									<span className="whitespace-pre-line break-words text-[15px] leading-7 text-[#342312] sm:text-[16px] sm:leading-relaxed">
										{productDescription || "-"}
									</span>
								</div>
							</div>

							<div className="my-5 h-px bg-[#CBD5E1] sm:my-6" />
						</div>

						<div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-4">
							{phone ? (
								<a
									href={`tel:${phone.replace(/[^\d+]/g, "")}`}
									className="group relative inline-flex w-full items-center justify-center gap-3 whitespace-nowrap rounded-full bg-[#342312] px-5 py-3 text-sm font-semibold text-[#E7D0AF] transition hover:scale-105 sm:w-auto sm:px-8 sm:text-base"
								>
									<Phone className="size-5 group-hover:animate-shake" />

									<span className="relative">
										{phone}
										<span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#E7D0AF] transition-transform duration-500 group-hover:scale-x-100" />
									</span>
								</a>
							) : null}

							<LocaleLink
								href="/contact"
								className="group inline-flex w-full items-center justify-center gap-3 whitespace-nowrap rounded-full bg-[#E7D0AF] px-5 py-3 text-sm font-semibold text-[#342312] transition hover:scale-105 sm:w-auto sm:px-8 sm:text-base"
							>
								<span className="relative">
									{dictionary.hero.buttons.contactConsultation}
									<span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-[#342312] transition-all duration-500 group-hover:w-full" />
								</span>

								<ArrowRight className="size-5 transition group-hover:translate-x-1" />
							</LocaleLink>
						</div>
					</div>
				</div>

				{relatedProducts.length > 0 ? (
					<div
						className="reveal-item mt-12 overflow-visible sm:mt-16"
						style={{ animationDelay: "300ms" }}
					>
						<h2 className="mb-5 text-[15px] font-bold uppercase tracking-[0.08em] text-[#342312] sm:mb-8 sm:text-[16px]">
							{dictionary.header.relatedcontent}
						</h2>

						<RelatedProductsCarousel
							contentKey={`${id}:${relatedProducts.map((relatedProduct) => relatedProduct.id).join("\u0000")}`}
							itemCount={relatedProducts.length}
							locale={locale}
						>
							{relatedProducts.map((relatedProduct) => (
								<div
									key={relatedProduct.id}
									className="h-full overflow-visible pt-2"
								>
									<ProductDialog
										productId={relatedProduct.id}
										locale={locale}
									/>
								</div>
							))}
						</RelatedProductsCarousel>
					</div>
				) : null}
			</div>
		</section>
	);
}
