import type { Metadata } from "next";
import { Suspense } from "react";
import ScrollToTopHandler from "src/components/scroll-to-top-handler";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import { generateServicesMetadata } from "src/lib/seo/metadata";
import { getHeroServiceInfo } from "src/server/heroservice/get-heroservice-info.query";
import HeroServiceBanner from "./hero-service-banner";
import ServicesPageLoading from "./services-page-loading";
import ServicesSectionDatabase from "./services-section-database";

interface ServicesPageProps {
	params: Promise<{ lang: Locale }>;
}

/**
 * Generate metadata for services page
 */
export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
	const { lang: locale } = await params;
	return generateServicesMetadata(locale);
}

export default function SuspendedServicesPage({ params }: ServicesPageProps) {
	return (
		<Suspense fallback={<ServicesPageLoading />}>
			<ServicesPage params={params} />
		</Suspense>
	);
}

/**
 * Services page that displays database content
 */
async function ServicesPage({ params }: ServicesPageProps) {
	const { lang: locale } = await params;
	const dictionary = getDictionary(locale);

	const heroServiceInfo = await getHeroServiceInfo();

	const defaultHeroServiceTitle =
		locale === "vi"
			? `${dictionary.services.title} ${dictionary.services.subtitle}`
			: `${dictionary.services.title} ${dictionary.services.subtitle}`;

	const heroServiceTitle =
		locale === "vi"
			? heroServiceInfo.title.vi || defaultHeroServiceTitle
			: heroServiceInfo.title.en || defaultHeroServiceTitle;

	const heroServiceDescription =
		locale === "vi"
			? heroServiceInfo.description.vi || dictionary.services.description
			: heroServiceInfo.description.en || dictionary.services.description;

	return (
		<>
			<ScrollToTopHandler />

			<HeroServiceBanner
				locale={locale}
				title={heroServiceTitle}
				description={heroServiceDescription}
				gallery={heroServiceInfo.gallery}
			/>

			<ServicesSectionDatabase locale={locale} viewAll />
		</>
	);
}