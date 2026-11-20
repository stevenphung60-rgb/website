import Image from "next/image";
import LocaleLink from "src/components/behaviors/LocaleLink";
import type { Locale } from "src/lib/i18n/config";

export interface ProjectGridCardProps {
	locale: Locale;
	projectId: string;
	name: string;
	categoryName?: string | null;
	imageUrl?: string | null;
	location?: string | null;
	year?: string | null;
	/** next/image sizes hint for the grid the card sits in */
	imageSizes?: string;
}

const LABELS = {
	vi: { location: "Địa điểm", time: "Thời gian" },
	en: { location: "Location", time: "Time" },
} as const;

/**
 * Project card used on the projects page and in "related projects":
 * image on top, white body with category, title, location and time; the whole card is the link.
 * Cards stretch to the row height so a grid row keeps one height.
 */
export function ProjectGridCard({
	locale,
	projectId,
	name,
	categoryName,
	imageUrl,
	location,
	year,
	imageSizes = "(min-width: 1280px) 300px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: ProjectGridCardProps) {
	const labels = LABELS[locale] ?? LABELS.vi;
	const details = [
		{ label: labels.location, value: location },
		{ label: labels.time, value: year },
	].filter((detail) => Boolean(detail.value?.trim()));

	return (
		<LocaleLink
			href={`/projects/${projectId}`}
			data-testid="project-card"
			className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-md border border-[#E7D0AF]/70 bg-white shadow-[0_1px_2px_rgba(52,35,18,0.04)] transition duration-300 ease-out hover:-translate-y-1 hover:border-[#A87E3C]/50 hover:shadow-[0_18px_40px_rgba(52,35,18,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A87E3C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F0] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
		>
			<div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#E7D0AF]/30">
				<Image
					src={imageUrl || "/placeholder.svg"}
					alt={name}
					fill
					sizes={imageSizes}
					className="object-cover transition duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
				/>
			</div>

			<div className="flex min-w-0 flex-1 flex-col px-5 pb-5 pt-5 sm:px-6 sm:pb-6 xl:px-5 xl:pb-5">
				{categoryName ? (
					<p className="line-clamp-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#A87E3C]">
						{categoryName}
					</p>
				) : null}

				<h3 className="mt-1 line-clamp-2 break-words pt-[0.2em] text-[22px] font-bold uppercase leading-[1.28] tracking-[0.01em] text-[#342312] transition-colors duration-300 group-hover:text-[#A87E3C] xl:text-[20px]">
					{name}
				</h3>

				{details.length > 0 ? (
					<dl className="mt-3 grid grid-cols-[5.75rem_minmax(0,1fr)] gap-x-3 gap-y-1">
						{details.map((detail) => (
							<div key={detail.label} className="contents">
								<dt className="text-[15px] font-semibold leading-snug text-[#342312]">
									{detail.label}
								</dt>
								<dd
									className="min-w-0 break-words text-[15px] leading-snug text-[#342312]/80"
								>
									{detail.value}
								</dd>
							</div>
						))}
					</dl>
				) : null}

			</div>
		</LocaleLink>
	);
}
