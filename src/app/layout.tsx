import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import {
	Be_Vietnam_Pro,
	Inter,
	Lora,
	Merriweather,
	Montserrat,
	Noto_Sans,
	Nunito_Sans,
	Open_Sans,
	Raleway,
	Roboto,
	Source_Sans_3,
} from "next/font/google";
import type React from "react";
import type { CSSProperties } from "react";
import { getSiteFontFamilyValue } from "src/lib/font-presets";
import { getSiteAppearance } from "src/server/site-appearance";
import "./globals.css";

const montserrat = Montserrat({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	variable: "--font-montserrat",
	weight: ["400", "600", "700"],
});

const openSans = Open_Sans({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	variable: "--font-open-sans",
	weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	variable: "--font-roboto",
	weight: ["400", "500", "700"],
});

const raleway = Raleway({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	variable: "--font-raleway",
	weight: ["400", "500", "600", "700", "800", "900"],
});

const beVietnamPro = Be_Vietnam_Pro({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	variable: "--font-be-vietnam-pro",
	weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	variable: "--font-inter",
	weight: ["400", "500", "600", "700", "800"],
});

const notoSans = Noto_Sans({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	variable: "--font-noto-sans",
	weight: ["400", "500", "600", "700", "800"],
});

const nunitoSans = Nunito_Sans({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	variable: "--font-nunito-sans",
	weight: ["400", "500", "600", "700", "800"],
});

const sourceSans3 = Source_Sans_3({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	variable: "--font-source-sans-3",
	weight: ["400", "500", "600", "700", "800"],
});

const lora = Lora({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	variable: "--font-lora",
	weight: ["400", "500", "600", "700"],
});

const merriweather = Merriweather({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	variable: "--font-merriweather",
	weight: ["400", "700", "900"],
});

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
	"--site-font-heading": string;
	"--site-font-body": string;
};

/**
 * Root application layout
 * @param props - Root layout props
 * @returns Root layout with site font variables
 */
export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const siteAppearance = await getSiteAppearance();

	const siteFontStyle: SiteFontStyle = {
		"--site-font-heading": getSiteFontFamilyValue(
			siteAppearance.headingFontId,
		),
		"--site-font-body": getSiteFontFamilyValue(siteAppearance.bodyFontId),
	};

	return (
		<html
			lang="vi"
			style={siteFontStyle}
			className={`${montserrat.variable} ${openSans.variable} ${roboto.variable} ${raleway.variable} ${beVietnamPro.variable} ${inter.variable} ${notoSans.variable} ${nunitoSans.variable} ${sourceSans3.variable} ${lora.variable} ${merriweather.variable} antialiased`}
		>
			<body className="font-sans">
				{children}
				<Analytics />
			</body>
		</html>
	);
}
