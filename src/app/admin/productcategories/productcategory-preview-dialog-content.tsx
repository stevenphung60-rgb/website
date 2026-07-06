import { Tags } from "lucide-react";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "src/components/ui/dialog";
import { getProductCategoryById } from "src/server/productcategories";

interface ProductCategoryPreviewDialogContentProps {
	productCategoryId: string;
}

/**
 * Product category preview dialog content
 * @param props - Product category preview dialog props
 * @returns Product category preview content
 */
export async function ProductCategoryPreviewDialogContent({
	productCategoryId,
}: ProductCategoryPreviewDialogContentProps) {
	const productCategory = await getProductCategoryById(productCategoryId);

	if (!productCategory) {
		return <NotFoundProductCategoryPreviewDialogContent />;
	}

	const nameVi = productCategory.name.vi || productCategory.name.en || "Chưa có tên";
	const nameEn = productCategory.name.en || productCategory.name.vi || "No English name";

	return (
		<DialogContent className="max-h-[95vh] w-[95vw] max-w-3xl overflow-y-auto bg-[#FAF7F1] p-0">
			<DialogHeader className="sticky top-0 z-10 border-b border-[#E7D0AF] bg-white px-5 py-5 sm:px-6">
				<div className="flex items-start gap-4">
					<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#342312]/10 text-[#342312]">
						<Tags className="size-5" />
					</div>

					<div className="min-w-0">
						<DialogTitle className="break-words font-serif text-2xl font-bold text-[#342312]">
							Xem nhanh loại sản phẩm
						</DialogTitle>

						<DialogDescription className="mt-2 break-words text-sm leading-6 text-[#342312]/70">
							Kiểm tra nhanh tên loại sản phẩm đang dùng để phân nhóm sản phẩm trên website.
						</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<div className="space-y-4 px-5 py-6 sm:px-6">
				<div className="rounded-2xl border border-[#E7D0AF] bg-white p-4">
					<div className="space-y-4">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
								Tên tiếng Việt
							</p>

							<p className="mt-1 break-words text-lg font-semibold text-[#342312]">
								{nameVi}
							</p>
						</div>

						<div className="border-t border-[#E7D0AF]/70 pt-4">
							<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
								Tên tiếng Anh
							</p>

							<p className="mt-1 break-words text-sm text-[#342312]/75">
								{nameEn}
							</p>
						</div>
					</div>
				</div>

				<div className="rounded-2xl border border-[#E7D0AF] bg-white p-4">
					<div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
								Ngày tạo
							</p>

							<p className="mt-1 text-[#342312]/75">
								{new Date(productCategory.createdAt).toLocaleString("vi-VN")}
							</p>
						</div>

						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
								Cập nhật gần nhất
							</p>

							<p className="mt-1 text-[#342312]/75">
								{new Date(productCategory.updatedAt).toLocaleString("vi-VN")}
							</p>
						</div>
					</div>
				</div>

				<div className="rounded-2xl border border-dashed border-[#E7D0AF] bg-white p-4">
					<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
						ID hệ thống
					</p>

					<p className="mt-1 break-all text-sm italic text-[#342312]/60">
						{productCategory.id}
					</p>
				</div>
			</div>
		</DialogContent>
	);
}

/**
 * Product category preview not found content
 * @returns Not found dialog content
 */
function NotFoundProductCategoryPreviewDialogContent() {
	return (
		<DialogContent className="max-h-[95vh] w-[95vw] max-w-3xl overflow-y-auto bg-white p-0">
			<DialogHeader className="border-b border-[#E7D0AF] px-5 py-5 sm:px-6">
				<DialogTitle className="font-serif text-2xl font-bold text-[#342312]">
					Không tìm thấy loại sản phẩm
				</DialogTitle>

				<DialogDescription className="mt-2 text-sm text-[#342312]/70">
					Loại sản phẩm này có thể đã bị xóa hoặc không còn tồn tại trong hệ thống.
				</DialogDescription>
			</DialogHeader>

			<div className="px-5 py-6 sm:px-6">
				<p className="text-sm text-[#342312]/70">
					Vui lòng đóng cửa sổ này và tải lại danh sách loại sản phẩm.
				</p>
			</div>
		</DialogContent>
	);
}