import { ProjectGridCard } from "src/components/projects/project-grid-card";
import type { Locale } from "src/lib/i18n/config";
import { getProjectCategoryById } from "src/server/projectcategories";
import type { Project } from "src/server/projects/project.type";

interface ProjectCardContentProps {
	project: Project;
	locale: Locale;
}

/**
 * Projects page card: loads the category name and renders the shared project card
 */
export async function ProjectCardContent({ project, locale }: ProjectCardContentProps) {
	const projectCategory = project.categoryId
		? await getProjectCategoryById(project.categoryId)
		: null;

	const mainImage = project.gallery?.find((img) => img.isMain) || project.gallery?.[0];

	return (
		<ProjectGridCard
			locale={locale}
			projectId={project.id}
			name={project.name[locale]}
			categoryName={projectCategory?.name?.[locale]}
			imageUrl={mainImage?.url}
			location={project.location?.[locale]}
			year={project.year?.[locale]}
		/>
	);
}
