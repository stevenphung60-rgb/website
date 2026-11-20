import type { Metadata } from "next";
import { Suspense } from "react";
import { PageLoader } from "src/components/page-loader";
import ScrollToTopHandler from "src/components/scroll-to-top-handler";
import type { Locale } from "src/lib/i18n/config";
import { generateProductsMetadata } from "src/lib/seo/metadata";
import ProductsSectionDatabase from "./products-section-database";

interface ProductsPageProps {
	params: Promise<{ lang: Locale }>;
	searchParams?: Promise<{
		category?: string | string[];
	}>;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
	const { lang: locale } = await params;
	return generateProductsMetadata(locale);
}

export default function SuspendedProductsPage({
	params,
	searchParams,
}: ProductsPageProps) {
	return (
		<Suspense fallback={<PageLoader />}>
			<ProductsPage params={params} searchParams={searchParams} />
		</Suspense>
	);
}

async function ProductsPage({ params, searchParams }: ProductsPageProps) {
	const { lang: locale } = await params;
	const resolvedSearchParams = await searchParams;

	const categoryParam = resolvedSearchParams?.category;
	const initialCategory = Array.isArray(categoryParam)
		? categoryParam[0] || null
		: categoryParam || null;

	return (
		<>
			<ScrollToTopHandler />

			<ProductsSectionDatabase
				locale={locale}
				showHeader={false}
				viewAll
				initialCategory={initialCategory}
			/>
		</>
	);
}