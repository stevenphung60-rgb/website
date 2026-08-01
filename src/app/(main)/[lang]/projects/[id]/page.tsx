import { notFound } from "next/navigation";
import ScrollToTopHandler from "src/components/scroll-to-top-handler";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import { getProjectCategoryById } from "src/server/projectcategories/get-projectcategory-by-id.query";
import { getActiveProjectIds, getProjectById } from "src/server/projects";
import ProjectHeroGallery from "./project-hero-gallery";
import RelatedProjectsCarousel from "./related-projects-carousel";

interface ProjectDetailPageProps {
	params: Promise<{
		lang: Locale;
		id: string;
	}>;
}

export default async function ProjectDetailPage({
	params,
}: ProjectDetailPageProps) {
	const { lang: locale, id } = await params;

	const dictionary = getDictionary(locale);
	const project = await getProjectById(id);

	if (!project) {
		notFound();
	}

	const category = project.categoryId
		? await getProjectCategoryById(project.categoryId)
		: null;

	const projectName = project.name?.[locale] ?? project.name?.en ?? "";
	const projectDescription =
		project.description?.[locale] ?? project.description?.en ?? "";
	const projectLocation =
		project.location?.[locale] ?? project.location?.en ?? "";
	const projectYear = project.year?.[locale] ?? project.year?.en ?? "";

	const categoryName =
		category?.name?.[locale] ?? category?.name?.en ?? dictionary.nav.projects;

	const categoryFilterId = category?.id ?? project.categoryId ?? "";

	const galleryImages = project.gallery?.length
		? project.gallery
		: [{ key: "placeholder", url: "/placeholder.svg", isMain: true }];

	const activeProjectIds = await getActiveProjectIds();

	const allRelatedProjects = await Promise.all(
		activeProjectIds
			.filter((projectId) => projectId !== project.id)
			.map((projectId) => getProjectById(projectId)),
	);

	const relatedProjects = Array.from(
		new Map(
			allRelatedProjects
				.filter(
					(
						relatedProject,
					): relatedProject is NonNullable<typeof relatedProject> =>
						Boolean(
							relatedProject &&
								relatedProject.id !== project.id &&
								relatedProject.categoryId === categoryFilterId &&
								relatedProject.visibilityStatus === "active",
						),
				)
				.map((relatedProject) => [relatedProject.id, relatedProject]),
		).values(),
	);

	return (
		<section className="w-full overflow-x-hidden bg-[#FAF7F0]">
			<ScrollToTopHandler />

			<div className="relative overflow-hidden">
				<ProjectHeroGallery
					projectName={projectName}
					categoryName={categoryName}
					images={galleryImages}
				/>

				<div
					className="reveal-fade-up relative z-20 mx-auto -mt-10 w-full max-w-5xl px-4 sm:-mt-14 sm:px-6 lg:-mt-16 lg:px-8"
					style={{ animationDelay: "150ms" }}
				>
					<div className="grid overflow-hidden border border-[#E7D0AF] bg-[#F7F1E6] shadow-[0_20px_60px_rgba(52,35,18,0.15)] sm:grid-cols-3">
						<div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-3 border-b border-[#E7D0AF] px-5 py-4 text-left sm:block sm:border-b-0 sm:border-r sm:px-6 sm:py-7 sm:text-center lg:px-8 lg:py-8">
							<p className="text-[11px] font-semibold uppercase leading-5 tracking-[0.14em] text-[#A87E3C] sm:mb-3 sm:text-[13px]">
								{locale === "vi" ? "Địa điểm" : "Location"}
							</p>

							<p className="break-words text-right text-[14px] font-semibold leading-6 text-[#342312] sm:text-center sm:text-[16px] sm:leading-7">
								{projectLocation || "-"}
							</p>
						</div>

						<div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-3 border-b border-[#E7D0AF] px-5 py-4 text-left sm:block sm:border-b-0 sm:border-r sm:px-6 sm:py-7 sm:text-center lg:px-8 lg:py-8">
							<p className="text-[11px] font-semibold uppercase leading-5 tracking-[0.14em] text-[#A87E3C] sm:mb-3 sm:text-[13px]">
								{locale === "vi" ? "Thời gian" : "Year"}
							</p>

							<p className="break-words text-right text-[14px] font-semibold leading-6 text-[#342312] sm:text-center sm:text-[16px] sm:leading-7">
								{projectYear || "-"}
							</p>
						</div>

						<div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-3 px-5 py-4 text-left sm:block sm:px-6 sm:py-7 sm:text-center lg:px-8 lg:py-8">
							<p className="text-[11px] font-semibold uppercase leading-5 tracking-[0.14em] text-[#A87E3C] sm:mb-3 sm:text-[13px]">
								{locale === "vi" ? "Loại dự án" : "Project Type"}
							</p>

							<p className="break-words text-right text-[14px] font-semibold leading-6 text-[#342312] sm:text-center sm:text-[16px] sm:leading-7">
								{categoryName || "-"}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-28">
				<div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-16">
					<div
						className="reveal-fade-up min-w-0"
						style={{ animationDelay: "300ms" }}
					>
						<p className="text-[12px] font-bold uppercase tracking-[0.24em] text-[#A87E3C] sm:text-[13px] sm:tracking-[0.28em]">
							{locale === "vi" ? "Tổng quan" : "Overview"}
						</p>

						<h2 className="mt-4 break-words font-serif text-[34px] font-bold leading-[1.1] text-[#342312] sm:text-[42px]">
							{locale === "vi" ? (
								<>
									TỔNG QUAN
									<br />
									DỰ ÁN
								</>
							) : (
								<>
									PROJECT
									<br />
									OVERVIEW
								</>
							)}
						</h2>

						<div className="mt-5 h-[3px] w-16 bg-[#A87E3C] sm:mt-6 sm:w-20" />
					</div>

					<div
						className="reveal-fade-up min-w-0"
						style={{ animationDelay: "500ms" }}
					>
						<p className="whitespace-pre-line text-[15px] leading-8 text-[#342312]/75 sm:text-[16px] sm:leading-9 lg:text-[17px]">
							{projectDescription}
						</p>

						{project.specs?.length ? (
							<div
								className="reveal-fade-up mt-8 flex flex-wrap gap-2.5 sm:mt-10 sm:gap-3"
								style={{ animationDelay: "500ms" }}
							>
								{project.specs.map((spec, index) => {
									const specText = spec?.[locale] ?? spec?.en ?? "";

									if (!specText) return null;

									return (
										<div
											key={`${specText}-${index}`}
											className="max-w-full break-words border border-[#E7D0AF] bg-[#F7F1E6] px-3 py-2 text-[13px] font-medium leading-6 text-[#342312] sm:px-4 sm:text-[14px]"
										>
											{specText}
										</div>
									);
								})}
							</div>
						) : null}
					</div>
				</div>
			</div>

			{relatedProjects.length > 0 ? (
				<RelatedProjectsCarousel
					locale={locale}
					title={locale === "vi" ? "DỰ ÁN LIÊN QUAN" : "RELATED PROJECTS"}
					categoryName={categoryName}
					projects={relatedProjects}
				/>
			) : null}
		</section>
	);
}
