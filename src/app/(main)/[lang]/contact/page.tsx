import type { Metadata } from "next";
import { Suspense } from "react";
import { PageLoader } from "src/components/page-loader";
import ScrollToTopHandler from "src/components/scroll-to-top-handler";
import type { Locale } from "src/lib/i18n/config";
import { generateContactMetadata } from "src/lib/seo/metadata";
import { getHeroContactInfo } from "src/server/herocontact/get-herocontact-info.query";
import ContactSectionDatabase from "./contact-section-database";
import HeroContactBanner from "./hero-contact-banner";

interface ContactPageProps {
	params: Promise<{ lang: Locale }>;
}

/**
 * Generate metadata for contact page
 */
export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
	const { lang: locale } = await params;
	return generateContactMetadata(locale);
}

export default function SuspendedContactPage({ params }: ContactPageProps) {
	return (
		<Suspense fallback={<PageLoader />}>
			<ContactPage params={params} />
		</Suspense>
	);
}

/**
 * Contact page that displays database content
 */
async function ContactPage({ params }: ContactPageProps) {
	const { lang: locale } = await params;

	const heroContactInfo = await getHeroContactInfo();

	const heroContactTitle =
		locale === "vi"
			? heroContactInfo.title.vi
			: heroContactInfo.title.en;

	const heroContactDescription =
		locale === "vi"
			? heroContactInfo.description.vi
			: heroContactInfo.description.en;

	return (
		<>
			<ScrollToTopHandler />

			<HeroContactBanner
				locale={locale}
				title={heroContactTitle}
				description={heroContactDescription}
				gallery={heroContactInfo.gallery}
			/>

			<ContactSectionDatabase
				locale={locale}
				heroContactTitle={heroContactTitle}
				heroContactDescription={heroContactDescription}
			/>
		</>
	);
}