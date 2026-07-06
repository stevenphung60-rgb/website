import { Edit, Eye, MoreHorizontal, Tags, Trash2 } from "lucide-react";
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
import { deleteProjectCategoryAction } from "./delete-projectcategory.actions";
import {
	ProjectCategoryEditTrigger,
	ProjectCategoryPreviewTrigger,
} from "./projectcategory-dialog-triggers";
import { ProjectCategoryEditDialogContent } from "./projectcategory-edit-dialog-content";
import { ProjectCategoryPreviewDialogContent } from "./projectcategory-preview-dialog-content";
import { ProjectCategoryRowDialog } from "./projectcategory-row-context.ui";

interface ProjectCategoryRowProps {
	projectCategoryId: string;
}

/**
 * Display a single project category row in the admin list
 * @param props - Project category row props
 * @returns Project category row with preview, edit, and delete actions
 */
export async function ProjectCategoryRow({
	projectCategoryId,
}: ProjectCategoryRowProps) {
	const projectCategory = await getProjectCategoryById(projectCategoryId);

	if (!projectCategory) {
		throw new Error(`Project category with id ${projectCategoryId} not found`);
	}

	const nameVi = projectCategory.name.vi || "Chưa có tên tiếng Việt";
	const nameEn = projectCategory.name.en || "Chưa có tên tiếng Anh";
	const updatedAt = new Date(projectCategory.updatedAt).toLocaleDateString("vi-VN", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

	return (
		<div className="bg-white px-4 py-4 transition-colors hover:bg-[#FAF7F1] sm:px-5">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_10rem_5rem] lg:items-center lg:gap-4">
				<div className="flex min-w-0 items-start gap-4">
					<div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] text-[#342312]">
						<Tags className="size-5" />
					</div>

					<div className="min-w-0">
						<p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55 lg:hidden">
							Tên tiếng Việt
						</p>

						<p className="truncate text-sm font-semibold text-[#342312]">
							{nameVi}
						</p>

						<p className="mt-1 text-xs italic text-[#342312]/60 lg:hidden">
							Tên tiếng Anh: {nameEn}
						</p>
					</div>
				</div>

				<div className="hidden min-w-0 lg:block">
					<p className="truncate text-sm text-[#342312]/75">{nameEn}</p>
				</div>

				<div className="min-w-0">
					<p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55 lg:hidden">
						Cập nhật
					</p>

					<p className="truncate text-sm text-[#342312]/70">{updatedAt}</p>
				</div>

				<div className="flex items-center justify-end">
					<Form action={deleteProjectCategoryAction} confirmBeforeSubmit>
						<input
							type="hidden"
							name="projectCategoryId"
							value={projectCategory.id}
						/>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="text-[#342312]">
									<MoreHorizontal className="size-4" />
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align="end" className="w-52 bg-white">
								<ProjectCategoryPreviewTrigger className="flex w-full items-center gap-2">
									<Eye className="size-4" />
									Xem nhanh
								</ProjectCategoryPreviewTrigger>

								<ProjectCategoryEditTrigger className="flex w-full items-center gap-2">
									<Edit className="size-4" />
									Sửa thông tin
								</ProjectCategoryEditTrigger>

								<SubmitButton asChild className="flex w-full items-center gap-2">
									<DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
										<Trash2 className="size-4" />
										Xóa loại dự án
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
											<DialogTitle>Xóa loại dự án</DialogTitle>

											<DialogDescription>
												Thao tác này không thể hoàn tác. Loại dự án sẽ bị xóa khỏi hệ thống.
											</DialogDescription>
										</div>
									</div>
								</DialogHeader>

								<div className="space-y-3">
									<div className="rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] p-4">
										<p className="font-medium text-[#342312]">{nameVi}</p>

										<p className="mt-1 text-sm text-[#342312]/65">{nameEn}</p>
									</div>

									<FormErrorDisplay />
								</div>

								<DialogFooter className="gap-2">
									<CancelButton>Hủy</CancelButton>

									<ConfirmButton variant="destructive">
										<FormSubmitMessage>Xóa loại dự án</FormSubmitMessage>
										<FormPendingMessage>Đang xóa...</FormPendingMessage>
									</ConfirmButton>
								</DialogFooter>
							</DialogContent>
						</ConfirmDialog>
					</Form>
				</div>
			</div>

			<ProjectCategoryRowDialog type="preview">
				<ProjectCategoryPreviewDialogContent projectCategoryId={projectCategory.id} />
			</ProjectCategoryRowDialog>

			<ProjectCategoryRowDialog type="edit">
				<ProjectCategoryEditDialogContent projectCategory={projectCategory} />
			</ProjectCategoryRowDialog>
		</div>
	);
}