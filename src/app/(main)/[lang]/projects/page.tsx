import type { Metadata } from "next";
import { Suspense } from "react";
import { PageLoader } from "src/components/page-loader";
import ScrollToTopHandler from "src/components/scroll-to-top-handler";
import type { Locale } from "src/lib/i18n/config";
import { generateProjectsMetadata } from "src/lib/seo/metadata";
import { getHeroProjectInfo } from "src/server/heroproject/get-heroproject-info.query";
import HeroProjectBanner from "./hero-project-banner";
import ProjectsSectionDatabase from "./projects-section-database";

interface ProjectsPageProps {
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
	return generateProjectsMetadata(locale);
}

export default function SuspendedProjectsPage({
	params,
	searchParams,
}: ProjectsPageProps) {
	return (
		<Suspense fallback={<PageLoader />}>
			<ProjectsPage params={params} searchParams={searchParams} />
		</Suspense>
	);
}

async function ProjectsPage({ params, searchParams }: ProjectsPageProps) {
	const { lang: locale } = await params;
	const resolvedSearchParams = await searchParams;

	const categoryParam = resolvedSearchParams?.category;
	const initialCategory = Array.isArray(categoryParam)
		? categoryParam[0] || null
		: categoryParam || null;

	const heroProjectInfo = await getHeroProjectInfo();

	const heroProjectTitle =
		locale === "vi" ? heroProjectInfo.title.vi : heroProjectInfo.title.en;

	const heroProjectDescription =
		locale === "vi"
			? heroProjectInfo.description.vi
			: heroProjectInfo.description.en;

	return (
		<>
			<ScrollToTopHandler />

			<HeroProjectBanner
				locale={locale}
				title={heroProjectTitle}
				description={heroProjectDescription}
				gallery={heroProjectInfo.gallery}
			/>

			<ProjectsSectionDatabase
				locale={locale}
				viewAll={false}
				initialCategory={initialCategory}
			/>
		</>
	);
}