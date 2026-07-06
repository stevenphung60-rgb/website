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
import { createProjectCategory } from "./create-projectcategory-dialog.actions";

/**
 * Create project category form
 * @returns Project category creation form for admin users
 */
export function CreateProjectCategoryForm() {
	return (
		<Form action={createProjectCategory}>
			<div className="space-y-6">
				<AdminFormSection
					title="Thông tin loại dự án"
					description="Nhập tên loại dự án. Tiếng Việt là nội dung chính trên website."
				>
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormField
							fieldId="projectCategoryNameVi"
							name="projectCategoryNameVi"
							placeholder="Ví dụ: Nhà máy"
							required
						>
							<FormLabel>Tên loại dự án tiếng Việt</FormLabel>
							<FormInput />
							<FieldError />
						</FormField>

						<FormField
							fieldId="projectCategoryNameEn"
							name="projectCategoryNameEn"
							placeholder="Ví dụ: Factory"
						>
							<FormLabel>Tên loại dự án tiếng Anh</FormLabel>
							<FormInput />
							<FieldError />
						</FormField>
					</div>
				</AdminFormSection>

				<FormErrorDisplay />

				<AdminStickyActions note="Sau khi lưu, loại dự án có thể dùng để phân nhóm dự án trên website.">
					<DialogClose asChild>
						<Button type="button" variant="outline" className="border-[#E7D0AF] bg-white text-[#342312] hover:bg-[#FAF7F1]">
							Hủy
						</Button>
					</DialogClose>

					<Button
						type="submit"
						className="bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B]"
					>
						<FormSubmitMessage>Tạo loại dự án</FormSubmitMessage>
						<FormPendingMessage>Đang tạo...</FormPendingMessage>
					</Button>
				</AdminStickyActions>
			</div>
		</Form>
	);
}
