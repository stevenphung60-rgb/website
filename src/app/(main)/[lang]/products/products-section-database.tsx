/**
 * Server component that fetches products from database and renders the products section
 * Supports filtering by product categories from database
 */

import { ChevronRight } from "lucide-react";
import { cacheTag } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import {
	EmptyStateCard,
	EmptyStateDescription,
	EmptyStateIcon,
	EmptyStateTitle,
} from "src/components/empty-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import { getProductCategoryById } from "src/server/productcategories/get-productcategory-by-id.query";
import { getActiveProductCategoryIds } from "src/server/productcategories/get-productcategory-ids.query";
import { getActiveProductIds, getProductById } from "src/server/products";
import { ProductCardWrapper } from "./product-card-wrapper";
import ProductDialog from "./product-dialog";
import { ProductFilterButtons, ProductFilterProvider } from "./product-filter";
import { ProductGridController, ViewAllButton } from "./product-visibility";

interface ProductsSectionDatabaseProps {
	locale: Locale;
	viewAll?: boolean;
	showHeader?: boolean;
	initialCategory?: string | null;
}

async function ProductCard({
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

export default async function ProductsSectionDatabase({
	locale,
	viewAll = false,
	showHeader = true,
	initialCategory = null,
}: ProductsSectionDatabaseProps) {
	"use cache";
	cacheTag(CACHE_TAGS.PRODUCTS);

	const productIds: string[] = await getActiveProductIds();
	const productCategoryIds = await getActiveProductCategoryIds();
	const dictionary = getDictionary(locale);

	const productCategoriesData = await Promise.all(
		productCategoryIds.map((categoryId) => getProductCategoryById(categoryId)),
	);

	const productCategories = productCategoriesData
		.filter(
			(
				category,
			): category is NonNullable<(typeof productCategoriesData)[number]> =>
				category !== null,
		)
		.map((category) => ({
			id: category.id,
			name: category.name,
		}))
		.filter((category) => category.name.en || category.name.vi);

	const displayIds = viewAll ? productIds : productIds.slice(0, 4);
	const selectedCategory = viewAll ? initialCategory : null;

	return (
		<section id="products" className="bg-background py-6 sm:py-8">
			<div className="w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
				{showHeader && (
					<div className="mb-10 text-center sm:mb-16">
						<h2
							className="mb-4 flex flex-wrap items-center justify-center gap-2 font-serif text-lg font-bold !text-[#A87E3C] animate-fade-up sm:mb-6 sm:text-xl lg:text-xl"
							style={{ animationDelay: "0ms" }}
						>
							<span className="h-[2px] w-8 bg-[#A87E3C] sm:w-10" />

							{dictionary.products.title}{" "}

							<span className="!text-[#A87E3C]">
								{dictionary.products.subtitle}
							</span>

							<span className="h-[2px] w-8 bg-[#A87E3C] sm:w-10" />
						</h2>

						<p
							className="mx-auto max-w-3xl text-base leading-8 text-muted-foreground animate-fade-up sm:text-xl sm:leading-relaxed"
							style={{ animationDelay: "150ms" }}
						>
							{dictionary.products.description}
						</p>
					</div>
				)}

				{productIds.length > 0 ? (
					<ProductFilterProvider selectedCategory={selectedCategory}>
						{viewAll ? (
							<div
								id="products-filter"
								className="scroll-mt-24 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10"
							>
								<ProductFilterButtons
									locale={locale}
									categories={productCategories}
								/>

								<div className="min-w-0 flex-1">
									<ProductGridController productIds={displayIds} limitRows>
										<div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
											{displayIds.map((productId) => (
												<Suspense key={productId} fallback={null}>
													<ProductCard id={productId} locale={locale} />
												</Suspense>
											))}
										</div>

										<ViewAllButton />
									</ProductGridController>
								</div>
							</div>
						) : (
							<>
								<ProductGridController productIds={displayIds} limitRows={false}>
									<div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
										{displayIds.map((productId) => (
											<Suspense key={productId} fallback={null}>
												<ProductCard id={productId} locale={locale} />
											</Suspense>
										))}
									</div>
								</ProductGridController>

								<div className="mt-10 flex justify-center sm:mt-12">
									<Link href={`/${locale}/products/`}>
										<button
											type="button"
											className="group relative overflow-hidden bg-[#342312] px-5 py-3 text-sm font-semibold text-[#E7D0AF] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:px-6"
										>
											<span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-white">
												{dictionary.products.viewAll}

												<ChevronRight className="size-4 transition-all duration-300 group-hover:translate-x-0 group-hover:text-white" />
											</span>

											<span className="absolute inset-0 translate-x-[-100%] bg-[#A87E3C] transition-transform duration-300 ease-in-out group-hover:translate-x-0" />
										</button>
									</Link>
								</div>
							</>
						)}
					</ProductFilterProvider>
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