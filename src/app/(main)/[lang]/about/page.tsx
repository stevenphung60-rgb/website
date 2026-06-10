import type { Metadata } from "next";
import ScrollToTopHandler from "src/components/scroll-to-top-handler";
import type { Locale } from "src/lib/i18n/config";
import { generateAboutMetadata } from "src/lib/seo/metadata";
import { getHeroAboutInfo } from "src/server/heroabout";

import AboutBanner from "./about-banner";
import AboutBusinessPhilosophySection from "./about-business-philosophy-section";
import AboutCompanyHistorySection from "./about-company-history-section";
import AboutCoreValuesSection from "./about-core-values-section";
import AboutProductionCapabilitySection from "./about-production-capability-section";
import AboutRevealSection from "./about-reveal-section";
import AboutYoutubeSection from "./about-youtube-section";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
	const { lang: locale } = await params;
	return generateAboutMetadata(locale);
}

export default async function AboutPage({
	params,
}: Readonly<{
	params: Promise<{ lang: Locale }>;
}>) {
	const { lang: locale } = await params;
	const heroAboutInfo = await getHeroAboutInfo();

	return (
		<>
			<ScrollToTopHandler />

			<main className="w-full overflow-hidden bg-[#F7F1E6] text-[#342312]">
				<AboutBanner locale={locale} heroAboutInfo={heroAboutInfo} />
				<AboutYoutubeSection locale={locale} />
				<AboutCompanyHistorySection locale={locale} />
				<AboutBusinessPhilosophySection locale={locale} />
				<AboutCoreValuesSection locale={locale} />

				<AboutRevealSection variant="fade-up">
					<AboutProductionCapabilitySection locale={locale} />
				</AboutRevealSection>
			</main>
		</>
	);
}