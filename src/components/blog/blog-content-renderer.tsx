import { getSiteFontFamilyValue, type SiteFontId } from "src/lib/font-presets";
import type {
	BlogAppearanceSettings,
	BlogContentBlock,
	BlogFontSelection,
} from "src/server/blogs";
import { renderBlogInlineContent } from "./blog-inline-content";

const bodySizeClass = {
	compact: "text-[15px]",
	standard: "text-[16px]",
	comfortable: "text-[17px]",
	large: "text-[18px]",
} satisfies Record<BlogAppearanceSettings["bodySize"], string>;

const lineHeightClass = {
	compact: "leading-7",
	standard: "leading-8",
	relaxed: "leading-9",
} satisfies Record<BlogAppearanceSettings["lineHeight"], string>;

const widthClass = {
	narrow: "max-w-3xl",
	standard: "max-w-4xl",
	wide: "max-w-6xl",
} satisfies Record<BlogAppearanceSettings["contentWidth"], string>;

function getFontValue(fontId: BlogFontSelection, fallback: "heading" | "body") {
	if (fontId === "site") {
		return fallback === "heading" ? "var(--site-font-heading)" : "var(--site-font-body)";
	}

	return getSiteFontFamilyValue(fontId as SiteFontId);
}

function paragraphSizeClass(size: string) {
	if (size === "small") return "text-sm";
	if (size === "large") return "text-lg";
	return "text-base";
}

function headingSizeClass(size: string, level: 2 | 3) {
	if (level === 2) {
		if (size === "xlarge") return "text-4xl";
		if (size === "large") return "text-3xl";
		return "text-2xl";
	}

	if (size === "xlarge") return "text-3xl";
	if (size === "large") return "text-2xl";
	return "text-xl";
}

interface BlogContentRendererProps {
	blocks: BlogContentBlock[];
	appearance: BlogAppearanceSettings;
}

/**
 * Render blog content blocks with controlled typography
 * @param props - Blog content renderer props
 * @returns Blog article content
 */
export function BlogContentRenderer({ blocks, appearance }: BlogContentRendererProps) {
	const headingFont = getFontValue(appearance.headingFontId, "heading");
	const bodyFont = getFontValue(appearance.bodyFontId, "body");

	return (
		<div
			className={["mx-auto w-full space-y-8", widthClass[appearance.contentWidth]].join(" ")}
			style={{ fontFamily: bodyFont }}
		>
			{blocks.map((block) => {
				if (block.type === "paragraph") {
					return (
						<p
							key={block.id}
							className={[
								paragraphSizeClass(block.size),
								lineHeightClass[appearance.lineHeight],
								"text-[#342312]/78",
								block.align === "center" ? "text-center" : "text-left",
							].join(" ")}
						>
							{renderBlogInlineContent(block.text)}
						</p>
					);
				}

				if (block.type === "heading") {
					const Tag = block.level === 2 ? "h2" : "h3";

					return (
						<Tag
							key={block.id}
							className={[
								headingSizeClass(block.size, block.level),
								"font-extrabold leading-tight text-[#342312]",
								block.align === "center" ? "text-center" : "text-left",
							].join(" ")}
							style={{ fontFamily: headingFont }}
						>
							{renderBlogInlineContent(block.text)}
						</Tag>
					);
				}

				if (block.type === "quote") {
					return (
						<blockquote
							key={block.id}
							className="border-l-4 border-[#A87E3C] bg-[#FAF7F1] px-5 py-4 text-lg font-semibold italic leading-8 text-[#342312]"
						>
							{renderBlogInlineContent(block.text)}
						</blockquote>
					);
				}

				if (block.type === "list") {
					const ListTag = block.style === "numbered" ? "ol" : "ul";

					return (
						<ListTag
							key={block.id}
							className={[
								"space-y-2 pl-6 text-[#342312]/78",
								block.style === "numbered" ? "list-decimal" : "list-disc",
								bodySizeClass[appearance.bodySize],
								lineHeightClass[appearance.lineHeight],
							].join(" ")}
						>
							{block.items.map((item, index) => (
								<li key={`${item}-${index}`}>{renderBlogInlineContent(item)}</li>
							))}
						</ListTag>
					);
				}

				if (block.type === "image") {
					return (
						<figure key={block.id} className="overflow-hidden rounded-2xl border border-[#E7D0AF] bg-white">
							<img
								src={block.image.url}
								alt={block.image.alt.vi || block.image.alt.en || "Blog image"}
								className="w-full object-cover"
							/>
							{block.image.caption?.vi || block.image.caption?.en ? (
								<figcaption className="border-t border-[#E7D0AF]/70 px-4 py-3 text-sm italic text-[#342312]/60">
									{block.image.caption.vi || block.image.caption.en}
								</figcaption>
							) : null}
						</figure>
					);
				}

				if (block.type === "gallery") {
					return (
						<div
							key={block.id}
							className={[
								"grid gap-4",
								block.columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
							].join(" ")}
						>
							{block.images.map((image) => (
								<figure key={image.url} className="overflow-hidden rounded-2xl border border-[#E7D0AF] bg-white">
									<img
										src={image.url}
										alt={image.alt.vi || image.alt.en || "Blog gallery image"}
										className="aspect-[4/3] w-full object-cover"
									/>
									{image.caption?.vi || image.caption?.en ? (
										<figcaption className="border-t border-[#E7D0AF]/70 px-3 py-2 text-xs italic text-[#342312]/60">
											{image.caption.vi || image.caption.en}
										</figcaption>
									) : null}
								</figure>
							))}
						</div>
					);
				}

				if (block.type === "table") {
					return (
						<div key={block.id} className="overflow-x-auto rounded-2xl border border-[#E7D0AF] bg-white">
							<table className="min-w-full divide-y divide-[#E7D0AF]/70 text-left text-sm text-[#342312]">
								<tbody className="divide-y divide-[#E7D0AF]/70">
									{block.rows.map((row, rowIndex) => (
										<tr key={`${block.id}-${rowIndex}`} className={rowIndex === 0 ? "bg-[#FAF7F1] font-semibold" : ""}>
											{row.map((cell, cellIndex) => (
												<td key={`${block.id}-${rowIndex}-${cellIndex}`} className="px-4 py-3 align-top">
													{renderBlogInlineContent(cell)}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					);
				}

				return null;
			})}
		</div>
	);
}
