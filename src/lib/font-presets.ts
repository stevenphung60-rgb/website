export const SITE_APPEARANCE_ID = "site-appearance";

/**
 * Font groups shown in the admin font picker
 */
export const SITE_FONT_GROUPS = {
	display: "Tiêu đề, cá tính mạnh",
	professional: "Tiêu đề, chuyên nghiệp",
	text: "Nội dung, dễ đọc",
	mono: "Số liệu, mã sản phẩm",
	classic: "Font phổ biến",
} as const;

export type SiteFontGroup = keyof typeof SITE_FONT_GROUPS;

interface SiteFontOptionConfig {
	label: string;
	cssVariable: string;
	group: SiteFontGroup;
	fallback: string;
}

/**
 * Every font the admin can choose from.
 * Exactly one of them is applied to the whole website (public pages, blog and admin)
 * through the --site-font CSS variable. Each one is loaded in src/app/layout.tsx.
 */
export const SITE_FONT_OPTIONS = {
	bigShoulders: {
		label: "Big Shoulders",
		cssVariable: "--font-big-shoulders",
		group: "display",
		fallback: "sans-serif",
	},
	bricolageGrotesque: {
		label: "Bricolage Grotesque",
		cssVariable: "--font-bricolage-grotesque",
		group: "display",
		fallback: "sans-serif",
	},
	unbounded: {
		label: "Unbounded",
		cssVariable: "--font-unbounded",
		group: "display",
		fallback: "sans-serif",
	},
	chakraPetch: {
		label: "Chakra Petch",
		cssVariable: "--font-chakra-petch",
		group: "display",
		fallback: "sans-serif",
	},
	barlowCondensed: {
		label: "Barlow Condensed",
		cssVariable: "--font-barlow-condensed",
		group: "professional",
		fallback: "sans-serif",
	},
	sairaCondensed: {
		label: "Saira Condensed",
		cssVariable: "--font-saira-condensed",
		group: "professional",
		fallback: "sans-serif",
	},
	archivo: {
		label: "Archivo",
		cssVariable: "--font-archivo",
		group: "professional",
		fallback: "sans-serif",
	},
	beVietnamPro: {
		label: "Be Vietnam Pro",
		cssVariable: "--font-be-vietnam-pro",
		group: "text",
		fallback: "sans-serif",
	},
	barlow: {
		label: "Barlow",
		cssVariable: "--font-barlow",
		group: "text",
		fallback: "sans-serif",
	},
	ibmPlexSans: {
		label: "IBM Plex Sans",
		cssVariable: "--font-ibm-plex-sans",
		group: "text",
		fallback: "sans-serif",
	},
	jetbrainsMono: {
		label: "JetBrains Mono",
		cssVariable: "--font-jetbrains-mono",
		group: "mono",
		fallback: "monospace",
	},
	ibmPlexMono: {
		label: "IBM Plex Mono",
		cssVariable: "--font-ibm-plex-mono",
		group: "mono",
		fallback: "monospace",
	},
	montserrat: {
		label: "Montserrat",
		cssVariable: "--font-montserrat",
		group: "classic",
		fallback: "sans-serif",
	},
	roboto: {
		label: "Roboto",
		cssVariable: "--font-roboto",
		group: "classic",
		fallback: "sans-serif",
	},
	inter: {
		label: "Inter",
		cssVariable: "--font-inter",
		group: "classic",
		fallback: "sans-serif",
	},
	openSans: {
		label: "Open Sans",
		cssVariable: "--font-open-sans",
		group: "classic",
		fallback: "sans-serif",
	},
	notoSans: {
		label: "Noto Sans",
		cssVariable: "--font-noto-sans",
		group: "classic",
		fallback: "sans-serif",
	},
	nunitoSans: {
		label: "Nunito Sans",
		cssVariable: "--font-nunito-sans",
		group: "classic",
		fallback: "sans-serif",
	},
	sourceSans3: {
		label: "Source Sans 3",
		cssVariable: "--font-source-sans-3",
		group: "classic",
		fallback: "sans-serif",
	},
	raleway: {
		label: "Raleway",
		cssVariable: "--font-raleway",
		group: "classic",
		fallback: "sans-serif",
	},
	lora: {
		label: "Lora",
		cssVariable: "--font-lora",
		group: "classic",
		fallback: "serif",
	},
	merriweather: {
		label: "Merriweather",
		cssVariable: "--font-merriweather",
		group: "classic",
		fallback: "serif",
	},
} as const satisfies Record<string, SiteFontOptionConfig>;

export type SiteFontId = keyof typeof SITE_FONT_OPTIONS;

/** Font used when nothing has been saved yet (the previous body font) */
export const DEFAULT_SITE_FONT_ID: SiteFontId = "roboto";

export interface SiteAppearance {
	id: typeof SITE_APPEARANCE_ID;
	fontId: SiteFontId;
}

export const DEFAULT_SITE_APPEARANCE: SiteAppearance = {
	id: SITE_APPEARANCE_ID,
	fontId: DEFAULT_SITE_FONT_ID,
};

/**
 * Check whether a value is a supported site font ID
 * @param value - Value to check
 * @returns Whether value is a site font ID
 */
export function isSiteFontId(value: unknown): value is SiteFontId {
	return typeof value === "string" && Object.hasOwn(SITE_FONT_OPTIONS, value);
}

/**
 * Get CSS font-family value for a font
 * @param fontId - Site font ID
 * @returns CSS font-family value using the font's CSS variable
 */
export function getSiteFontFamilyValue(fontId: SiteFontId): string {
	const font = SITE_FONT_OPTIONS[fontId];
	return `var(${font.cssVariable}), ${font.fallback}`;
}

/**
 * Fonts grouped for the admin picker, in display order
 * @returns Groups with their fonts
 */
export function getSiteFontsByGroup(): {
	group: SiteFontGroup;
	label: string;
	fonts: { id: SiteFontId; label: string }[];
}[] {
	const entries = Object.entries(SITE_FONT_OPTIONS) as [
		SiteFontId,
		(typeof SITE_FONT_OPTIONS)[SiteFontId],
	][];

	return (Object.keys(SITE_FONT_GROUPS) as SiteFontGroup[]).map((group) => ({
		group,
		label: SITE_FONT_GROUPS[group],
		fonts: entries
			.filter(([, font]) => font.group === group)
			.map(([id, font]) => ({ id, label: font.label })),
	}));
}

/**
 * Normalize site appearance data from database or form input.
 * Older documents stored a heading and a body font; the body font is kept as the site font.
 * @param input - Stored or submitted appearance data
 * @returns Valid site appearance data
 */
export function normalizeSiteAppearance(
	input?: { fontId?: unknown; bodyFontId?: unknown } | null,
): SiteAppearance {
	const fontId = isSiteFontId(input?.fontId)
		? input.fontId
		: isSiteFontId(input?.bodyFontId)
			? input.bodyFontId
			: DEFAULT_SITE_FONT_ID;

	return {
		id: SITE_APPEARANCE_ID,
		fontId,
	};
}
