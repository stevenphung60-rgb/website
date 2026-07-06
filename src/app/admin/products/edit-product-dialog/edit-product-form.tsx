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
import { Textarea } from "src/components/ui/textarea";
import { getProductCategories, type ProductCategory } from "src/server/productcategories";
import type { Product } from "src/server/products";
import { ProductStatus } from "src/server/products";
import { updateProduct } from "./edit-product-dialog.actions";

interface EditProductFormProps {
	product: Product;
}

/**
 * Edit product form
 * @param props - Edit product form props
 * @returns Product edit form for admin users
 */
export async function EditProductForm({ product }: EditProductFormProps) {
	const productCategories = await getProductCategories();

	return (
		<Form action={updateProduct}>
			<input type="hidden" name="productId" value={product.id} />

			<div className="space-y-6">
				<AdminFormSection
					title="Thông tin cơ bản"
					description="Cập nhật tên, mã sản phẩm, danh mục và trạng thái hiển thị. Tiếng Việt là nội dung chính trên website."
				>
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormField
							fieldId="productNameVi"
							name="productNameVi"
							placeholder="Ví dụ: Ống gió vuông"
							required
						>
							<FormLabel>Tên sản phẩm tiếng Việt *</FormLabel>
							<FormInput defaultValue={product.name.vi} />
							<FieldError />
						</FormField>

						<FormField
							fieldId="productNameEn"
							name="productNameEn"
							placeholder="Ví dụ: Rectangular air duct"
						>
							<FormLabel>Tên sản phẩm tiếng Anh</FormLabel>
							<FormInput defaultValue={product.name.en} />
							<FieldError />
						</FormField>
					</div>

					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormField
							fieldId="productCode"
							name="productCode"
							placeholder="Ví dụ: NH-ODV-001"
							required
						>
							<FormLabel>Mã sản phẩm *</FormLabel>
							<FormInput defaultValue={product.code} />
							<FieldError />
						</FormField>

						<FormField fieldId="productCategoryId" name="productCategoryId">
							<FormLabel>Danh mục sản phẩm</FormLabel>

							<select
								id="productCategoryId"
								name="productCategoryId"
								defaultValue={product.categoryId ?? ""}
								className="flex h-10 w-full rounded-lg border border-[#E7D0AF] bg-white px-3 py-2 text-sm text-[#342312] shadow-sm outline-none transition focus:border-[#342312] focus:ring-2 focus:ring-[#342312]/10"
							>
								<option value="">Chưa phân loại</option>

								{productCategories.map((category: ProductCategory) => (
									<option key={category.id} value={category.id}>
										{category.name.vi || category.name.en}
										{category.name.en ? ` - ${category.name.en}` : ""}
									</option>
								))}
							</select>

							<FieldError />
						</FormField>
					</div>

					<FormField fieldId="productStatus" name="productStatus" required>
						<FormLabel>Trạng thái hiển thị *</FormLabel>

						<div className="grid grid-cols-1 gap-3 rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] p-2 sm:grid-cols-2">
							<label className="block">
								<input
									type="radio"
									name="productStatus"
									value={ProductStatus.Draft}
									className="peer sr-only"
									defaultChecked={product.status === ProductStatus.Draft}
								/>

								<div className="cursor-pointer rounded-lg border border-transparent bg-white px-4 py-3 text-sm transition peer-checked:border-yellow-300 peer-checked:bg-yellow-50 peer-checked:text-yellow-700">
									<p className="font-semibold">Bản nháp</p>
									<p className="mt-1 text-xs text-current/70">
										Lưu nội dung nhưng chưa hiển thị ngoài website.
									</p>
								</div>
							</label>

							<label className="block">
								<input
									type="radio"
									name="productStatus"
									value={ProductStatus.Active}
									className="peer sr-only"
									defaultChecked={product.status === ProductStatus.Active}
								/>

								<div className="cursor-pointer rounded-lg border border-transparent bg-white px-4 py-3 text-sm transition peer-checked:border-green-300 peer-checked:bg-green-50 peer-checked:text-green-700">
									<p className="font-semibold">Đang hiển thị</p>
									<p className="mt-1 text-xs text-current/70">
										Sản phẩm sẽ được hiển thị trên website public.
									</p>
								</div>
							</label>
						</div>

						<FieldError />
					</FormField>
				</AdminFormSection>

				<AdminFormSection
					title="Mô tả sản phẩm"
					description="Cập nhật mô tả hiển thị ở trang chi tiết sản phẩm. Có thể để tiếng Anh giống tiếng Việt nếu chưa có bản dịch."
				>
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormField
							fieldId="productDescriptionVi"
							name="productDescriptionVi"
							placeholder="Nhập mô tả sản phẩm bằng tiếng Việt"
							required
						>
							<FormLabel>Mô tả tiếng Việt *</FormLabel>

							<FormInput asChild defaultValue={product.description.vi}>
								<Textarea rows={6} />
							</FormInput>

							<FieldError />
						</FormField>

						<FormField
							fieldId="productDescriptionEn"
							name="productDescriptionEn"
							placeholder="Enter product description in English"
						>
							<FormLabel>Mô tả tiếng Anh</FormLabel>

							<FormInput asChild defaultValue={product.description.en}>
								<Textarea rows={6} />
							</FormInput>

							<FieldError />
						</FormField>
					</div>
				</AdminFormSection>

				<FormErrorDisplay />

				<AdminStickyActions note="Sau khi lưu, thông tin sản phẩm sẽ được cập nhật trên website nếu trạng thái là Đang hiển thị.">
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