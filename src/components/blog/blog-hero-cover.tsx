import type { BlogImage } from "src/server/blogs";

interface BlogHeroCoverProps {
	image: BlogImage | null;
	locale: "vi" | "en";
	title: string;
}

/**
 * Fixed editorial frame for the blog cover image.
 * The frame stays stable and the image fills the frame without changing layout.
 * @param props - Blog hero cover props
 * @returns Blog cover image block
 */
export function BlogHeroCover({ image, locale, title }: BlogHeroCoverProps) {
	if (!image?.url) return null;

	return (
		<figure className="mt-8 overflow-hidden border border-[#E7D0AF] bg-[#F7F1E6] shadow-[0_18px_50px_rgba(52,35,18,0.07)]">
			<div className="relative h-[360px] w-full sm:h-[460px] lg:h-[540px] xl:h-[560px]">
				<img
					src={image.url}
					alt={image.alt?.[locale] || title}
					className="h-full w-full object-cover object-center"
				/>
			</div>

			{image.caption?.[locale] ? (
				<figcaption className="border-t border-[#E7D0AF]/70 px-5 py-3 text-sm italic text-[#342312]/60">
					{image.caption[locale]}
				</figcaption>
			) : null}
		</figure>
	);
}
