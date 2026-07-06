import { Edit, Eye, MoreHorizontal, Tags, Trash2 } from "lucide-react";
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
import { deleteProductCategoryAction } from "./delete-productcategory.actions";
import {
	ProductCategoryEditTrigger,
	ProductCategoryPreviewTrigger,
} from "./productcategory-dialog-triggers";
import { ProductCategoryEditDialogContent } from "./productcategory-edit-dialog-content";
import { ProductCategoryPreviewDialogContent } from "./productcategory-preview-dialog-content";
import { ProductCategoryRowDialog } from "./productcategory-row-context.ui";

interface ProductCategoryRowProps {
	productCategoryId: string;
}

/**
 * Display a single product category row in the admin list
 * @param props - Product category row props
 * @returns Product category row with preview, edit, and delete actions
 */
export async function ProductCategoryRow({
	productCategoryId,
}: ProductCategoryRowProps) {
	const productCategory = await getProductCategoryById(productCategoryId);

	if (!productCategory) {
		throw new Error(`Product category with id ${productCategoryId} not found`);
	}

	const nameVi = productCategory.name.vi || "Chưa có tên tiếng Việt";
	const nameEn = productCategory.name.en || "Chưa có tên tiếng Anh";
	const updatedAt = new Date(productCategory.updatedAt).toLocaleDateString("vi-VN", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

	return (
		<div className="bg-white px-4 py-4 transition-colors hover:bg-[#FAF7F1] sm:px-5">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_10rem_5rem] lg:items-center lg:gap-4">
				<div className="flex min-w-0 items-start gap-4">
					<div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] text-[#342312]">
						<Tags className="size-5" />
					</div>

					<div className="min-w-0">
						<p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55 lg:hidden">
							Tên tiếng Việt
						</p>

						<p className="truncate text-sm font-semibold text-[#342312]">
							{nameVi}
						</p>

						<p className="mt-1 text-xs italic text-[#342312]/60 lg:hidden">
							Tên tiếng Anh: {nameEn}
						</p>
					</div>
				</div>

				<div className="hidden min-w-0 lg:block">
					<p className="truncate text-sm text-[#342312]/75">{nameEn}</p>
				</div>

				<div className="min-w-0">
					<p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55 lg:hidden">
						Cập nhật
					</p>

					<p className="truncate text-sm text-[#342312]/70">{updatedAt}</p>
				</div>

				<div className="flex items-center justify-end">
					<Form action={deleteProductCategoryAction} confirmBeforeSubmit>
						<input
							type="hidden"
							name="productCategoryId"
							value={productCategory.id}
						/>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="text-[#342312]">
									<MoreHorizontal className="size-4" />
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align="end" className="w-52 bg-white">
								<ProductCategoryPreviewTrigger className="flex w-full items-center gap-2">
									<Eye className="size-4" />
									Xem nhanh
								</ProductCategoryPreviewTrigger>

								<ProductCategoryEditTrigger className="flex w-full items-center gap-2">
									<Edit className="size-4" />
									Sửa thông tin
								</ProductCategoryEditTrigger>

								<SubmitButton asChild className="flex w-full items-center gap-2">
									<DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
										<Trash2 className="size-4" />
										Xóa loại sản phẩm
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
											<DialogTitle>Xóa loại sản phẩm</DialogTitle>

											<DialogDescription>
												Thao tác này không thể hoàn tác. Loại sản phẩm sẽ bị xóa khỏi hệ thống.
											</DialogDescription>
										</div>
									</div>
								</DialogHeader>

								<div className="space-y-3">
									<div className="rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] p-4">
										<p className="font-medium text-[#342312]">{nameVi}</p>

										<p className="mt-1 text-sm text-[#342312]/65">{nameEn}</p>
									</div>

									<FormErrorDisplay />
								</div>

								<DialogFooter className="gap-2">
									<CancelButton>Hủy</CancelButton>

									<ConfirmButton variant="destructive">
										<FormSubmitMessage>Xóa loại sản phẩm</FormSubmitMessage>
										<FormPendingMessage>Đang xóa...</FormPendingMessage>
									</ConfirmButton>
								</DialogFooter>
							</DialogContent>
						</ConfirmDialog>
					</Form>
				</div>
			</div>

			<ProductCategoryRowDialog type="preview">
				<ProductCategoryPreviewDialogContent productCategoryId={productCategory.id} />
			</ProductCategoryRowDialog>

			<ProductCategoryRowDialog type="edit">
				<ProductCategoryEditDialogContent productCategory={productCategory} />
			</ProductCategoryRowDialog>
		</div>
	);
}