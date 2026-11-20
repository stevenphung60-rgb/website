import type { Metadata } from "next";
import { Suspense } from "react";
import Prefetch from "src/components/behaviors/prefetch";
import { PageLoader } from "src/components/page-loader";
import type { Locale } from "src/lib/i18n/config";
import { generateHomeMetadata } from "src/lib/seo/metadata";
import { getHeroInfo } from "src/server/hero";

import AboutProductionCapabilitySection from "./about/about-production-capability-section";
import HomeFeaturedClientsSection from "./home-featured-clients-section";
import HomeFeaturedProjectsSection from "./home-featured-projects-section";
import HeroSection from "./home-hero-section";
import HomeMachineryTechnologySection from "./home-machinery-technology-section";
import HomeProductsSectionDatabase from "./home-products-section-database";
import HomeServicesSection from "./home-services-section";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
	const { lang: locale } = await params;
	return generateHomeMetadata(locale);
}

export default async function HomePage({
	params,
}: {
	params: Promise<{ lang: Locale }>;
}) {
	const { lang: locale } = await params;

	return (
		<Suspense fallback={<PageLoader />}>
			<HomePageContent locale={locale} />
		</Suspense>
	);
}

async function HomePageContent({ locale }: { locale: Locale }) {
	const heroInfo = await getHeroInfo();

	return (
		<>
			<HeroSection locale={locale} heroInfo={heroInfo} />

			<Prefetch url={`/${locale}/products`} />
			<Prefetch url={`/${locale}/services`} />
			<Prefetch url={`/${locale}/projects`} />
			<Prefetch url={`/${locale}/contact`} />

			<HomeProductsSectionDatabase locale={locale} heroInfo={heroInfo} />
			<HomeServicesSection locale={locale} heroInfo={heroInfo} />
			<AboutProductionCapabilitySection locale={locale} />
			<HomeMachineryTechnologySection locale={locale} heroInfo={heroInfo} />
			<HomeFeaturedClientsSection locale={locale} heroInfo={heroInfo} />
			<HomeFeaturedProjectsSection locale={locale} heroInfo={heroInfo} />
		</>
	);
}