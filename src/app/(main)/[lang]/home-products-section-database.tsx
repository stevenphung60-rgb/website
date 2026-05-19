/**
 * Home-only products section.
 * Fetches products from database and reveals product cards one by one on scroll.
 */

import { ChevronRight } from "lucide-react";
import { cacheTag } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import type { HeroInfo } from "src/app/admin/hero/hero.type";
import {
	EmptyStateCard,
	EmptyStateDescription,
	EmptyStateIcon,
	EmptyStateTitle,
} from "src/components/empty-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import { getActiveProductIds, getProductById } from "src/server/products";
import AboutRevealSection from "./about/about-reveal-section";
import { ProductCardWrapper } from "./products/product-card-wrapper";
import ProductDialog from "./products/product-dialog";
import { ProductFilterProvider } from "./products/product-filter";
import { ProductGridController } from "./products/product-visibility";

interface HomeProductsSectionDatabaseProps {
	locale: Locale;
	heroInfo?: HeroInfo;
	limit?: number;
}

async function HomeProductCard({
	id,
	locale,
}: {
	id: string;
	locale: Locale;
}) {
	const product = await getProductById(id);

	if (!product) return null;

	return (
		<ProductCardWrapper id={product.id} categoryId={product.categoryId ?? null}>
			<ProductDialog productId={product.id} locale={locale} />
		</ProductCardWrapper>
	);
}

export default async function HomeProductsSectionDatabase({
	locale,
	heroInfo,
	limit = 4,
}: HomeProductsSectionDatabaseProps) {
	"use cache";
	cacheTag(CACHE_TAGS.PRODUCTS);
	cacheTag(CACHE_TAGS.HERO);

	const productIds: string[] = await getActiveProductIds();
	const dictionary = getDictionary(locale);
	const lang = locale === "en" ? "en" : "vi";

	const displayIds = productIds.slice(0, limit);

	const productTitle = heroInfo?.productitle?.[lang]?.trim() || "";
	const productDescription =
		heroInfo?.productdescription?.[lang]?.trim() || "";

	return (
		<section id="products" className="bg-background py-6 sm:py-8">
			<div className="w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
				{productTitle || productDescription ? (
					<div className="mb-10 text-center sm:mb-16">
						{productTitle ? (
							<h2
								className="mb-4 flex flex-wrap items-center justify-center gap-2 font-serif text-lg font-bold !text-[#A87E3C] animate-fade-up sm:mb-6 sm:text-xl lg:text-xl"
								style={{ animationDelay: "0ms" }}
							>
								<span className="h-[2px] w-8 bg-[#A87E3C] sm:w-10" />

								<span>{productTitle}</span>

								<span className="h-[2px] w-8 bg-[#A87E3C] sm:w-10" />
							</h2>
						) : null}

						{productDescription ? (
							<p
								className="mx-auto max-w-3xl text-[14px] leading-7 text-muted-foreground animate-fade-up sm:text-[15px] sm:leading-8 lg:text-[16px] lg:leading-8"
								style={{ animationDelay: "150ms" }}
							>
								{productDescription}
							</p>
						) : null}
					</div>
				) : null}

				{displayIds.length > 0 ? (
					<>
						<ProductFilterProvider selectedCategory={null}>
							<ProductGridController productIds={displayIds} limitRows={false}>
								<div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
									{displayIds.map((productId, index) => (
										<AboutRevealSection
											key={productId}
											variant="fade-up"
											delay={index * 130}
										>
											<Suspense fallback={null}>
												<HomeProductCard id={productId} locale={locale} />
											</Suspense>
										</AboutRevealSection>
									))}
								</div>
							</ProductGridController>
						</ProductFilterProvider>

						<div className="mt-10 flex justify-center sm:mt-12">
							<Link href={`/${locale}/products/`}>
								<button
									type="button"
									className="group relative overflow-hidden bg-[#342312] px-5 py-3 text-sm font-semibold text-[#E7D0AF] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:px-6"
								>
									<span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-white">
										{dictionary.products.viewAll}

										<ChevronRight className="size-4 transition-all duration-300 group-hover:text-white" />
									</span>

									<span className="absolute inset-0 translate-x-[-100%] bg-[#A87E3C] transition-transform duration-300 ease-in-out group-hover:translate-x-0" />
								</button>
							</Link>
						</div>
					</>
				) : (
					<EmptyStateCard>
						<EmptyStateIcon>📦</EmptyStateIcon>

						<EmptyStateTitle>{dictionary.products.empty.title}</EmptyStateTitle>

						<EmptyStateDescription>
							{dictionary.products.empty.description}
						</EmptyStateDescription>
					</EmptyStateCard>
				)}
			</div>
		</section>
	);
}