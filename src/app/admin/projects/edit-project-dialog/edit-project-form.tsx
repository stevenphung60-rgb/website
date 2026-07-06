import { AdminFormSection } from "src/components/admin/admin-form-section";
import { AdminStickyActions } from "src/components/admin/admin-sticky-actions";
import { FieldError, FormField, FormInput, FormLabel } from "src/components/form-field";
import {
	Form,
	FormErrorDisplay,
	FormPendingMessage,
	FormSubmitMessage,
} from "src/components/form-state";
import { Button } from "src/components/ui/button";
import { DialogClose } from "src/components/ui/dialog";
import { Textarea } from "src/components/ui/textarea";
import {
	getActiveProjectCategoryIds,
	getProjectCategoryById,
} from "src/server/projectcategories";
import type { Project } from "src/server/projects";
import { ProjectCompletionStatus, ProjectVisibilityStatus } from "src/server/projects";
import { updateProject } from "./edit-project-dialog.actions";
import { EditProjectSpecsWithState } from "./edit-project-specs-with-state";

interface EditProjectFormProps {
	project: Project;
}

/**
 * Edit project form
 * @param props - Edit project form props
 * @returns Project edit form for admin users
 */
export async function EditProjectForm({ project }: EditProjectFormProps) {
	const projectCategoryIds = await getActiveProjectCategoryIds();

	const projectCategories = (
		await Promise.all(
			projectCategoryIds.map((categoryId) => getProjectCategoryById(categoryId)),
		)
	).filter(
		(category): category is NonNullable<typeof category> => category !== null,
	);

	return (
		<Form action={updateProject}>
			<input type="hidden" name="projectId" value={project.id} />

			<div className="space-y-6">
				<AdminFormSection
					title="Thông tin cơ bản"
					description="Cập nhật tên dự án, loại dự án, địa điểm và năm thực hiện."
				>
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormField
							fieldId="projectNameVi"
							name="projectNameVi"
							placeholder="Ví dụ: Nhà máy ABC"
							required
						>
							<FormLabel>Tên dự án tiếng Việt</FormLabel>
							<FormInput defaultValue={project.name.vi} />
							<FieldError />
						</FormField>

						<FormField
							fieldId="projectNameEn"
							name="projectNameEn"
							placeholder="Ví dụ: ABC Factory"
						>
							<FormLabel>Tên dự án tiếng Anh</FormLabel>
							<FormInput defaultValue={project.name.en} />
							<FieldError />
						</FormField>
					</div>

					<FormField fieldId="projectCategoryId" name="projectCategoryId">
						<FormLabel>Loại dự án</FormLabel>

						<FormInput asChild>
							<select
								defaultValue={project.categoryId ?? ""}
								className="flex h-10 w-full rounded-lg border border-[#E7D0AF] bg-white px-3 py-2 text-sm text-[#342312] shadow-sm outline-none transition focus:border-[#342312] focus:ring-2 focus:ring-[#342312]/10"
							>
								<option value="">Chưa phân loại</option>

								{projectCategories.map((category) => (
									<option key={category.id} value={category.id}>
										{category.name.vi || category.name.en}
										{category.name.en ? ` - ${category.name.en}` : ""}
									</option>
								))}
							</select>
						</FormInput>

						<FieldError />
					</FormField>

					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormField
							fieldId="projectLocationVi"
							name="projectLocationVi"
							placeholder="Ví dụ: Bình Dương"
							required
						>
							<FormLabel>Địa điểm tiếng Việt</FormLabel>
							<FormInput defaultValue={project.location.vi} />
							<FieldError />
						</FormField>

						<FormField
							fieldId="projectLocationEn"
							name="projectLocationEn"
							placeholder="Ví dụ: Binh Duong"
						>
							<FormLabel>Địa điểm tiếng Anh</FormLabel>
							<FormInput defaultValue={project.location.en} />
							<FieldError />
						</FormField>
					</div>

					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormField
							fieldId="projectYearVi"
							name="projectYearVi"
							placeholder="Ví dụ: 2024"
							required
						>
							<FormLabel>Năm tiếng Việt</FormLabel>
							<FormInput defaultValue={project.year.vi} />
							<FieldError />
						</FormField>

						<FormField
							fieldId="projectYearEn"
							name="projectYearEn"
							placeholder="Ví dụ: 2024"
						>
							<FormLabel>Năm tiếng Anh</FormLabel>
							<FormInput defaultValue={project.year.en} />
							<FieldError />
						</FormField>
					</div>
				</AdminFormSection>

				<AdminFormSection
					title="Mô tả dự án"
					description="Cập nhật mô tả dự án hiển thị trên website."
				>
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormField
							fieldId="projectDescriptionVi"
							name="projectDescriptionVi"
							placeholder="Nhập mô tả dự án bằng tiếng Việt"
							required
						>
							<FormLabel>Mô tả tiếng Việt</FormLabel>

							<FormInput asChild defaultValue={project.description.vi}>
								<Textarea rows={6} />
							</FormInput>

							<FieldError />
						</FormField>

						<FormField
							fieldId="projectDescriptionEn"
							name="projectDescriptionEn"
							placeholder="Enter project description in English"
						>
							<FormLabel>Mô tả tiếng Anh</FormLabel>

							<FormInput asChild defaultValue={project.description.en}>
								<Textarea rows={6} />
							</FormInput>

							<FieldError />
						</FormField>
					</div>
				</AdminFormSection>

				<AdminFormSection
					title="Thông số kỹ thuật"
					description="Cập nhật các thông số hoặc hạng mục nổi bật của dự án."
				>
					<EditProjectSpecsWithState initialSpecs={project.specs} />
				</AdminFormSection>

				<AdminFormSection
					title="Trạng thái dự án"
					description="Cập nhật trạng thái hiển thị và tiến độ dự án."
				>
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormField
							fieldId="projectVisibilityStatus"
							name="projectVisibilityStatus"
							required
						>
							<FormLabel>Trạng thái hiển thị</FormLabel>

							<FormInput asChild>
								<select
									defaultValue={project.visibilityStatus}
									className="flex h-10 w-full rounded-lg border border-[#E7D0AF] bg-white px-3 py-2 text-sm text-[#342312] shadow-sm outline-none transition focus:border-[#342312] focus:ring-2 focus:ring-[#342312]/10"
								>
									<option value={ProjectVisibilityStatus.Active}>
										Đang hiển thị
									</option>
									<option value={ProjectVisibilityStatus.Draft}>Bản nháp</option>
								</select>
							</FormInput>

							<FieldError />
						</FormField>

						<FormField
							fieldId="projectCompletionStatus"
							name="projectCompletionStatus"
							required
						>
							<FormLabel>Tiến độ dự án</FormLabel>

							<FormInput asChild>
								<select
									defaultValue={project.completionStatus}
									className="flex h-10 w-full rounded-lg border border-[#E7D0AF] bg-white px-3 py-2 text-sm text-[#342312] shadow-sm outline-none transition focus:border-[#342312] focus:ring-2 focus:ring-[#342312]/10"
								>
									<option value={ProjectCompletionStatus.Completed}>
										Đã hoàn thành
									</option>
									<option value={ProjectCompletionStatus.InProgress}>
										Đang thực hiện
									</option>
									<option value={ProjectCompletionStatus.Planning}>
										Đang lên kế hoạch
									</option>
								</select>
							</FormInput>

							<FieldError />
						</FormField>
					</div>
				</AdminFormSection>

				<FormErrorDisplay />

				<AdminStickyActions note="Sau khi lưu, thông tin dự án sẽ được cập nhật trên website nếu trạng thái là Đang hiển thị.">
					<DialogClose asChild>
						<Button
							type="button"
							variant="outline"
							className="border-[#E7D0AF] bg-white text-[#342312]"
						>
							Đóng
						</Button>
					</DialogClose>

					<Button type="submit" className="bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B]">
						<FormSubmitMessage>Lưu thay đổi</FormSubmitMessage>
						<FormPendingMessage>Đang lưu...</FormPendingMessage>
					</Button>
				</AdminStickyActions>
			</div>
		</Form>
	);
}