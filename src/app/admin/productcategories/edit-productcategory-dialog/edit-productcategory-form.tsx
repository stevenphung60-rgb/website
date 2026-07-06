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
import type { ProductCategory } from "src/server/productcategories";
import { updateProductCategory } from "./edit-productcategory-dialog.actions";

interface EditProductCategoryFormProps {
	productCategory: ProductCategory;
}

/**
 * Edit product category form
 * @param props - Edit product category form props
 * @returns Product category edit form for admin users
 */
export function EditProductCategoryForm({
	productCategory,
}: EditProductCategoryFormProps) {
	return (
		<Form action={updateProductCategory}>
			<input type="hidden" name="productCategoryId" value={productCategory.id} />

			<div className="space-y-6">
				<AdminFormSection
					title="Thông tin loại sản phẩm"
					description="Cập nhật tên loại sản phẩm. Tiếng Việt là nội dung chính trên website."
				>
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormField
							fieldId="productCategoryNameVi"
							name="productCategoryNameVi"
							placeholder="Ví dụ: Ống gió vuông"
							required
						>
							<FormLabel>Tên loại sản phẩm tiếng Việt</FormLabel>
							<FormInput defaultValue={productCategory.name.vi} />
							<FieldError />
						</FormField>

						<FormField
							fieldId="productCategoryNameEn"
							name="productCategoryNameEn"
							placeholder="Ví dụ: Rectangular ducts"
						>
							<FormLabel>Tên loại sản phẩm tiếng Anh</FormLabel>
							<FormInput defaultValue={productCategory.name.en} />
							<FieldError />
						</FormField>
					</div>
				</AdminFormSection>

				<FormErrorDisplay />

				<AdminStickyActions note="Sau khi lưu, các sản phẩm thuộc loại này sẽ hiển thị theo tên mới.">
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