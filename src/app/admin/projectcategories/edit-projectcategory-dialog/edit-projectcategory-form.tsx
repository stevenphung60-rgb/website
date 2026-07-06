import { AdminFormSection } from "src/components/admin/admin-form-section";
import { AdminStickyActions } from "src/components/admin/admin-sticky-actions";
import { FieldError, FormField, FormInput, FormLabel } from "src/components/form-field";
import {
	Form,
	FormErrorDisplay,
	FormPendingMessage,
	FormResetButton,
	FormSubmitMessage,
} from "src/components/form-state";
import { Button } from "src/components/ui/button";
import { DialogClose } from "src/components/ui/dialog";
import type { ProjectCategory } from "src/server/projectcategories";
import { updateProjectCategory } from "./edit-projectcategory-dialog.actions";

interface EditProjectCategoryFormProps {
	projectCategory: ProjectCategory;
}

/**
 * Edit project category form
 * @param props - Edit project category form props
 * @returns Project category edit form for admin users
 */
export function EditProjectCategoryForm({
	projectCategory,
}: EditProjectCategoryFormProps) {
	return (
		<Form action={updateProjectCategory}>
			<input type="hidden" name="projectCategoryId" value={projectCategory.id} />

			<div className="space-y-6">
				<AdminFormSection
					title="Thông tin loại dự án"
					description="Cập nhật tên loại dự án. Tiếng Việt là nội dung chính trên website."
				>
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormField
							fieldId="projectCategoryNameVi"
							name="projectCategoryNameVi"
							placeholder="Ví dụ: Nhà máy"
							required
						>
							<FormLabel>Tên loại dự án tiếng Việt</FormLabel>
							<FormInput defaultValue={projectCategory.name.vi} />
							<FieldError />
						</FormField>

						<FormField
							fieldId="projectCategoryNameEn"
							name="projectCategoryNameEn"
							placeholder="Ví dụ: Factory"
						>
							<FormLabel>Tên loại dự án tiếng Anh</FormLabel>
							<FormInput defaultValue={projectCategory.name.en} />
							<FieldError />
						</FormField>
					</div>
				</AdminFormSection>

				<FormErrorDisplay />

				<AdminStickyActions note="Sau khi lưu, các dự án thuộc loại này sẽ hiển thị theo tên mới.">
					<DialogClose asChild>
						<FormResetButton>Đóng</FormResetButton>
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