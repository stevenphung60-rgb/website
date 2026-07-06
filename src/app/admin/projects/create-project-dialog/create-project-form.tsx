import { Upload } from "lucide-react";
import { AdminFormSection } from "src/components/admin/admin-form-section";
import { AdminStickyActions } from "src/components/admin/admin-sticky-actions";
import { FieldError, FormField, FormInput, FormLabel } from "src/components/form-field";
import {
	Form,
	FormErrorDisplay,
	FormPendingMessage,
	FormSubmitMessage,
} from "src/components/form-state";
import {
	ImageUploadArea,
	ImageUploadError,
	ImageUploadProgress,
	ImageUploadReview,
	ImageUploadRoot,
	ImageUploadTrigger,
} from "src/components/image-upload";
import { Button } from "src/components/ui/button";
import { DialogClose } from "src/components/ui/dialog";
import { Textarea } from "src/components/ui/textarea";
import {
	getActiveProjectCategoryIds,
	getProjectCategoryById,
} from "src/server/projectcategories";
import { ProjectCompletionStatus, ProjectVisibilityStatus } from "src/server/projects";
import { createProject } from "./create-project-dialog.actions";
import { HiddenSelectedImageInput } from "./hidden-selected-image-input";
import { ProjectImageRenderer } from "./project-image-renderer";
import { ProjectSpecsField } from "./project-specs-field";

/**
 * Create project form
 * @returns Project creation form for admin users
 */
export async function CreateProjectForm() {
	const projectCategoryIds = await getActiveProjectCategoryIds();

	const projectCategories = (
		await Promise.all(
			projectCategoryIds.map((categoryId) => getProjectCategoryById(categoryId)),
		)
	).filter(
		(category): category is NonNullable<typeof category> => category !== null,
	);

	return (
		<Form action={createProject}>
			<div className="space-y-6">
				<AdminFormSection
					title="Thông tin cơ bản"
					description="Nhập tên dự án, loại dự án, địa điểm và năm thực hiện. Tiếng Việt là nội dung chính trên website."
				>
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormField
							fieldId="projectNameVi"
							name="projectNameVi"
							placeholder="Ví dụ: Nhà máy ABC"
							required
						>
							<FormLabel>Tên dự án tiếng Việt</FormLabel>
							<FormInput />
							<FieldError />
						</FormField>

						<FormField
							fieldId="projectNameEn"
							name="projectNameEn"
							placeholder="Ví dụ: ABC Factory"
						>
							<FormLabel>Tên dự án tiếng Anh</FormLabel>
							<FormInput />
							<FieldError />
						</FormField>
					</div>

					<FormField fieldId="projectCategoryId" name="projectCategoryId">
						<FormLabel>Loại dự án</FormLabel>

						<FormInput asChild>
							<select
								defaultValue=""
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
							<FormInput />
							<FieldError />
						</FormField>

						<FormField
							fieldId="projectLocationEn"
							name="projectLocationEn"
							placeholder="Ví dụ: Binh Duong"
						>
							<FormLabel>Địa điểm tiếng Anh</FormLabel>
							<FormInput />
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
							<FormInput />
							<FieldError />
						</FormField>

						<FormField
							fieldId="projectYearEn"
							name="projectYearEn"
							placeholder="Ví dụ: 2024"
						>
							<FormLabel>Năm tiếng Anh</FormLabel>
							<FormInput />
							<FieldError />
						</FormField>
					</div>
				</AdminFormSection>

				<AdminFormSection
					title="Mô tả dự án"
					description="Mô tả ngắn gọn thông tin dự án, hạng mục thực hiện và điểm nổi bật."
				>
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormField
							fieldId="projectDescriptionVi"
							name="projectDescriptionVi"
							placeholder="Nhập mô tả dự án bằng tiếng Việt"
							required
						>
							<FormLabel>Mô tả tiếng Việt</FormLabel>

							<FormInput asChild>
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

							<FormInput asChild>
								<Textarea rows={6} />
							</FormInput>

							<FieldError />
						</FormField>
					</div>
				</AdminFormSection>

				<AdminFormSection
					title="Thông số kỹ thuật"
					description="Thêm các thông số hoặc hạng mục nổi bật của dự án nếu có."
				>
					<ProjectSpecsField />
				</AdminFormSection>

				<AdminFormSection
					title="Trạng thái dự án"
					description="Chọn trạng thái hiển thị trên website và tiến độ thực hiện của dự án."
				>
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormField fieldId="visibilityStatus" name="visibilityStatus" required>
							<FormLabel>Trạng thái hiển thị</FormLabel>

							<FormInput asChild>
								<select
									defaultValue={ProjectVisibilityStatus.Active}
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

						<FormField fieldId="completionStatus" name="completionStatus" required>
							<FormLabel>Tiến độ dự án</FormLabel>

							<FormInput asChild>
								<select
									defaultValue={ProjectCompletionStatus.Completed}
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

				<AdminFormSection
					title="Hình ảnh dự án"
					description="Tải ít nhất 1 ảnh. Chọn một ảnh làm ảnh đại diện để hiển thị trên danh sách dự án."
				>
					<ImageUploadRoot maxFiles={20} maxFileSize={10 * 1024 * 1024} name="projectImages">
						<ImageUploadArea
							className="flex w-full items-center justify-center rounded-xl border-2 border-dashed border-[#E7D0AF] bg-[#FAF7F1] p-8"
							clickable={false}
						>
							<div className="space-y-4 text-center text-[#342312]/70">
								<div className="flex flex-col items-center gap-3">
									<div className="flex size-16 items-center justify-center rounded-full bg-white">
										<Upload className="size-8 text-[#342312]" />
									</div>

									<div className="space-y-1">
										<h3 className="text-sm font-semibold text-[#342312]">
											Tải ảnh dự án
										</h3>

										<p className="text-xs italic leading-5 text-[#342312]/65">
											Kéo thả ảnh vào đây hoặc bấm nút bên dưới để chọn ảnh.
											Hỗ trợ tối đa 20 ảnh, mỗi ảnh tối đa 10MB.
										</p>
									</div>
								</div>

								<ImageUploadTrigger asChild>
									<Button
										type="button"
										variant="outline"
										className="border-[#E7D0AF] bg-white text-[#342312] hover:bg-[#FAF7F1]"
									>
										<Upload className="mr-2 size-4" />
										Chọn ảnh
									</Button>
								</ImageUploadTrigger>
							</div>
						</ImageUploadArea>

						<ImageUploadProgress />
						<ImageUploadError />

						<ImageUploadReview
							ImageComponent={ProjectImageRenderer}
							className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
						/>

						<HiddenSelectedImageInput />
					</ImageUploadRoot>
				</AdminFormSection>

				<FormErrorDisplay />

				<AdminStickyActions note="Sau khi lưu, dự án sẽ xuất hiện ngoài website nếu trạng thái là Đang hiển thị.">
					<DialogClose asChild>
						<Button type="button" variant="outline" className="border-[#E7D0AF] bg-white text-[#342312]">
							Hủy
						</Button>
					</DialogClose>

					<Button type="submit" className="bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B]">
						<FormSubmitMessage>Tạo dự án</FormSubmitMessage>
						<FormPendingMessage>Đang tạo...</FormPendingMessage>
					</Button>
				</AdminStickyActions>
			</div>
		</Form>
	);
}