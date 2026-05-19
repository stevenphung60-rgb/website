import { Building, Calendar, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import {
	convertToGalleryImages,
	GalleryBackButton,
	GalleryImage,
	GalleryNextButton,
	GalleryRoot,
	GalleryThumbnails,
} from "src/components/image-gallery/image-gallery";
import { Badge } from "src/components/ui/badge";
import { DialogContent, DialogHeader, DialogTitle } from "src/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { getProjectCategoryById } from "src/server/projectcategories";
import { getProjectById, ProjectCompletionStatus } from "src/server/projects";

interface ProjectPreviewDialogContentProps {
	projectId: string;
}

export async function ProjectPreviewDialogContent({
	projectId,
}: ProjectPreviewDialogContentProps) {
	const project = await getProjectById(projectId);

	if (!project) {
		return <NotFoundProjectPreviewDialogContent />;
	}

	const projectCategory = project.categoryId
		? await getProjectCategoryById(project.categoryId)
		: null;

	const convertedImages = convertToGalleryImages(
		project.gallery.map((image, index) => ({
			src: image.url,
			alt: `${project.name.en} - ${index + 1}`,
		})),
	);

	return (
		<DialogContent className="max-h-[95vh] w-[95vw] max-w-4xl overflow-y-auto p-0">
			<Tabs defaultValue="en" className="w-full">
				<DialogHeader className="sticky top-0 z-10 bg-background p-6 pb-0">
					<TabsList className="mb-4 grid w-full grid-cols-2">
						<TabsTrigger value="en">English</TabsTrigger>
						<TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
					</TabsList>

					<TabsContent value="en" className="mt-0">
						<DialogTitle className="pr-8 font-serif text-2xl font-bold text-foreground">
							{project.name.en}
						</DialogTitle>
					</TabsContent>

					<TabsContent value="vi" className="mt-0">
						<DialogTitle className="pr-8 font-serif text-2xl font-bold text-foreground">
							{project.name.vi}
						</DialogTitle>
					</TabsContent>
				</DialogHeader>

				<div className="px-6 pb-6">
					<div className="space-y-6">
						<div className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-4">
							<div className="flex items-center">
								<Building className="mr-2 h-4 w-4 text-primary" />
								<span>
									{projectCategory
										? `${projectCategory.name.en} - ${projectCategory.name.vi}`
										: "-"}
								</span>
							</div>

							<TabsContent value="en" className="m-0">
								<div className="flex items-center">
									<MapPin className="mr-2 h-4 w-4 text-primary" />
									<span>{project.location.en}</span>
								</div>
							</TabsContent>

							<TabsContent value="vi" className="m-0">
								<div className="flex items-center">
									<MapPin className="mr-2 h-4 w-4 text-primary" />
									<span>{project.location.vi}</span>
								</div>
							</TabsContent>

							<TabsContent value="en" className="m-0">
								<div className="flex items-center">
									<Calendar className="mr-2 h-4 w-4 text-primary" />
									<span>{project.year.en}</span>
								</div>
							</TabsContent>

							<TabsContent value="vi" className="m-0">
								<div className="flex items-center">
									<Calendar className="mr-2 h-4 w-4 text-primary" />
									<span>{project.year.vi}</span>
								</div>
							</TabsContent>

							<Badge
								variant={
									project.completionStatus === ProjectCompletionStatus.Completed
										? "default"
										: "outline"
								}
								className="w-fit"
							>
								{project.completionStatus === ProjectCompletionStatus.Completed
									? "Completed"
									: project.completionStatus === ProjectCompletionStatus.InProgress
										? "In Progress"
										: "Planning"}
							</Badge>
						</div>

						<div>
							<h4 className="mb-3 font-serif text-lg font-bold">
								Project Description
							</h4>

							<TabsContent value="en">
								<p className="leading-relaxed text-muted-foreground">
									{project.description.en}
								</p>
							</TabsContent>

							<TabsContent value="vi">
								<p className="leading-relaxed text-muted-foreground">
									{project.description.vi}
								</p>
							</TabsContent>
						</div>

						<div>
							<h4 className="mb-3 font-serif text-lg font-bold">
								Technical Specifications
							</h4>

							<TabsContent value="en">
								<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
									{project.specs.map((spec, index) => (
										<div
											key={`spec-${index}-${spec.en}-${spec.vi}`}
											className="flex items-start"
										>
											<div className="mr-3 mt-2 size-2 flex-shrink-0 rounded-full bg-primary" />
											<span className="text-sm text-muted-foreground">
												{spec.en}
											</span>
										</div>
									))}
								</div>
							</TabsContent>

							<TabsContent value="vi">
								<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
									{project.specs.map((spec, index) => (
										<div
											key={`spec-${index}-${spec.en}-${spec.vi}`}
											className="flex items-start"
										>
											<div className="mr-3 mt-2 size-2 flex-shrink-0 rounded-full bg-primary" />
											<span className="text-sm text-muted-foreground">
												{spec.vi}
											</span>
										</div>
									))}
								</div>
							</TabsContent>
						</div>

						<div>
							<h4 className="mb-3 font-serif text-lg font-bold">
								Project Images
							</h4>

							<GalleryRoot images={convertedImages}>
								<div className="relative">
									<GalleryImage className="mb-6" />

									<GalleryBackButton className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white">
										<ChevronLeft className="h-4 w-4" />
									</GalleryBackButton>

									<GalleryNextButton className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white">
										<ChevronRight className="h-4 w-4" />
									</GalleryNextButton>
								</div>

								<GalleryThumbnails />
							</GalleryRoot>
						</div>
					</div>
				</div>
			</Tabs>
		</DialogContent>
	);
}

function NotFoundProjectPreviewDialogContent() {
	return (
		<DialogContent className="max-h-[95vh] w-[95vw] max-w-4xl overflow-y-auto p-0">
			<DialogHeader className="p-6 pb-0">
				<DialogTitle>Project Not Found</DialogTitle>
			</DialogHeader>

			<div className="p-6">
				<p className="text-muted-foreground">
					The requested project could not be found.
				</p>
			</div>
		</DialogContent>
	);
}