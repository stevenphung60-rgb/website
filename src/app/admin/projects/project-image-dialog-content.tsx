import { ImageIcon } from "lucide-react";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "src/components/ui/dialog";
import type { Project } from "src/server/projects";
import { ProjectImageManagementProvider } from "./edit-project-images/image-management-dialog.state";
import type { ExistingImage } from "./edit-project-images/image-management-dialog.type";
import { ProjectImageManagementContent } from "./edit-project-images/image-management-dialog.ui";

interface ProjectImageDialogContentProps {
	project: Project;
}

/**
 * Project image management dialog content
 * @param props - Project image dialog props
 * @returns Image management dialog content for a project
 */
export function ProjectImageDialogContent({ project }: ProjectImageDialogContentProps) {
	const projectName = project.name.vi || project.name.en || "Dự án";

	const existingImages: ExistingImage[] = project.gallery.map((image, index) => ({
		id: image.key,
		type: "existing" as const,
		url: image.url,
		name: `${projectName} - ảnh ${index + 1}`,
	}));

	const mainImage = project.gallery.find((image) => image.isMain);
	const mainImageId = mainImage ? mainImage.key : existingImages[0]?.id || null;

	return (
		<DialogContent className="max-h-[95vh] w-[95vw] max-w-6xl overflow-y-auto bg-[#FAF7F1] p-0">
			<DialogHeader className="sticky top-0 z-10 border-b border-[#E7D0AF] bg-white px-5 py-5 sm:px-6">
				<div className="flex items-start gap-4">
					<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#342312]/10 text-[#342312]">
						<ImageIcon className="size-5" />
					</div>

					<div className="min-w-0">
						<DialogTitle className="break-words font-serif text-2xl font-bold text-[#342312]">
							Quản lý ảnh dự án
						</DialogTitle>

						<DialogDescription className="mt-2 break-words text-sm leading-6 text-[#342312]/70">
							Đang chỉnh ảnh cho:{" "}
							<span className="font-semibold text-[#342312]">{projectName}</span>.
							Anh có thể thêm ảnh mới, xóa ảnh không dùng và chọn ảnh đại diện cho dự án.
						</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<div className="px-5 py-6 sm:px-6">
				<ProjectImageManagementProvider
					existingImages={existingImages}
					mainImageId={mainImageId}
				>
					<ProjectImageManagementContent projectId={project.id} />
				</ProjectImageManagementProvider>
			</div>
		</DialogContent>
	);
}