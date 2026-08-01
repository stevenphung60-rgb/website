import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import LocaleLink from "src/components/behaviors/LocaleLink";
import { Card, CardContent, CardTitle } from "src/components/ui/card";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import { getProjectCategoryById } from "src/server/projectcategories";
import type { Project } from "src/server/projects/project.type";

interface ProjectCardContentProps {
	project: Project;
	locale: Locale;
}

export async function ProjectCardContent({
	project,
	locale,
}: ProjectCardContentProps) {
	const dictionary = getDictionary(locale);

	const projectName = project.name[locale];
	const projectDescription = project.description[locale];
	const projectLocation = project.location?.[locale];
	const projectYear = project.year?.[locale];

	const projectCategory = project.categoryId
		? await getProjectCategoryById(project.categoryId)
		: null;

	const projectCategoryName =
		projectCategory?.name?.[locale] ?? dictionary.projects.filter.all;

	const mainImage =
		project.gallery?.find((img) => img.isMain) || project.gallery?.[0];

	const locationLabel = locale === "vi" ? "Địa điểm" : "Location";
	const timeLabel = locale === "vi" ? "Thời gian" : "Time";

	return (
		<LocaleLink
			href={`/projects/${project.id}`}
			className="block h-full min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A87E3C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F0] md:h-auto"
		>
			<Card
				data-testid="project-card"
				className="
					group relative h-full min-h-0 min-w-0 gap-0 overflow-hidden
					!rounded-none border border-[#A87E3C]/28
					bg-[#F7F1E6] py-0
					cursor-pointer
					transition-all duration-500 ease-out
					md:h-auto
					md:min-h-[520px]
					md:border-[#342312]/20
					md:bg-[#342312]
					md:hover:border-[#A87E3C]/70
					md:hover:-translate-y-1
					md:hover:shadow-[0_28px_80px_rgba(52,35,18,0.28)]
					lg:min-h-[440px]
				"
			>
				<div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#E7D0AF]/25 md:absolute md:inset-0 md:aspect-auto md:w-auto">
					<Image
						src={mainImage?.url || "/placeholder.svg"}
						alt={projectName}
						fill
						sizes="(max-width: 767px) 50vw, (max-width: 1120px) 100vw, 1120px"
						className="
							object-cover
							transition duration-700 ease-out
							md:group-hover:scale-[1.045]
							md:group-hover:brightness-[1.04]
							md:group-hover:saturate-[1.05]
						"
					/>

					<div className="absolute inset-0 bg-gradient-to-t from-[#342312]/18 via-transparent to-transparent md:bg-gradient-to-t md:from-[#342312]/76 md:via-[#342312]/22 lg:bg-gradient-to-r lg:from-transparent lg:via-[#342312]/18 lg:to-[#342312]/70" />
				</div>

				<div className="pointer-events-none absolute inset-0 border border-[#E7D0AF]/20 transition duration-500 md:group-hover:border-[#A87E3C]/70" />

				<div className="relative z-20 flex min-w-0 items-center gap-2 px-5 pb-0 pt-4 md:absolute md:left-7 md:top-7 md:max-w-[calc(100%-3.5rem)] md:gap-3 md:p-0">
					<span className="h-px w-6 shrink-0 bg-[#A87E3C] md:w-9 md:bg-[#F7F1E6]" />

					<p className="line-clamp-1 min-w-0 text-[11px] font-bold uppercase tracking-[0.1em] text-[#A87E3C] md:text-[12px] md:font-black md:tracking-[0.24em] md:text-[#F7F1E6] md:drop-shadow-sm">
						{projectCategoryName}
					</p>
				</div>

				<CardContent className="relative z-10 flex min-w-0 flex-1 flex-col bg-[#F7F1E6] p-5 pt-3 [text-shadow:none] md:min-h-[520px] md:flex-none md:justify-end md:bg-transparent md:p-7 md:pt-24 md:[text-shadow:0_2px_10px_rgba(22,14,6,0.72)] lg:ml-auto lg:min-h-[440px] lg:w-[54%] lg:justify-center lg:p-10 xl:w-[52%] xl:p-12">
					<CardTitle
						className="
							mb-3 line-clamp-2 break-words text-[20px] font-black uppercase
							leading-[1.22] tracking-[-0.02em]
							text-[#342312]
							transition-colors duration-300
							group-hover:text-[#A87E3C]
							md:mb-5 md:line-clamp-3 md:text-[40px]
							md:leading-[1.03] md:tracking-[-0.04em]
							md:text-[#F7F1E6]
							md:group-hover:text-[#E7D0AF]
							lg:text-[42px]
							xl:text-[48px]
						"
					>
						{projectName}
					</CardTitle>

					{projectLocation || projectYear ? (
						<div className="mb-3 space-y-2 border-y border-[#A87E3C]/22 py-3 md:mb-5 md:space-y-3 md:border-[#E7D0AF]/32 md:py-4 lg:py-5">
							{projectLocation ? (
								<div className="flex min-w-0 items-start gap-2.5 md:gap-3">
									<MapPin className="mt-0.5 size-4 shrink-0 text-[#A87E3C] md:mt-1 md:text-[#F0D5AB]" />

									<div className="min-w-0 flex-1 truncate text-[14px] font-semibold leading-5 text-[#5A3719] md:text-[15px] md:font-normal md:leading-6 md:text-[#F7F1E6]">
										<span className="font-medium text-[#A87E3C] md:text-[#F0D5AB]">
											{locationLabel}:{" "}
										</span>

										<span className="font-bold">{projectLocation}</span>
									</div>
								</div>
							) : null}

							{projectYear ? (
								<div className="flex min-w-0 items-start gap-2.5 md:gap-3">
									<Calendar className="mt-0.5 size-4 shrink-0 text-[#A87E3C] md:mt-1 md:text-[#F0D5AB]" />

									<div className="min-w-0 flex-1 truncate text-[14px] font-semibold leading-5 text-[#5A3719] md:text-[15px] md:font-normal md:leading-6 md:text-[#F7F1E6]">
										<span className="font-medium text-[#A87E3C] md:text-[#F0D5AB]">
											{timeLabel}:{" "}
										</span>

										<span className="font-bold">{projectYear}</span>
									</div>
								</div>
							) : null}
						</div>
					) : null}

					{projectDescription ? (
						<p className="line-clamp-3 text-[14px] leading-[1.65] text-[#6B5137] md:max-w-2xl md:line-clamp-2 md:text-[15px] md:font-medium md:leading-[1.85] md:text-[#F7F1E6]/95">
							{projectDescription}
						</p>
					) : null}
				</CardContent>
			</Card>
		</LocaleLink>
	);
}
