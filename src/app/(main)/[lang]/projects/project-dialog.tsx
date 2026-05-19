import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import {
	convertToGalleryImages,
	GalleryBackButton,
	GalleryImage,
	GalleryNextButton,
	GalleryRoot,
} from "src/components/image-gallery/image-gallery";
import { Card, CardContent, CardTitle } from "src/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "src/components/ui/dialog";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import { getProjectCategoryById } from "src/server/projectcategories";
import type { Project } from "src/server/projects";
import { getProjectById } from "src/server/projects";

interface ProjectDialogProps {
	projectId: string;
	locale: Locale;
}

export default async function ProjectDialog({
	projectId,
	locale,
}: ProjectDialogProps) {
	const project: Project | null = await getProjectById(projectId);

	if (!project) {
		return <NotFoundProjectDialog locale={locale} />;
	}

	const dictionary = getDictionary(locale);
	const projectName = project.name[locale];
	const projectDescription = project.description[locale];

	const projectCategory = project.categoryId
		? await getProjectCategoryById(project.categoryId)
		: null;

	const projectCategoryName =
		projectCategory?.name?.[locale] ?? dictionary.projects.filter.all;

	const convertedImages = convertToGalleryImages(
		project.gallery.map((image, index) => ({
			src: image.url,
			alt: `${projectName} - ${index + 1}`,
		})),
	);

	const mainImage =
		project.gallery?.find((img) => img.isMain) || project.gallery?.[0];

	return (
		<Dialog>
			<DialogTrigger asChild>
				<div
					className="
						group/project relative cursor-pointer !rounded-none
						overflow-hidden
						transition-all duration-300 ease-out
						hover:-translate-y-2
						hover:shadow-[0_20px_60px_rgba(0,0,0,0.16)]
					"
				>
					<div
						className="
							pointer-events-none absolute left-0 top-0 z-20
							h-[4px] w-full origin-left scale-x-0
							bg-[#342312]
							transition-transform duration-500 ease-out
							group-hover/project:scale-x-100
						"
					/>

					<Card className="cursor-pointer !rounded-none py-0 transition-colors duration-300 group-hover/project:border-transparent">
						<div className="aspect-video overflow-hidden !rounded-none">
							<Image
								src={mainImage?.url || "/placeholder.svg"}
								alt={projectName}
								width={400}
								height={300}
								className="
									h-full w-full object-cover
									transition-transform duration-500 ease-out
									group-hover/project:scale-105
								"
							/>
						</div>

						<CardContent className="pb-6">
							<CardTitle
								className="
									font-serif text-xl font-bold text-foreground
									transition-colors duration-300
									group-hover/project:text-[#A87E3C]
								"
							>
								{projectName}
							</CardTitle>
						</CardContent>
					</Card>
				</div>
			</DialogTrigger>

			<DialogContent className="max-h-[95vh] w-[95vw] max-w-7xl overflow-hidden border-0 !rounded-none bg-transparent p-0 shadow-none">
				<DialogHeader className="sr-only">
					<DialogTitle>{projectName}</DialogTitle>
				</DialogHeader>

				<div className="grid overflow-hidden !rounded-none bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)] lg:grid-cols-[58%_42%]">
					<div className="relative min-h-[420px] overflow-hidden">
						<GalleryRoot images={convertedImages}>
							<div className="relative h-full">
								<GalleryImage className="h-full w-full object-cover" />

								<GalleryBackButton className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 text-[#342312] hover:bg-white">
									<ChevronLeft className="size-4" />
								</GalleryBackButton>

								<GalleryNextButton className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 text-[#342312] hover:bg-white">
									<ChevronRight className="size-4" />
								</GalleryNextButton>
							</div>
						</GalleryRoot>
					</div>

					<div className="flex min-h-[640px] flex-col justify-center bg-[#F7F1E6] px-10 py-14 lg:px-14">
						<p className="mb-6 text-[15px] font-semibold text-[#B59A63]">
							{projectCategoryName}
						</p>

						<h2 className="mb-10 text-[34px] font-black uppercase leading-[1.3] tracking-[-0.02em] text-[#06134A]">
							{projectName}
						</h2>

						<div className="mb-12 grid grid-cols-[110px_1fr] gap-y-5 text-[18px]">
							<span className="font-light text-[#7E869B]">
								{locale === "vi" ? "Địa điểm" : "Location"}
							</span>

							<span className="text-[18px] font-black text-[#111827]">
								{project.location?.[locale]}
							</span>

							<span className="font-light text-[#7E869B]">
								{locale === "vi" ? "Thời gian" : "Time"}
							</span>

							<span className="text-[18px] font-black text-[#111827]">
								{project.year?.[locale]}
							</span>
						</div>

						<p className="line-clamp-6 text-[18px] leading-[2.1] text-[#4B5563]">
							{projectDescription}
						</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function NotFoundProjectDialog({ locale }: { locale: Locale }) {
	const dictionary = getDictionary(locale);

	return (
		<Card className="group cursor-pointer !rounded-none py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
			<div className="aspect-video overflow-hidden !rounded-none">
				<Image
					src="/placeholder.svg"
					alt={dictionary.projects.notFound.title}
					width={400}
					height={300}
					className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>
			</div>

			<CardContent className="p-6">
				<h3 className="font-serif text-xl font-bold text-foreground">
					{dictionary.projects.notFound.title}
				</h3>
			</CardContent>
		</Card>
	);
}