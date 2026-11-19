import type { BlogAppearanceSettings } from "src/server/blogs";

const bodySizeClass = {
	compact: "text-[16px]",
	standard: "text-[17px]",
	comfortable: "text-[18px]",
	large: "text-[19px]",
} satisfies Record<BlogAppearanceSettings["bodySize"], string>;

const lineHeightClass = {
	compact: "leading-7",
	standard: "leading-8",
	relaxed: "leading-9",
} satisfies Record<BlogAppearanceSettings["lineHeight"], string>;

const widthClass = {
	narrow: "max-w-[760px]",
	standard: "max-w-[840px]",
	wide: "max-w-[980px]",
} satisfies Record<BlogAppearanceSettings["contentWidth"], string>;

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

/**
 * Render blog HTML content with controlled typography and basic sanitation.
 * @param props - Blog content renderer props
 * @returns Blog article content
 */
export function BlogContentRenderer({ html, appearance }: BlogContentRendererProps) {
	return (
		<div className={["w-full", widthClass[appearance.contentWidth]].join(" ")}>
			<style>{`
				/* One font for the whole website: also overrides fonts picked per paragraph in older posts */
				.blog-rich-content,
				.blog-rich-content * {
					font-family: var(--site-font) !important;
				}

				.blog-rich-content h1,
				.blog-rich-content h2,
				.blog-rich-content h3 {
					font-weight: 700;
					line-height: 1.18;
					color: #342312;
					margin-top: 2.1rem;
					margin-bottom: 0.95rem;
				}

				.blog-rich-content h1 { font-size: clamp(2rem, 4vw, 3.25rem); }
				.blog-rich-content h2 { font-size: clamp(1.65rem, 3vw, 2.35rem); }
				.blog-rich-content h3 { font-size: clamp(1.3rem, 2.2vw, 1.75rem); }

				.blog-rich-content p {
					margin: 1.05rem 0;
					color: rgb(52 35 18 / 0.78);
				}

				.blog-rich-content a {
					color: #A87E3C;
					font-weight: 700;
					text-decoration: underline;
					text-underline-offset: 4px;
				}

				.blog-rich-content ul,
				.blog-rich-content ol {
					margin: 1rem 0;
					padding-left: 1.5rem;
					color: rgb(52 35 18 / 0.78);
				}

				.blog-rich-content ul { list-style: disc; }
				.blog-rich-content ol { list-style: decimal; }
				.blog-rich-content li { margin: 0.45rem 0; }

				.blog-rich-content blockquote {
					margin: 1.7rem 0;
					border-left: 4px solid #A87E3C;
					background: #F4E9D8;
					padding: 1rem 1.25rem;
					font-style: italic;
					font-weight: 600;
					color: #342312;
				}

				.blog-rich-content img {
					max-width: 100%;
					height: auto;
					border: 1px solid #E7D0AF;
					margin: 1.5rem 0;
				}

				.blog-rich-content table {
					width: 100%;
					border-collapse: collapse;
					margin: 1.5rem 0;
					background: white;
				}

				.blog-rich-content td,
				.blog-rich-content th {
					border: 1px solid #E7D0AF;
					padding: 0.75rem;
					text-align: left;
				}
			`}</style>

			<div
				className={[
					"blog-rich-content bg-transparent text-[#342312]",
					bodySizeClass[appearance.bodySize],
					lineHeightClass[appearance.lineHeight],
				].join(" ")}
				dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(html) }}
			/>
		</div>
	);
}
