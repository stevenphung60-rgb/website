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
import {
	VisualTabs,
	VisualTabsContent,
	VisualTabsList,
	VisualTabsTrigger,
} from "src/components/ui/visual-tabs";
import type { ProductCategory } from "src/server/productcategories";
import { updateProductCategory } from "./edit-productcategory-dialog.actions";

interface EditProductCategoryFormProps {
	productCategory: ProductCategory;
}

export function EditProductCategoryForm({ productCategory }: EditProductCategoryFormProps) {
	return (
		<Form action={updateProductCategory}>
			<input type="hidden" name="productCategoryId" value={productCategory.id} />

			<div className="space-y-6">
				<div className="space-y-4">
					<FormField>
						<FormLabel>Product Category Name</FormLabel>

						<VisualTabs defaultValue="en" className="w-full">
							<VisualTabsList className="grid w-full grid-cols-2">
								<VisualTabsTrigger value="en">English</VisualTabsTrigger>
								<VisualTabsTrigger value="vi">Tiếng Việt</VisualTabsTrigger>
							</VisualTabsList>

							<VisualTabsContent value="en">
								<FormField
									fieldId="productCategoryNameEn"
									name="productCategoryNameEn"
									placeholder="Enter product category name in English"
									required
								>
									<FormInput defaultValue={productCategory.name.en} />
									<FieldError />
								</FormField>
							</VisualTabsContent>

							<VisualTabsContent value="vi">
								<FormField
									fieldId="productCategoryNameVi"
									name="productCategoryNameVi"
									placeholder="Nhập tên danh mục sản phẩm bằng tiếng Việt"
									required
								>
									<FormInput defaultValue={productCategory.name.vi} />
									<FieldError />
								</FormField>
							</VisualTabsContent>
						</VisualTabs>
					</FormField>
				</div>
			</div>

			<FormErrorDisplay />

			<div className="flex justify-end space-x-2 pt-4">
				<DialogClose asChild>
					<FormResetButton>Close</FormResetButton>
				</DialogClose>

				<Button type="submit">
					<FormSubmitMessage>Update Product Category</FormSubmitMessage>
					<FormPendingMessage>Updating...</FormPendingMessage>
				</Button>
			</div>
		</Form>
	);
}