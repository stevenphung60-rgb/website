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
import { createProductCategory } from "./create-productcategory-dialog.actions";

/**
 * Create product category form
 * @returns Product category creation form for admin users
 */
export function CreateProductCategoryForm() {
	return (
		<Form action={createProductCategory}>
			<div className="space-y-6">
				<AdminFormSection
					title="Thông tin loại sản phẩm"
					description="Nhập tên loại sản phẩm. Tiếng Việt là nội dung chính trên website."
				>
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormField
							fieldId="productCategoryNameVi"
							name="productCategoryNameVi"
							placeholder="Ví dụ: Ống gió vuông"
							required
						>
							<FormLabel>Tên loại sản phẩm tiếng Việt</FormLabel>
							<FormInput />
							<FieldError />
						</FormField>

						<FormField
							fieldId="productCategoryNameEn"
							name="productCategoryNameEn"
							placeholder="Ví dụ: Rectangular ducts"
						>
							<FormLabel>Tên loại sản phẩm tiếng Anh</FormLabel>
							<FormInput />
							<FieldError />
						</FormField>
					</div>
				</AdminFormSection>

				<FormErrorDisplay />

				<AdminStickyActions note="Sau khi lưu, loại sản phẩm có thể dùng để phân nhóm sản phẩm trên website.">
					<DialogClose asChild>
						<Button type="button" variant="outline" className="border-[#E7D0AF] bg-white text-[#342312] hover:bg-[#FAF7F1]">
							Hủy
						</Button>
					</DialogClose>

					<Button
						type="submit"
						className="bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B]"
					>
						<FormSubmitMessage>Tạo loại sản phẩm</FormSubmitMessage>
						<FormPendingMessage>Đang tạo...</FormPendingMessage>
					</Button>
				</AdminStickyActions>
			</div>
		</Form>
	);
}
