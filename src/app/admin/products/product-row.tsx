import { Edit, Eye, ImageIcon, MoreHorizontal, Package, Trash2 } from "lucide-react";
import Image from "next/image";
import { AdminStatusBadge } from "src/components/admin/admin-status-badge";
import {
	CancelButton,
	ConfirmButton,
	ConfirmDialog,
	Form,
	FormErrorDisplay,
	FormPendingMessage,
	FormSubmitMessage,
	SubmitButton,
} from "src/components/form-state";
import { Button } from "src/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "src/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import { getProductCategoryById } from "src/server/productcategories";
import { getProductById } from "src/server/products";
import { deleteProductAction } from "./delete-product.actions";
import {
	ProductEditTrigger,
	ProductImageTrigger,
	ProductPreviewTrigger,
} from "./product-dialog-triggers";
import { ProductEditDialogContent } from "./product-edit-dialog-content";
import { ProductImageDialogContent } from "./product-image-dialog-content";
import { ProductPreviewDialogContent } from "./product-preview-dialog-content";
import { ProductRowDialog } from "./product-row-context.ui";

interface ProductRowProps {
	productId: string;
}

/**
 * Display a single product row in the admin product list
 * @param props - Product row props
 * @returns Product row with preview, edit, image management, and delete actions
 */
export async function ProductRow({ productId }: ProductRowProps) {
	const product = await getProductById(productId);

	if (!product) {
		throw new Error(`Product with id ${productId} not found`);
	}

	const productCategory = product.categoryId
		? await getProductCategoryById(product.categoryId)
		: null;

	const mainImage = product.gallery.find((image) => image.isMain) || product.gallery[0];
	const productName = product.name.vi || product.name.en || "Chưa có tên sản phẩm";
	const productNameEn = product.name.en || "Chưa có tên tiếng Anh";
	const productNameVi = product.name.vi || "Chưa có tên tiếng Việt";
	const categoryName = productCategory
		? `${productCategory.name.vi || productCategory.name.en}`
		: "Chưa phân loại";

	return (
		<div className="bg-white px-4 py-4 transition-colors hover:bg-[#FAF7F1] sm:px-5">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-[5rem_minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_8rem_5rem] lg:items-center lg:gap-4">
				<div className="flex items-start gap-4 lg:block">
					<div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] lg:size-16">
						{mainImage ? (
							<Image
								src={mainImage.url}
								alt={productName}
								fill
								className="object-cover"
								sizes="80px"
							/>
						) : (
							<div className="flex size-full items-center justify-center">
								<Package className="size-7 text-[#342312]/45" />
							</div>
						)}
					</div>

					<div className="min-w-0 lg:hidden">
						<h3 className="break-words text-base font-semibold text-[#342312]">
							{productNameVi}
						</h3>

						<p className="mt-1 break-words text-sm text-[#342312]/65">
							{productNameEn}
						</p>

						<div className="mt-3 flex flex-wrap items-center gap-2">
							<AdminStatusBadge status={product.status} />
							<span className="rounded-full border border-[#E7D0AF] bg-white px-2.5 py-1 text-xs font-semibold text-[#342312]/70">
								{product.gallery.length} ảnh
							</span>
						</div>
					</div>
				</div>

				<div className="hidden min-w-0 lg:block">
					<h3 className="truncate text-sm font-semibold text-[#342312]">
						{productNameVi}
					</h3>

					<p className="mt-1 truncate text-sm text-[#342312]/65">
						{productNameEn}
					</p>

					<p className="mt-1 truncate text-xs text-[#342312]/50">
						Cập nhật:{" "}
						{new Date(product.updatedAt).toLocaleDateString("vi-VN", {
							year: "numeric",
							month: "2-digit",
							day: "2-digit",
						})}
					</p>
				</div>

				<div className="min-w-0 lg:block">
					<p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55 lg:hidden">
						Mã sản phẩm
					</p>

					<p className="truncate text-sm font-medium text-[#342312]">
						{product.code || "Chưa nhập"}
					</p>
				</div>

				<div className="min-w-0 lg:block">
					<p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55 lg:hidden">
						Danh mục
					</p>

					<p className="truncate text-sm text-[#342312]/75">{categoryName}</p>
				</div>

				<div className="hidden lg:block">
					<AdminStatusBadge status={product.status} />
				</div>

				<div className="flex items-center justify-end">
					<Form action={deleteProductAction} confirmBeforeSubmit>
						<input type="hidden" name="productId" value={product.id} />

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="text-[#342312]">
									<MoreHorizontal className="size-4" />
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align="end" className="w-52 bg-white">
								<ProductPreviewTrigger className="flex w-full items-center gap-2">
									<Eye className="size-4" />
									Xem nhanh
								</ProductPreviewTrigger>

								<ProductEditTrigger className="flex w-full items-center gap-2">
									<Edit className="size-4" />
									Sửa thông tin
								</ProductEditTrigger>

								<ProductImageTrigger className="flex w-full items-center gap-2">
									<ImageIcon className="size-4" />
									Quản lý ảnh
								</ProductImageTrigger>

								<SubmitButton asChild className="flex w-full items-center gap-2">
									<DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
										<Trash2 className="size-4" />
										Xóa sản phẩm
									</DropdownMenuItem>
								</SubmitButton>
							</DropdownMenuContent>
						</DropdownMenu>

						<ConfirmDialog>
							<DialogContent className="bg-white sm:max-w-2xl">
								<DialogHeader className="space-y-3">
									<div className="flex items-start gap-3">
										<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
											<Trash2 className="size-5 text-destructive" />
										</div>

										<div className="space-y-1">
											<DialogTitle>Xóa sản phẩm</DialogTitle>

											<DialogDescription>
												Thao tác này không thể hoàn tác. Sản phẩm và hình ảnh liên quan sẽ bị xóa khỏi hệ thống.
											</DialogDescription>
										</div>
									</div>
								</DialogHeader>

								<div className="space-y-3">
									<div className="rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] p-4">
										<p className="font-medium text-[#342312]">{productNameVi}</p>

										<p className="mt-1 text-sm text-[#342312]/65">{productNameEn}</p>

										{product.code ? (
											<p className="mt-2 text-xs font-medium text-[#342312]/65">
												Mã sản phẩm: {product.code}
											</p>
										) : null}

										<p className="mt-2 text-xs text-[#342312]/65">
											{product.gallery.length} ảnh sẽ bị xóa cùng sản phẩm này.
										</p>
									</div>

									<FormErrorDisplay />
								</div>

								<DialogFooter className="gap-2">
									<CancelButton>Hủy</CancelButton>

									<ConfirmButton variant="destructive">
										<FormSubmitMessage>Xóa sản phẩm</FormSubmitMessage>
										<FormPendingMessage>Đang xóa...</FormPendingMessage>
									</ConfirmButton>
								</DialogFooter>
							</DialogContent>
						</ConfirmDialog>
					</Form>
				</div>
			</div>

			<ProductRowDialog type="preview">
				<ProductPreviewDialogContent productId={product.id} />
			</ProductRowDialog>

			<ProductRowDialog type="edit">
				<ProductEditDialogContent product={product} />
			</ProductRowDialog>

			<ProductRowDialog type="image">
				<ProductImageDialogContent product={product} />
			</ProductRowDialog>
		</div>
	);
}