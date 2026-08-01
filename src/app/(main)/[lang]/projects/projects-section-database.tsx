/**
 * Server component that fetches projects from database and renders the projects section
 * Supports filtering by project category with row limiting controlled by client
 */

import { cacheTag } from "next/cache";
import { Suspense } from "react";
import {
	EmptyStateCard,
	EmptyStateDescription,
	EmptyStateIcon,
	EmptyStateTitle,
} from "src/components/empty-state";
import { CACHE_TAGS } from "src/lib/cache-tags";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import { getActiveProjectIds, getProjectById } from "src/server/projects";
import { ProjectCardContent } from "./project-card-content";
import { ProjectCardSkeleton } from "./project-card-skeleton";
import { ProjectCardWrapper } from "./project-card-wrapper";
import { ProjectFilterButtons, ProjectFilterProvider } from "./project-filter";
import {
	ProjectGridController,
	ProjectMobilePageIndicator,
	ViewAllButton,
} from "./project-visibility";

interface ProjectsSectionDatabaseProps {
	locale: Locale;
	viewAll?: boolean;
	initialCategory?: string | null;
}

async function ProjectCard({ id, locale }: { id: string; locale: Locale }) {
	const project = await getProjectById(id);

	if (!project) return null;

	return (
		<ProjectCardWrapper id={project.id} categoryId={project.categoryId ?? null}>
			<ProjectCardContent project={project} locale={locale} />
		</ProjectCardWrapper>
	);
}

export default async function ProjectsSectionDatabase({
	locale,
	viewAll,
	initialCategory = null,
}: ProjectsSectionDatabaseProps) {
	"use cache";
	cacheTag(CACHE_TAGS.PROJECTS);
	cacheTag(CACHE_TAGS.PROJECT_CATEGORIES);

	const projectIds = await getActiveProjectIds();
	const dictionary = getDictionary(locale);

	return (
		// biome-ignore lint/correctness/useUniqueElementIds: Stable public anchor used by project navigation.
		<section
			id="projects"
			className="relative w-full bg-[#FAF7F0] pb-12 pt-0 sm:pb-16 lg:pb-20"
		>
			<div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:px-8">
				{projectIds.length > 0 ? (
					<ProjectFilterProvider selectedCategory={initialCategory}>
						{/* biome-ignore lint/correctness/useUniqueElementIds: Stable anchor used by category links. */}
						<div
							id="projects-filter"
							className="relative z-30 scroll-mt-24 pt-6 md:-mt-9 md:pt-0 lg:-mt-12"
						>
							<ProjectFilterButtons locale={locale} />

							<ProjectGridController
								projectIds={projectIds}
								limitRows={!viewAll}
							>
								{/* biome-ignore lint/correctness/useUniqueElementIds: Stable target for pagination scroll restoration. */}
								<div id="projects-list-start" className="scroll-mt-24">
									<ProjectMobilePageIndicator locale={locale} />
								</div>

								<div className="mt-4 grid grid-cols-1 gap-6 sm:mt-5 md:mt-10 md:block md:space-y-10 lg:mt-12 lg:space-y-12">
									{projectIds.map((id) => (
										<Suspense key={id} fallback={<ProjectCardSkeleton />}>
											<ProjectCard id={id} locale={locale} />
										</Suspense>
									))}
								</div>

								{!viewAll && <ViewAllButton />}
							</ProjectGridController>
						</div>
					</ProjectFilterProvider>
				) : (
					<EmptyStateCard>
						<EmptyStateIcon>🏗️</EmptyStateIcon>

						<EmptyStateTitle>{dictionary.projects.empty.title}</EmptyStateTitle>

						<EmptyStateDescription>
							{dictionary.projects.empty.description}
						</EmptyStateDescription>
					</EmptyStateCard>
				)}
			</div>
		</section>
	);
}
