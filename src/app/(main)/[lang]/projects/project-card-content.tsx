import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import LocaleLink from "src/components/behaviors/LocaleLink";
import { Card, CardContent, CardTitle } from "src/components/ui/card";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import { getProjectCategoryById } from "src/server/projectcategories";
import { type Project } from "src/server/projects/project.type";

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
		<LocaleLink href={`/projects/${project.id}`} className="block">
			<Card
				data-testid="project-card"
				className="
					group relative min-h-[460px] overflow-hidden
					!rounded-none border border-[#342312]/20
					bg-[#342312] py-0
					cursor-pointer
					transition-all duration-500 ease-out
					hover:-translate-y-1
					hover:border-[#A87E3C]/70
					hover:shadow-[0_28px_80px_rgba(52,35,18,0.28)]
					sm:min-h-[520px]
					lg:min-h-[440px]
				"
			>
				<Image
					src={mainImage?.url || "/placeholder.svg"}
					alt={projectName}
					fill
					className="
						object-cover
						transition duration-700 ease-out
						group-hover:scale-[1.045]
					"
				/>

				<div className="absolute inset-0 bg-gradient-to-t from-[#342312] via-[#342312]/70 to-[#342312]/10 lg:bg-gradient-to-r lg:from-[#342312]/10 lg:via-[#342312]/55 lg:to-[#342312]" />

				<div className="absolute inset-0 bg-[#342312]/10 mix-blend-multiply" />

				<div className="absolute inset-0 border border-[#E7D0AF]/20 transition duration-500 group-hover:border-[#A87E3C]/70" />

				<div className="absolute left-5 top-5 z-20 flex max-w-[calc(100%-2.5rem)] items-center gap-3 sm:left-7 sm:top-7 sm:max-w-[calc(100%-3.5rem)]">
					<span className="h-px w-9 shrink-0 bg-[#F7F1E6]" />

					<p className="line-clamp-1 min-w-0 text-[11px] font-black uppercase tracking-[0.2em] text-[#F7F1E6] drop-shadow-sm sm:text-[12px] sm:tracking-[0.24em]">
						{projectCategoryName}
					</p>
				</div>

				<CardContent className="relative z-10 flex min-h-[460px] w-full min-w-0 flex-col justify-end p-5 pt-20 sm:min-h-[520px] sm:p-7 sm:pt-24 lg:ml-auto lg:min-h-[440px] lg:w-[54%] lg:justify-center lg:p-10 xl:w-[52%] xl:p-12">
					<CardTitle
						className="
							mb-4 line-clamp-3 break-words text-[28px] font-black uppercase
							leading-[1.03] tracking-[-0.04em]
							text-[#F7F1E6]
							transition-colors duration-300
							group-hover:text-[#E7D0AF]
							sm:mb-5 sm:text-[40px]
							lg:text-[42px]
							xl:text-[48px]
						"
					>
						{projectName}
					</CardTitle>

					{projectLocation || projectYear ? (
						<div className="mb-4 space-y-2.5 border-y border-[#E7D0AF]/22 py-3.5 sm:mb-5 sm:space-y-3 sm:py-4 lg:py-5">
							{projectLocation ? (
								<div className="flex min-w-0 items-start gap-3">
									<MapPin className="mt-1 size-4 shrink-0 text-[#E7D0AF]" />

									<div className="min-w-0 text-[14px] leading-6 text-[#F7F1E6]/88 sm:text-[15px]">
										<span className="font-light text-[#E7D0AF]/72">
											{locationLabel}:{" "}
										</span>

										<span className="font-bold">{projectLocation}</span>
									</div>
								</div>
							) : null}

							{projectYear ? (
								<div className="flex min-w-0 items-start gap-3">
									<Calendar className="mt-1 size-4 shrink-0 text-[#E7D0AF]" />

									<div className="min-w-0 text-[14px] leading-6 text-[#F7F1E6]/88 sm:text-[15px]">
										<span className="font-light text-[#E7D0AF]/72">
											{timeLabel}:{" "}
										</span>

										<span className="font-bold">{projectYear}</span>
									</div>
								</div>
							) : null}
						</div>
					) : null}

					{projectDescription ? (
						<p className="line-clamp-2 max-w-2xl text-[14px] leading-[1.75] text-[#F7F1E6]/72 sm:text-[15px] sm:leading-[1.85]">
							{projectDescription}
						</p>
					) : null}
				</CardContent>
			</Card>
		</LocaleLink>
	);
}