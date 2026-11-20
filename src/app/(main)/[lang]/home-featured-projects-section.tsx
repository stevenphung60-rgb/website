import type { HeroInfo } from "src/app/admin/hero/hero.type";
import { cacheTag } from "next/cache";
import { CACHE_TAGS } from "src/lib/cache-tags";
import type { Locale } from "src/lib/i18n/config";
import { getProjectCategoryById } from "src/server/projectcategories";
import { getActiveProjectIds, getProjectById } from "src/server/projects";
import HomeFeaturedProjectsShowcase, {
	type HomeProjectCategoryGroup,
} from "./home-featured-projects-showcase";

interface HomeFeaturedProjectsSectionProps {
	locale: Locale;
	heroInfo?: HeroInfo;
}

const sectionText = {
	vi: {
		eyebrow: "Dự án tiêu biểu",
		heading: "Dấu ấn công trình",
		description:
			"Nghiệp Hưng đồng hành cùng nhiều chủ đầu tư và tổng thầu trong các dự án thương mại, công nghiệp, dân dụng và hạ tầng kỹ thuật.",
		viewAll: "Xem tất cả dự án",
		emptyTitle: "Chưa có dự án",
		emptyDescription: "Danh sách dự án đang được cập nhật.",
	},
	en: {
		eyebrow: "Featured projects",
		heading: "Project highlights",
		description:
			"Nghiep Hung has accompanied investors and main contractors across commercial, industrial, residential and technical infrastructure projects.",
		viewAll: "View all projects",
		emptyTitle: "No projects yet",
		emptyDescription: "Project list is being updated.",
	},
};

function getLocalizedText(value: unknown, locale: Locale) {
	const lang = locale === "en" ? "en" : "vi";

	if (typeof value === "string") return value;

	if (value && typeof value === "object") {
		const record = value as Partial<Record<"vi" | "en", string>>;

		return record[lang] || record.vi || record.en || "";
	}

	return "";
}

export default async function HomeFeaturedProjectsSection({
	locale,
	heroInfo,
}: HomeFeaturedProjectsSectionProps) {
	"use cache";
	cacheTag(CACHE_TAGS.PROJECTS);
	cacheTag(CACHE_TAGS.PROJECT_CATEGORIES);

	const lang = locale === "en" ? "en" : "vi";

	const text = {
		...sectionText[lang],
		heading: heroInfo?.projecttitle?.[lang] || sectionText[lang].heading,
	};

	const projectIds = await getActiveProjectIds();

	const projectList = await Promise.all(
		projectIds.map(async (projectId) => {
			const project = await getProjectById(projectId);

			if (!project) return null;

			const mainImage =
				project.gallery?.find((image) => image.isMain) || project.gallery?.[0];

			const projectCategory = project.categoryId
				? await getProjectCategoryById(project.categoryId)
				: null;

			const categoryName =
				projectCategory?.name?.[lang] ||
				projectCategory?.name?.vi ||
				projectCategory?.name?.en ||
				"";

			const categoryKey =
				projectCategory?.name?.en ||
				projectCategory?.name?.vi ||
				project.categoryId ||
				project.id;

			return {
				id: project.id,
				name: getLocalizedText(project.name, locale),
				categoryKey,
				categoryName,
				location: getLocalizedText(project.location, locale),
				year: getLocalizedText(project.year, locale),
				description: getLocalizedText(project.description, locale),
				imageUrl: mainImage?.url || "/placeholder.svg",
			};
		}),
	);

	const projects = projectList.filter(
		(project): project is NonNullable<(typeof projectList)[number]> =>
			Boolean(project),
	);

	const categoryMap = new Map<string, HomeProjectCategoryGroup>();

	for (const project of projects) {
		if (!project.categoryName) continue;

		const existingGroup = categoryMap.get(project.categoryKey);

		if (existingGroup) {
			if (existingGroup.projects.length < 4) {
				existingGroup.projects.push({
					id: project.id,
					name: project.name,
					categoryName: project.categoryName,
					location: project.location,
					year: project.year,
					description: project.description,
					imageUrl: project.imageUrl,
				});
			}

			continue;
		}

		categoryMap.set(project.categoryKey, {
			key: project.categoryKey,
			label: project.categoryName,
			projects: [
				{
					id: project.id,
					name: project.name,
					categoryName: project.categoryName,
					location: project.location,
					year: project.year,
					description: project.description,
					imageUrl: project.imageUrl,
				},
			],
		});
	}

	const groups = Array.from(categoryMap.values()).filter(
		(group) => group.projects.length > 0,
	);

	if (groups.length === 0) {
		return (
			<section className="w-full bg-[#FAF7F0] px-4 py-14 text-[#342312] sm:px-6 sm:py-16 lg:px-10 xl:px-16 2xl:px-24">
				<div className="bg-[#F7F1E6] p-8">
					<p className="text-xl font-extrabold uppercase tracking-[0.08em] text-[#342312]">
						{text.emptyTitle}
					</p>

					<p className="mt-3 text-sm leading-7 text-[#342312]/70">
						{text.emptyDescription}
					</p>
				</div>
			</section>
		);
	}

	return (
		<HomeFeaturedProjectsShowcase
			locale={locale}
			text={text}
			groups={groups}
		/>
	);
}