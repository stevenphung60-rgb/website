import { Edit } from "lucide-react";
import { DialogContent, DialogHeader, DialogTitle } from "src/components/ui/dialog";
import type { ProductCategory } from "src/server/productcategories";
import { EditProductCategoryForm } from "./edit-productcategory-dialog/edit-productcategory-form";

interface ProductCategoryEditDialogContentProps {
	productCategory: ProductCategory;
}

export function ProductCategoryEditDialogContent({
	productCategory,
}: ProductCategoryEditDialogContentProps) {
	return (
		<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
			<DialogHeader>
				<DialogTitle className="flex items-center gap-2">
					<Edit className="size-5" />
					Edit Product Category: {productCategory.name.en}
				</DialogTitle>
			</DialogHeader>

			<EditProductCategoryForm productCategory={productCategory} />
		</DialogContent>
	);
}