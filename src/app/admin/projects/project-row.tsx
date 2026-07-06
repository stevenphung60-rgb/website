import {
	Edit,
	Eye,
	FolderOpen,
	ImageIcon,
	MoreHorizontal,
	Trash2,
} from "lucide-react";
import Image from "next/image";
import { AdminStatusBadge } from "src/components/admin/admin-status-badge";
import {
	CancelButton,
	ConfirmButton,
	ConfirmDialog,
	Form,
	FormErrorDisplay,
	FormPendingMessage,
	FormSubmitMessage,
	SubmitButton,
} from "src/components/form-state";
import { Button } from "src/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "src/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import { getProjectCategoryById } from "src/server/projectcategories";
import { getProjectById } from "src/server/projects";
import { deleteProjectAction } from "./delete-project.actions";
import {
	ProjectEditTrigger,
	ProjectImageTrigger,
	ProjectPreviewTrigger,
} from "./project-dialog-triggers";
import { ProjectEditDialogContent } from "./project-edit-dialog-content";
import { ProjectImageDialogContent } from "./project-image-dialog-content";
import { ProjectPreviewDialogContent } from "./project-preview-dialog-content";
import { ProjectRowDialog } from "./project-row-context.ui";

interface ProjectRowProps {
	projectId: string;
}

/**
 * Display a single project row in the admin project list
 * @param props - Project row props
 * @returns Project row with preview, edit, image management, and delete actions
 */
export async function ProjectRow({ projectId }: ProjectRowProps) {
	const project = await getProjectById(projectId);

	if (!project) {
		throw new Error(`Project with id ${projectId} not found`);
	}

	const projectCategory = project.categoryId
		? await getProjectCategoryById(project.categoryId)
		: null;

	const mainImage = project.gallery.find((image) => image.isMain) || project.gallery[0];

	const projectName = project.name.vi || project.name.en || "Chưa có tên dự án";
	const projectNameVi = project.name.vi || "Chưa có tên tiếng Việt";
	const projectNameEn = project.name.en || "Chưa có tên tiếng Anh";
	const projectLocation = project.location.vi || project.location.en || "Chưa nhập địa điểm";
	const projectYear = project.year.vi || project.year.en || "Chưa nhập năm";
	const projectDescription =
		project.description.vi || project.description.en || "Chưa có mô tả dự án";
	const categoryName = projectCategory
		? projectCategory.name.vi || projectCategory.name.en
		: "Chưa phân loại";

	return (
		<div className="bg-white px-4 py-4 transition-colors hover:bg-[#FAF7F1] sm:px-5">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-[5rem_minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_8rem_8rem_5rem] lg:items-center lg:gap-4">
				<div className="flex items-start gap-4 lg:block">
					<div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] lg:size-16">
						{mainImage ? (
							<Image
								src={mainImage.url}
								alt={projectName}
								fill
								className="object-cover"
								sizes="80px"
							/>
						) : (
							<div className="flex size-full items-center justify-center">
								<FolderOpen className="size-7 text-[#342312]/45" />
							</div>
						)}
					</div>

					<div className="min-w-0 lg:hidden">
						<h3 className="break-words text-base font-semibold text-[#342312]">
							{projectNameVi}
						</h3>

						<p className="mt-1 break-words text-sm text-[#342312]/65">
							{projectNameEn}
						</p>

						<p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-[#342312]/70">
							{projectDescription}
						</p>

						<div className="mt-3 flex flex-wrap items-center gap-2">
							<AdminStatusBadge status={project.visibilityStatus} />
							<AdminStatusBadge status={project.completionStatus} />

							<span className="rounded-full border border-[#E7D0AF] bg-white px-2.5 py-1 text-xs font-semibold text-[#342312]/70">
								{project.gallery.length} ảnh
							</span>
						</div>
					</div>
				</div>

				<div className="hidden min-w-0 lg:block">
					<h3 className="truncate text-sm font-semibold text-[#342312]">
						{projectNameVi}
					</h3>

					<p className="mt-1 truncate text-sm text-[#342312]/65">
						{projectNameEn}
					</p>

					<p className="mt-1 truncate text-xs text-[#342312]/50">
						Loại dự án: {categoryName}
					</p>
				</div>

				<div className="min-w-0">
					<p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55 lg:hidden">
						Địa điểm
					</p>

					<p className="truncate text-sm text-[#342312]/75">{projectLocation}</p>
				</div>

				<div className="min-w-0">
					<p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55 lg:hidden">
						Năm
					</p>

					<p className="truncate text-sm text-[#342312]/75">{projectYear}</p>
				</div>

				<div className="hidden lg:block">
					<AdminStatusBadge status={project.visibilityStatus} />
				</div>

				<div className="hidden lg:block">
					<AdminStatusBadge status={project.completionStatus} />
				</div>

				<div className="flex items-center justify-end">
					<Form action={deleteProjectAction} confirmBeforeSubmit>
						<input type="hidden" name="projectId" value={project.id} />

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="text-[#342312]">
									<MoreHorizontal className="size-4" />
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align="end" className="w-52 bg-white">
								<ProjectPreviewTrigger className="flex w-full items-center gap-2">
									<Eye className="size-4" />
									Xem nhanh
								</ProjectPreviewTrigger>

								<ProjectEditTrigger className="flex w-full items-center gap-2">
									<Edit className="size-4" />
									Sửa thông tin
								</ProjectEditTrigger>

								<ProjectImageTrigger className="flex w-full items-center gap-2">
									<ImageIcon className="size-4" />
									Quản lý ảnh
								</ProjectImageTrigger>

								<SubmitButton asChild className="flex w-full items-center gap-2">
									<DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
										<Trash2 className="size-4" />
										Xóa dự án
									</DropdownMenuItem>
								</SubmitButton>
							</DropdownMenuContent>
						</DropdownMenu>

						<ConfirmDialog>
							<DialogContent className="bg-white sm:max-w-2xl">
								<DialogHeader className="space-y-3">
									<div className="flex items-start gap-3">
										<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
											<Trash2 className="size-5 text-destructive" />
										</div>

										<div className="space-y-1">
											<DialogTitle>Xóa dự án</DialogTitle>

											<DialogDescription>
												Thao tác này không thể hoàn tác. Dự án, hình ảnh và thông số liên quan sẽ bị xóa khỏi hệ thống.
											</DialogDescription>
										</div>
									</div>
								</DialogHeader>

								<div className="space-y-3">
									<div className="rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] p-4">
										<p className="font-medium text-[#342312]">{projectNameVi}</p>

										<p className="mt-1 text-sm text-[#342312]/65">
											{projectNameEn}
										</p>

										<div className="mt-3 grid grid-cols-1 gap-2 text-sm text-[#342312]/70 sm:grid-cols-2">
											<p>Địa điểm: {projectLocation}</p>
											<p>Năm: {projectYear}</p>
											<p>Loại dự án: {categoryName}</p>
											<p>Số ảnh: {project.gallery.length}</p>
										</div>

										<p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-[#342312]/70">
											{projectDescription}
										</p>

										<p className="mt-3 text-xs text-[#342312]/65">
											{project.gallery.length} ảnh và {project.specs.length} thông số kỹ thuật sẽ bị xóa cùng dự án này.
										</p>
									</div>

									<FormErrorDisplay />
								</div>

								<DialogFooter className="gap-2">
									<CancelButton>Hủy</CancelButton>

									<ConfirmButton variant="destructive">
										<FormSubmitMessage>Xóa dự án</FormSubmitMessage>
										<FormPendingMessage>Đang xóa...</FormPendingMessage>
									</ConfirmButton>
								</DialogFooter>
							</DialogContent>
						</ConfirmDialog>
					</Form>
				</div>
			</div>

			<ProjectRowDialog type="preview">
				<ProjectPreviewDialogContent projectId={project.id} />
			</ProjectRowDialog>

			<ProjectRowDialog type="edit">
				<ProjectEditDialogContent project={project} />
			</ProjectRowDialog>

			<ProjectRowDialog type="image">
				<ProjectImageDialogContent project={project} />
			</ProjectRowDialog>
		</div>
	);
}