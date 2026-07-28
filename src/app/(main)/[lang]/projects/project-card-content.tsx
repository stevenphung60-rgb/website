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
		<LocaleLink href={`/projects/${project.id}`} className="block h-full min-w-0 md:h-auto">
			<Card
				data-testid="project-card"
				className="
					group relative h-full min-h-[310px] min-w-0 overflow-hidden
					!rounded-none border border-[#342312]/20
					bg-[#342312] py-0
					cursor-pointer
					transition-all duration-500 ease-out
					hover:-translate-y-1
					hover:border-[#A87E3C]/70
					hover:shadow-[0_28px_80px_rgba(52,35,18,0.28)]
					md:h-auto
					md:min-h-[520px]
					lg:min-h-[440px]
				"
			>
				<Image
					src={mainImage?.url || "/placeholder.svg"}
					alt={projectName}
					fill
					sizes="(max-width: 767px) 50vw, (max-width: 1120px) 100vw, 1120px"
					className="
						object-cover
						transition duration-700 ease-out
						group-hover:scale-[1.045]
					"
				/>

				<div className="absolute inset-0 bg-gradient-to-t from-[#342312] via-[#342312]/70 to-[#342312]/10 lg:bg-gradient-to-r lg:from-[#342312]/10 lg:via-[#342312]/55 lg:to-[#342312]" />

				<div className="absolute inset-0 bg-[#342312]/10 mix-blend-multiply" />

				<div className="absolute inset-0 border border-[#E7D0AF]/20 transition duration-500 group-hover:border-[#A87E3C]/70" />

				<div className="absolute left-3 top-3 z-20 flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 md:left-7 md:top-7 md:max-w-[calc(100%-3.5rem)] md:gap-3">
					<span className="h-px w-4 shrink-0 bg-[#F7F1E6] md:w-9" />

					<p className="line-clamp-1 min-w-0 text-[8px] font-black uppercase tracking-[0.08em] text-[#F7F1E6] drop-shadow-sm md:text-[12px] md:tracking-[0.24em]">
						{projectCategoryName}
					</p>
				</div>

				<CardContent className="relative z-10 flex min-h-[310px] w-full min-w-0 flex-col justify-end p-3 pt-14 md:min-h-[520px] md:p-7 md:pt-24 lg:ml-auto lg:min-h-[440px] lg:w-[54%] lg:justify-center lg:p-10 xl:w-[52%] xl:p-12">
					<CardTitle
						className="
							mb-2 line-clamp-2 break-words text-[15px] font-black uppercase
							leading-[1.15] tracking-[-0.02em]
							text-[#F7F1E6]
							transition-colors duration-300
							group-hover:text-[#E7D0AF]
							md:mb-5 md:line-clamp-3 md:text-[40px]
							md:leading-[1.03] md:tracking-[-0.04em]
							lg:text-[42px]
							xl:text-[48px]
						"
					>
						{projectName}
					</CardTitle>

					{projectLocation || projectYear ? (
						<div className="mb-2 space-y-1.5 border-y border-[#E7D0AF]/22 py-2 md:mb-5 md:space-y-3 md:py-4 lg:py-5">
							{projectLocation ? (
								<div className="flex min-w-0 items-start gap-1.5 md:gap-3">
									<MapPin className="mt-0.5 size-3 shrink-0 text-[#E7D0AF] md:mt-1 md:size-4" />

									<div className="min-w-0 flex-1 truncate text-[10px] leading-4 text-[#F7F1E6]/88 md:text-[15px] md:leading-6">
										<span className="hidden font-light text-[#E7D0AF]/72 md:inline">
											{locationLabel}:{" "}
										</span>

										<span className="font-bold">{projectLocation}</span>
									</div>
								</div>
							) : null}

							{projectYear ? (
								<div className="flex min-w-0 items-start gap-1.5 md:gap-3">
									<Calendar className="mt-0.5 size-3 shrink-0 text-[#E7D0AF] md:mt-1 md:size-4" />

									<div className="min-w-0 flex-1 truncate text-[10px] leading-4 text-[#F7F1E6]/88 md:text-[15px] md:leading-6">
										<span className="hidden font-light text-[#E7D0AF]/72 md:inline">
											{timeLabel}:{" "}
										</span>

										<span className="font-bold">{projectYear}</span>
									</div>
								</div>
							) : null}
						</div>
					) : null}

					{projectDescription ? (
						<p className="hidden max-w-2xl text-[15px] leading-[1.85] text-[#F7F1E6]/72 md:line-clamp-2">
							{projectDescription}
						</p>
					) : null}
				</CardContent>
			</Card>
		</LocaleLink>
	);
}
