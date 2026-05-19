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
import { Textarea } from "src/components/ui/textarea";
import {
	VisualTabs,
	VisualTabsContent,
	VisualTabsList,
	VisualTabsTrigger,
} from "src/components/ui/visual-tabs";
import { getProductCategories, type ProductCategory } from "src/server/productcategories";
import type { Product } from "src/server/products";
import { ProductStatus } from "src/server/products";
import { updateProduct } from "./edit-product-dialog.actions";

interface EditProductFormProps {
	product: Product;
}

export async function EditProductForm({ product }: EditProductFormProps) {
	const productCategories = await getProductCategories();

	return (
		<Form action={updateProduct}>
			<input type="hidden" name="productId" value={product.id} />

			<div className="space-y-6">
				<FormField
					fieldId="productCode"
					name="productCode"
					placeholder="Enter product code"
					required
				>
					<FormLabel>Product Code</FormLabel>
					<FormInput defaultValue={product.code} />
					<FieldError />
				</FormField>

				<div className="space-y-4">
					<FormField>
						<FormLabel>Product Name</FormLabel>
						<VisualTabs defaultValue="en" className="w-full">
							<VisualTabsList className="grid w-full grid-cols-2">
								<VisualTabsTrigger value="en">English</VisualTabsTrigger>
								<VisualTabsTrigger value="vi">Tiếng Việt</VisualTabsTrigger>
							</VisualTabsList>
							<VisualTabsContent value="en">
								<FormField
									fieldId="productNameEn"
									name="productNameEn"
									placeholder="Enter product name in English"
								>
									<FormInput defaultValue={product.name.en} />
									<FieldError />
								</FormField>
							</VisualTabsContent>
							<VisualTabsContent value="vi">
								<FormField
									fieldId="productNameVi"
									name="productNameVi"
									placeholder="Nhập tên sản phẩm bằng tiếng Việt"
								>
									<FormInput defaultValue={product.name.vi} />
									<FieldError />
								</FormField>
							</VisualTabsContent>
						</VisualTabs>
					</FormField>
				</div>

				<div className="space-y-4">
					<FormField>
						<FormLabel>Product Description</FormLabel>
						<VisualTabs defaultValue="en" className="w-full">
							<VisualTabsList className="grid w-full grid-cols-2">
								<VisualTabsTrigger value="en">English</VisualTabsTrigger>
								<VisualTabsTrigger value="vi">Tiếng Việt</VisualTabsTrigger>
							</VisualTabsList>
							<VisualTabsContent value="en">
								<FormField
									fieldId="productDescriptionEn"
									name="productDescriptionEn"
									placeholder="Enter product description in English"
								>
									<FormInput asChild defaultValue={product.description.en}>
										<Textarea rows={4} />
									</FormInput>
									<FieldError />
								</FormField>
							</VisualTabsContent>
							<VisualTabsContent value="vi">
								<FormField
									fieldId="productDescriptionVi"
									name="productDescriptionVi"
									placeholder="Nhập mô tả sản phẩm bằng tiếng Việt"
								>
									<FormInput asChild defaultValue={product.description.vi}>
										<Textarea rows={4} />
									</FormInput>
									<FieldError />
								</FormField>
							</VisualTabsContent>
						</VisualTabs>
					</FormField>
				</div>
			</div>

			<div className="space-y-4">
				<FormField fieldId="productCategoryId" name="productCategoryId">
					<FormLabel>
						Product Category <span className="text-muted-foreground font-normal">(optional)</span>
					</FormLabel>

					<select
						id="productCategoryId"
						name="productCategoryId"
						defaultValue={product.categoryId ?? ""}
						className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
					>
						<option value="">Select category</option>
						{productCategories.map((category: ProductCategory) => (
							<option key={category.id} value={category.id}>
								{category.name.en} - {category.name.vi}
							</option>
						))}
					</select>

					<FieldError />
				</FormField>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<div className="text-sm font-medium text-foreground">Product Status</div>
					<p className="text-xs text-muted-foreground">
						Choose whether to publish the product immediately or save as draft
					</p>
				</div>

				<FormField fieldId="productStatus" name="productStatus" required>
					<div className="flex space-x-1 p-1 bg-muted rounded-lg">
						<label className="flex-1">
							<input
								type="radio"
								name="productStatus"
								value={ProductStatus.Draft}
								className="sr-only peer"
								defaultChecked={product.status === ProductStatus.Draft}
							/>
							<div className="flex items-center justify-center py-2 px-4 text-sm font-medium rounded-md cursor-pointer transition-all peer-checked:bg-slate-100 peer-checked:text-slate-700 peer-checked:shadow-sm text-muted-foreground hover:text-foreground peer-checked:border peer-checked:border-slate-200">
								Draft
							</div>
						</label>
						<label className="flex-1">
							<input
								type="radio"
								name="productStatus"
								value={ProductStatus.Active}
								className="sr-only peer"
								defaultChecked={product.status === ProductStatus.Active}
							/>
							<div className="flex items-center justify-center py-2 px-4 text-sm font-medium rounded-md cursor-pointer transition-all peer-checked:bg-green-100 peer-checked:text-green-600 peer-checked:shadow-sm text-green-600 hover:text-green-700 peer-checked:border peer-checked:border-green-200">
								Active
							</div>
						</label>
					</div>
					<FieldError />
				</FormField>
			</div>

			<FormErrorDisplay />

			<div className="flex justify-end space-x-2 pt-4">
				<DialogClose asChild>
					<FormResetButton>Close</FormResetButton>
				</DialogClose>

				<Button type="submit">
					<FormSubmitMessage>Update Product</FormSubmitMessage>
					<FormPendingMessage>Updating...</FormPendingMessage>
				</Button>
			</div>
		</Form>
	);
}