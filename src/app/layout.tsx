import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import {
	Archivo,
	Barlow,
	Barlow_Condensed,
	Be_Vietnam_Pro,
	Big_Shoulders,
	Bricolage_Grotesque,
	Chakra_Petch,
	IBM_Plex_Mono,
	IBM_Plex_Sans,
	Inter,
	JetBrains_Mono,
	Lora,
	Merriweather,
	Montserrat,
	Noto_Sans,
	Nunito_Sans,
	Open_Sans,
	Raleway,
	Roboto,
	Saira_Condensed,
	Source_Sans_3,
	Unbounded,
} from "next/font/google";
import type React from "react";
import type { CSSProperties } from "react";
import { getSiteFontFamilyValue } from "src/lib/font-presets";
import { getSiteAppearance } from "src/server/site-appearance";
import "./globals.css";

/*
 * Every font the admin can pick in Admin > Giao diện (see src/lib/font-presets.ts).
 * Only one is applied at a time through --site-font. preload is off so the browser
 * downloads just the font that is actually used on the page.
 */
const bigShoulders = Big_Shoulders({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-big-shoulders",
});

const bricolageGrotesque = Bricolage_Grotesque({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-bricolage-grotesque",
});

const unbounded = Unbounded({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-unbounded",
});

const chakraPetch = Chakra_Petch({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-chakra-petch",
	weight: ["300", "400", "500", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-barlow-condensed",
	weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const sairaCondensed = Saira_Condensed({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-saira-condensed",
	weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const archivo = Archivo({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-archivo",
});

const beVietnamPro = Be_Vietnam_Pro({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-be-vietnam-pro",
	weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const barlow = Barlow({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-barlow",
	weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const ibmPlexSans = IBM_Plex_Sans({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-ibm-plex-sans",
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-jetbrains-mono",
});

const ibmPlexMono = IBM_Plex_Mono({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-ibm-plex-mono",
	weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-montserrat",
});

const roboto = Roboto({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-roboto",
});

const inter = Inter({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-inter",
});

const openSans = Open_Sans({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-open-sans",
});

const notoSans = Noto_Sans({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-noto-sans",
});

const nunitoSans = Nunito_Sans({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-nunito-sans",
});

const sourceSans3 = Source_Sans_3({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-source-sans-3",
});

const raleway = Raleway({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-raleway",
});

const lora = Lora({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-lora",
});

const merriweather = Merriweather({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	preload: false,
	variable: "--font-merriweather",
});

const fontVariableClasses = [
	bigShoulders.variable,
	bricolageGrotesque.variable,
	unbounded.variable,
	chakraPetch.variable,
	barlowCondensed.variable,
	sairaCondensed.variable,
	archivo.variable,
	beVietnamPro.variable,
	barlow.variable,
	ibmPlexSans.variable,
	jetbrainsMono.variable,
	ibmPlexMono.variable,
	montserrat.variable,
	roboto.variable,
	inter.variable,
	openSans.variable,
	notoSans.variable,
	nunitoSans.variable,
	sourceSans3.variable,
	raleway.variable,
	lora.variable,
	merriweather.variable,
].join(" ");

export const metadata: Metadata = {
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://nghiephung.com",
	),
	title: {
		default: "Công ty TNHH Nghiệp Hưng - Hệ thống ống gió chuyên nghiệp",
		template: "%s | Nghiệp Hưng",
	},
	description:
		"Chuyên sản xuất và thi công hệ thống ống gió chất lượng cao, phục vụ các dự án công nghiệp và dân dụng",
	keywords: [
		"ống gió",
		"hệ thống thông gió",
		"thi công ống gió",
		"sản xuất ống gió",
		"ống gió công nghiệp",
		"nghiệp hưng",
		"air duct",
		"ventilation system",
	],
	authors: [{ name: "Nghiệp Hưng" }],
	creator: "Nghiệp Hưng",
	publisher: "Nghiệp Hưng",
	generator: "v0.app",
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon.ico",
		apple: "/favicon.ico",
	},
	openGraph: {
		type: "website",
		locale: "vi_VN",
		alternateLocale: ["en_US"],
		siteName: "Nghiệp Hưng",
		title: "Công ty TNHH Nghiệp Hưng - Hệ thống ống gió chuyên nghiệp",
		description:
			"Chuyên sản xuất và thi công hệ thống ống gió chất lượng cao, phục vụ các dự án công nghiệp và dân dụng",
		images: [
			{
				url: "/construction_placeholder.png",
				width: 1200,
				height: 630,
				alt: "Nghiệp Hưng - Hệ thống ống gió chuyên nghiệp",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Công ty TNHH Nghiệp Hưng - Hệ thống ống gió chuyên nghiệp",
		description:
			"Chuyên sản xuất và thi công hệ thống ống gió chất lượng cao, phục vụ các dự án công nghiệp và dân dụng",
		images: ["/construction_placeholder.png"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

type SiteFontStyle = CSSProperties & {
	"--site-font": string;
};

/**
 * Root application layout
 * @param props - Root layout props
 * @returns Root layout with the site font variable
 */
export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const siteAppearance = await getSiteAppearance();

	const siteFontStyle: SiteFontStyle = {
		"--site-font": getSiteFontFamilyValue(siteAppearance.fontId),
	};

	return (
		<html
			lang="vi"
			style={siteFontStyle}
			className={`${fontVariableClasses} antialiased`}
		>
			<body className="font-sans">
				{children}
				<Analytics />
			</body>
		</html>
	);
}
