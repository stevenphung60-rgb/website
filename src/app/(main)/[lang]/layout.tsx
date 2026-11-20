import type React from "react";
import { Suspense } from "react";
import { FloatingContactButtons } from "src/components/floating-contact-buttons";
import { FooterPlaceholder, HeaderPlaceholder } from "src/components/page-loader";
import { OrganizationSchema, WebsiteSchema } from "src/components/seo/json-ld";
import type { Locale } from "src/lib/i18n/config";
import { getContactInfo } from "src/server/contact";
import SplashScreenProvider from "../../splash-screen-provider";
import Footer from "./layout/footer";
import Header from "./layout/header";

export async function generateStaticParams() {
	return [{ lang: "en" }, { lang: "vi" }];
}

export default async function MainLayout({
	params,
	children,
}: Readonly<{
	params: Promise<{ lang: Locale }>;
	children: React.ReactNode;
}>) {
	const { lang: locale } = await params;
	const contactInfo = await getContactInfo();

	const facebookUrl = contactInfo.socialMedia?.find(
		(item) => item.platformId === "facebook",
	)?.url;


	return (
		<>
			<OrganizationSchema locale={locale} />
			<WebsiteSchema locale={locale} />

			<SplashScreenProvider>
				<div className="min-h-screen">
					<Suspense fallback={<HeaderPlaceholder />}>
						<Header locale={locale} />
					</Suspense>

					<main>{children}</main>

					<Suspense fallback={<FooterPlaceholder />}>
						<Footer locale={locale} />
					</Suspense>

					<FloatingContactButtons
						phone={contactInfo.phone1}
						facebook={facebookUrl}
						
					/>
				</div>
			</SplashScreenProvider>
		</>
	);
}