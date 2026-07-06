import { ChevronLeft, ChevronRight, Wrench } from "lucide-react";
import { AdminStatusBadge } from "src/components/admin/admin-status-badge";
import {
	convertToGalleryImages,
	GalleryBackButton,
	GalleryImage,
	GalleryNextButton,
	GalleryRoot,
	GalleryThumbnails,
} from "src/components/image-gallery/image-gallery";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "src/components/ui/dialog";
import { getServiceById } from "src/server/services";

interface ServicePreviewDialogContentProps {
	serviceId: string;
}

/**
 * Service preview dialog content
 * @param props - Service preview dialog props
 * @returns Service preview content for admin users
 */
export async function ServicePreviewDialogContent({
	serviceId,
}: ServicePreviewDialogContentProps) {
	const service = await getServiceById(serviceId);

	if (!service) {
		return <NotFoundServicePreviewDialogContent />;
	}

	const serviceNameVi = service.name.vi || service.name.en || "Chưa có tên dịch vụ";
	const serviceNameEn = service.name.en || service.name.vi || "No English name";
	const serviceDescriptionVi =
		service.description.vi || service.description.en || "Chưa có mô tả";
	const serviceDescriptionEn =
		service.description.en || service.description.vi || "No English description";

	const convertedImages = convertToGalleryImages(
		service.gallery.map((image, index) => ({
			src: image.url,
			alt: `${serviceNameVi} - ảnh ${index + 1}`,
		})),
	);

	return (
		<DialogContent className="max-h-[95vh] w-[95vw] max-w-5xl overflow-y-auto bg-[#FAF7F1] p-0">
			<DialogHeader className="sticky top-0 z-10 border-b border-[#E7D0AF] bg-white px-5 py-5 sm:px-6">
				<div className="flex items-start gap-4">
					<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#342312]/10 text-[#342312]">
						<Wrench className="size-5" />
					</div>

					<div className="min-w-0">
						<DialogTitle className="break-words font-serif text-2xl font-bold text-[#342312]">
							Xem nhanh dịch vụ
						</DialogTitle>

						<DialogDescription className="mt-2 break-words text-sm leading-6 text-[#342312]/70">
							Kiểm tra nhanh nội dung dịch vụ trước khi hiển thị hoặc sau khi cập nhật.
						</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<div className="space-y-6 px-5 py-6 sm:px-6">
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
					<div className="min-w-0 rounded-2xl border border-[#E7D0AF] bg-white p-4">
						{convertedImages.length > 0 ? (
							<GalleryRoot images={convertedImages}>
								<div className="relative">
									<GalleryImage
										containerClassName="mb-4 border border-[#E7D0AF] bg-[#FAF7F1]"
										imageClassName="object-contain"
									/>

									<GalleryBackButton className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white">
										<ChevronLeft className="size-4" />
									</GalleryBackButton>

									<GalleryNextButton className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white">
										<ChevronRight className="size-4" />
									</GalleryNextButton>
								</div>

								<GalleryThumbnails />
							</GalleryRoot>
						) : (
							<div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-[#E7D0AF] bg-[#FAF7F1]">
								<div className="text-center text-[#342312]/60">
									<Wrench className="mx-auto size-10" />

									<p className="mt-2 text-sm">Dịch vụ chưa có hình ảnh</p>
								</div>
							</div>
						)}
					</div>

					<div className="min-w-0 space-y-4">
						<div className="rounded-2xl border border-[#E7D0AF] bg-white p-4">
							<div className="mb-4 flex flex-wrap items-center gap-2">
								<AdminStatusBadge status={service.status} />

								<span className="rounded-full border border-[#E7D0AF] bg-[#FAF7F1] px-2.5 py-1 text-xs font-semibold text-[#342312]/70">
									{service.gallery.length} ảnh
								</span>
							</div>

							<div className="space-y-4">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
										Tên tiếng Việt
									</p>

									<p className="mt-1 break-words text-lg font-semibold text-[#342312]">
										{serviceNameVi}
									</p>
								</div>

								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
										Tên tiếng Anh
									</p>

									<p className="mt-1 break-words text-sm text-[#342312]/75">
										{serviceNameEn}
									</p>
								</div>
							</div>
						</div>

						<div className="rounded-2xl border border-[#E7D0AF] bg-white p-4">
							<h3 className="font-semibold text-[#342312]">Mô tả dịch vụ</h3>

							<div className="mt-4 space-y-4">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
										Tiếng Việt
									</p>

									<p className="mt-1 whitespace-pre-line break-words text-sm leading-6 text-[#342312]/75">
										{serviceDescriptionVi}
									</p>
								</div>

								<div className="border-t border-[#E7D0AF]/70 pt-4">
									<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
										Tiếng Anh
									</p>

									<p className="mt-1 whitespace-pre-line break-words text-sm leading-6 text-[#342312]/75">
										{serviceDescriptionEn}
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
										{new Date(service.createdAt).toLocaleString("vi-VN")}
									</p>
								</div>

								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
										Cập nhật gần nhất
									</p>

									<p className="mt-1 text-[#342312]/75">
										{new Date(service.updatedAt).toLocaleString("vi-VN")}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</DialogContent>
	);
}

/**
 * Service preview not found content
 * @returns Not found dialog content
 */
function NotFoundServicePreviewDialogContent() {
	return (
		<DialogContent className="max-h-[95vh] w-[95vw] max-w-3xl overflow-y-auto bg-white p-0">
			<DialogHeader className="border-b border-[#E7D0AF] px-5 py-5 sm:px-6">
				<DialogTitle className="font-serif text-2xl font-bold text-[#342312]">
					Không tìm thấy dịch vụ
				</DialogTitle>

				<DialogDescription className="mt-2 text-sm text-[#342312]/70">
					Dịch vụ này có thể đã bị xóa hoặc không còn tồn tại trong hệ thống.
				</DialogDescription>
			</DialogHeader>

			<div className="px-5 py-6 sm:px-6">
				<p className="text-sm text-[#342312]/70">
					Vui lòng đóng cửa sổ này và tải lại danh sách dịch vụ.
				</p>
			</div>
		</DialogContent>
	);
}