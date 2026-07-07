import type { CSSProperties } from "react";
import { getSiteFontFamilyValue, type SiteFontId } from "src/lib/font-presets";
import type { BlogAppearanceSettings, BlogFontSelection } from "src/server/blogs";

const bodySizeClass = {
	compact: "text-[16px]",
	standard: "text-[18px]",
	comfortable: "text-[19px]",
	large: "text-[20px]",
} satisfies Record<BlogAppearanceSettings["bodySize"], string>;

const lineHeightClass = {
	compact: "leading-8",
	standard: "leading-[1.85]",
	relaxed: "leading-[2]",
} satisfies Record<BlogAppearanceSettings["lineHeight"], string>;

const widthClass = {
	narrow: "max-w-3xl",
	standard: "max-w-[860px]",
	wide: "max-w-5xl",
} satisfies Record<BlogAppearanceSettings["contentWidth"], string>;

function getFontValue(fontId: BlogFontSelection, fallback: "heading" | "body") {
	if (fontId === "site") {
		return fallback === "heading" ? "var(--site-font-heading)" : "var(--site-font-body)";
	}

	return getSiteFontFamilyValue(fontId as SiteFontId);
}

function sanitizeBlogHtml(html: string): string {
	return html
		.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
		.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
		.replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
		.replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, "")
		.replace(/<embed[\s\S]*?>[\s\S]*?<\/embed>/gi, "")
		.replace(/\son\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
		.replace(/href=("|')javascript:[\s\S]*?\1/gi, 'href="#"')
		.replace(/src=("|')javascript:[\s\S]*?\1/gi, 'src=""');
}

interface BlogContentRendererProps {
	html: string;
	appearance: BlogAppearanceSettings;
}

type BlogContentStyle = CSSProperties & {
	"--blog-heading-font": string;
	"--blog-body-font": string;
};

/**
 * Render blog HTML content with controlled typography and basic sanitation.
 * @param props - Blog content renderer props
 * @returns Blog article content
 */
export function BlogContentRenderer({ html, appearance }: BlogContentRendererProps) {
	const headingFont = getFontValue(appearance.headingFontId, "heading");
	const bodyFont = getFontValue(appearance.bodyFontId, "body");
	const style: BlogContentStyle = {
		"--blog-heading-font": headingFont,
		"--blog-body-font": bodyFont,
		fontFamily: bodyFont,
	};

	return (
		<div className={["mx-auto w-full", widthClass[appearance.contentWidth]].join(" ")}>
			<style>{`
				.blog-rich-content {
					font-family: var(--blog-body-font);
				}

				.blog-rich-content h1,
				.blog-rich-content h2,
				.blog-rich-content h3 {
					font-family: var(--blog-heading-font);
					font-weight: 760;
					line-height: 1.18;
					color: #342312;
					margin-top: 2.6rem;
					margin-bottom: 1rem;
					letter-spacing: -0.01em;
				}

				.blog-rich-content h1 { font-size: clamp(2.15rem, 4vw, 3.4rem); }
				.blog-rich-content h2 { font-size: clamp(1.8rem, 3vw, 2.55rem); }
				.blog-rich-content h3 { font-size: clamp(1.35rem, 2.2vw, 1.9rem); }

				.blog-rich-content p {
					margin: 1.15rem 0;
					color: rgb(52 35 18 / 0.78);
				}

				.blog-rich-content strong,
				.blog-rich-content b {
					color: #342312;
					font-weight: 760;
				}

				.blog-rich-content a {
					color: #A87E3C;
					font-weight: 700;
					text-decoration: underline;
					text-underline-offset: 4px;
				}

				.blog-rich-content ul,
				.blog-rich-content ol {
					margin: 1.1rem 0;
					padding-left: 1.5rem;
					color: rgb(52 35 18 / 0.78);
				}

				.blog-rich-content ul { list-style: disc; }
				.blog-rich-content ol { list-style: decimal; }
				.blog-rich-content li { margin: 0.45rem 0; }

				.blog-rich-content blockquote {
					margin: 1.75rem 0;
					border-left: 3px solid #A87E3C;
					background: #F7F1E6;
					padding: 1.15rem 1.35rem;
					font-style: italic;
					font-weight: 600;
					color: #342312;
				}

				.blog-rich-content img {
					max-width: 100%;
					height: auto;
					border-radius: 0.75rem;
					border: 1px solid #E7D0AF;
					margin: 1.75rem 0;
				}

				.blog-rich-content table {
					width: 100%;
					border-collapse: collapse;
					margin: 1.75rem 0;
					background: white;
				}

				.blog-rich-content td,
				.blog-rich-content th {
					border: 1px solid #E7D0AF;
					padding: 0.8rem;
					text-align: left;
				}
			`}</style>

			<div
				className={[
					"blog-rich-content text-[#342312]",
					bodySizeClass[appearance.bodySize],
					lineHeightClass[appearance.lineHeight],
				].join(" ")}
				style={style}
				dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(html) }}
			/>
		</div>
	);
}
