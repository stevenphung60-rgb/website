import { ImageIcon } from "lucide-react";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "src/components/ui/dialog";
import type { Product } from "src/server/products";
import { ImageManagementProvider } from "./edit-product-images/image-management-dialog.state";
import type { ExistingImage } from "./edit-product-images/image-management-dialog.type";
import { ImageManagementContent } from "./edit-product-images/image-management-dialog.ui";

interface ProductImageDialogContentProps {
	product: Product;
}

/**
 * Product image management dialog content
 * @param props - Product image dialog props
 * @returns Image management dialog content for a product
 */
export function ProductImageDialogContent({ product }: ProductImageDialogContentProps) {
	const productName = product.name.vi || product.name.en || "Sản phẩm";

	const existingImages: ExistingImage[] = product.gallery.map((image, index) => ({
		id: image.key,
		type: "existing" as const,
		url: image.url,
		name: `${productName} - ảnh ${index + 1}`,
	}));

	const mainImage = product.gallery.find((image) => image.isMain);
	const mainImageId = mainImage ? mainImage.key : existingImages[0]?.id || null;

	return (
		<DialogContent className="max-h-[95vh] w-[95vw] max-w-5xl overflow-y-auto bg-[#FAF7F1] p-0">
			<DialogHeader className="sticky top-0 z-10 border-b border-[#E7D0AF] bg-white px-5 py-5 sm:px-6">
				<div className="flex items-start gap-4">
					<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#342312]/10 text-[#342312]">
						<ImageIcon className="size-5" />
					</div>

					<div className="min-w-0">
						<DialogTitle className="break-words font-serif text-2xl font-bold text-[#342312]">
							Quản lý ảnh sản phẩm
						</DialogTitle>

						<DialogDescription className="mt-2 break-words text-sm leading-6 text-[#342312]/70">
							Đang chỉnh ảnh cho:{" "}
							<span className="font-semibold text-[#342312]">{productName}</span>.
							Anh có thể thêm ảnh mới, xóa ảnh không dùng và chọn ảnh đại diện cho sản phẩm.
						</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<div className="px-5 py-6 sm:px-6">
				<ImageManagementProvider existingImages={existingImages} mainImageId={mainImageId}>
					<ImageManagementContent productId={product.id} />
				</ImageManagementProvider>
			</div>
		</DialogContent>	
	);
}