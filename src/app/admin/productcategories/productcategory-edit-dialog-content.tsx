import { Edit } from "lucide-react";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "src/components/ui/dialog";
import type { ProductCategory } from "src/server/productcategories";
import { EditProductCategoryForm } from "./edit-productcategory-dialog/edit-productcategory-form";

interface ProductCategoryEditDialogContentProps {
	productCategory: ProductCategory;
}

/**
 * Product category edit dialog content
 * @param props - Product category edit dialog content props
 * @returns Edit product category dialog content
 */
export function ProductCategoryEditDialogContent({
	productCategory,
}: ProductCategoryEditDialogContentProps) {
	const categoryName =
		productCategory.name.vi || productCategory.name.en || "Loại sản phẩm";

	return (
		<DialogContent className="max-h-[95vh] w-[95vw] max-w-3xl overflow-y-auto bg-[#FAF7F1] p-0">
			<DialogHeader className="sticky top-0 z-10 border-b border-[#E7D0AF] bg-white px-5 py-5 sm:px-6">
				<div className="flex items-start gap-4">
					<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#342312]/10 text-[#342312]">
						<Edit className="size-5" />
					</div>

					<div className="min-w-0">
						<DialogTitle className="break-words font-serif text-2xl font-bold text-[#342312]">
							Sửa loại sản phẩm
						</DialogTitle>

						<DialogDescription className="mt-2 break-words text-sm leading-6 text-[#342312]/70">
							Đang chỉnh sửa:{" "}
							<span className="font-semibold text-[#342312]">{categoryName}</span>.
						</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<div className="px-5 py-6 sm:px-6">
				<EditProductCategoryForm productCategory={productCategory} />
			</div>
		</DialogContent>
	);
}