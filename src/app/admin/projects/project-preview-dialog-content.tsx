import { Calendar, ChevronLeft, ChevronRight, FolderOpen, MapPin } from "lucide-react";
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
import { getProjectCategoryById } from "src/server/projectcategories";
import { getProjectById } from "src/server/projects";

interface ProjectPreviewDialogContentProps {
	projectId: string;
}

/**
 * Project preview dialog content
 * @param props - Project preview dialog props
 * @returns Project preview content for admin users
 */
export async function ProjectPreviewDialogContent({
	projectId,
}: ProjectPreviewDialogContentProps) {
	const project = await getProjectById(projectId);

	if (!project) {
		return <NotFoundProjectPreviewDialogContent />;
	}

	const projectCategory = project.categoryId
		? await getProjectCategoryById(project.categoryId)
		: null;

	const projectNameVi = project.name.vi || project.name.en || "Chưa có tên dự án";
	const projectNameEn = project.name.en || project.name.vi || "No English name";
	const projectLocationVi = project.location.vi || project.location.en || "Chưa nhập địa điểm";
	const projectLocationEn = project.location.en || project.location.vi || "No English location";
	const projectYearVi = project.year.vi || project.year.en || "Chưa nhập năm";
	const projectYearEn = project.year.en || project.year.vi || "No English year";
	const projectDescriptionVi =
		project.description.vi || project.description.en || "Chưa có mô tả";
	const projectDescriptionEn =
		project.description.en || project.description.vi || "No English description";
	const projectCategoryName = projectCategory
		? projectCategory.name.vi || projectCategory.name.en
		: "Chưa phân loại";

	const convertedImages = convertToGalleryImages(
		project.gallery.map((image, index) => ({
			src: image.url,
			alt: `${projectNameVi} - ảnh ${index + 1}`,
		})),
	);

	return (
		<DialogContent className="max-h-[95vh] w-[95vw] max-w-6xl overflow-y-auto bg-[#FAF7F1] p-0">
			<DialogHeader className="sticky top-0 z-10 border-b border-[#E7D0AF] bg-white px-5 py-5 sm:px-6">
				<div className="flex items-start gap-4">
					<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#342312]/10 text-[#342312]">
						<FolderOpen className="size-5" />
					</div>

					<div className="min-w-0">
						<DialogTitle className="break-words font-serif text-2xl font-bold text-[#342312]">
							Xem nhanh dự án
						</DialogTitle>

						<DialogDescription className="mt-2 break-words text-sm leading-6 text-[#342312]/70">
							Kiểm tra nhanh nội dung dự án trước khi hiển thị hoặc sau khi cập nhật.
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
									<FolderOpen className="mx-auto size-10" />

									<p className="mt-2 text-sm">Dự án chưa có hình ảnh</p>
								</div>
							</div>
						)}
					</div>

					<div className="min-w-0 space-y-4">
						<div className="rounded-2xl border border-[#E7D0AF] bg-white p-4">
							<div className="mb-4 flex flex-wrap items-center gap-2">
								<AdminStatusBadge status={project.visibilityStatus} />
								<AdminStatusBadge status={project.completionStatus} />

								<span className="rounded-full border border-[#E7D0AF] bg-[#FAF7F1] px-2.5 py-1 text-xs font-semibold text-[#342312]/70">
									{project.gallery.length} ảnh
								</span>
							</div>

							<div className="space-y-4">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
										Tên tiếng Việt
									</p>

									<p className="mt-1 break-words text-lg font-semibold text-[#342312]">
										{projectNameVi}
									</p>
								</div>

								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
										Tên tiếng Anh
									</p>

									<p className="mt-1 break-words text-sm text-[#342312]/75">
										{projectNameEn}
									</p>
								</div>

								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div>
										<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
											Loại dự án
										</p>

										<p className="mt-1 break-words text-sm text-[#342312]/75">
											{projectCategoryName}
										</p>
									</div>

									<div>
										<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
											Số thông số
										</p>

										<p className="mt-1 break-words text-sm text-[#342312]/75">
											{project.specs.length} thông số
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="rounded-2xl border border-[#E7D0AF] bg-white p-4">
							<h3 className="font-semibold text-[#342312]">Thông tin dự án</h3>

							<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div>
									<p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
										<MapPin className="size-4" />
										Địa điểm tiếng Việt
									</p>

									<p className="mt-1 break-words text-sm text-[#342312]/75">
										{projectLocationVi}
									</p>
								</div>

								<div>
									<p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
										<MapPin className="size-4" />
										Địa điểm tiếng Anh
									</p>

									<p className="mt-1 break-words text-sm text-[#342312]/75">
										{projectLocationEn}
									</p>
								</div>

								<div>
									<p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
										<Calendar className="size-4" />
										Năm tiếng Việt
									</p>

									<p className="mt-1 break-words text-sm text-[#342312]/75">
										{projectYearVi}
									</p>
								</div>

								<div>
									<p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
										<Calendar className="size-4" />
										Năm tiếng Anh
									</p>

									<p className="mt-1 break-words text-sm text-[#342312]/75">
										{projectYearEn}
									</p>
								</div>
							</div>
						</div>

						<div className="rounded-2xl border border-[#E7D0AF] bg-white p-4">
							<h3 className="font-semibold text-[#342312]">Mô tả dự án</h3>

							<div className="mt-4 space-y-4">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
										Tiếng Việt
									</p>

									<p className="mt-1 whitespace-pre-line break-words text-sm leading-6 text-[#342312]/75">
										{projectDescriptionVi}
									</p>
								</div>

								<div className="border-t border-[#E7D0AF]/70 pt-4">
									<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
										Tiếng Anh
									</p>

									<p className="mt-1 whitespace-pre-line break-words text-sm leading-6 text-[#342312]/75">
										{projectDescriptionEn}
									</p>
								</div>
							</div>
						</div>

						<div className="rounded-2xl border border-[#E7D0AF] bg-white p-4">
							<h3 className="font-semibold text-[#342312]">Thông số kỹ thuật</h3>

							{project.specs.length > 0 ? (
								<div className="mt-4 space-y-3">
									{project.specs.map((spec, index) => (
										<div
											key={`spec-${index}-${spec.vi}-${spec.en}`}
											className="rounded-xl border border-[#E7D0AF]/70 bg-[#FAF7F1] p-3"
										>
											<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
												Thông số {index + 1}
											</p>

											<p className="mt-2 break-words text-sm text-[#342312]/75">
												<span className="font-semibold text-[#342312]">VI:</span>{" "}
												{spec.vi || "-"}
											</p>

											<p className="mt-1 break-words text-sm text-[#342312]/75">
												<span className="font-semibold text-[#342312]">EN:</span>{" "}
												{spec.en || "-"}
											</p>
										</div>
									))}
								</div>
							) : (
								<p className="mt-3 text-sm italic text-[#342312]/65">
									Dự án chưa có thông số kỹ thuật.
								</p>
							)}
						</div>

						<div className="rounded-2xl border border-[#E7D0AF] bg-white p-4">
							<div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
										Ngày tạo
									</p>

									<p className="mt-1 text-[#342312]/75">
										{new Date(project.createdAt).toLocaleString("vi-VN")}
									</p>
								</div>

								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55">
										Cập nhật gần nhất
									</p>

									<p className="mt-1 text-[#342312]/75">
										{new Date(project.updatedAt).toLocaleString("vi-VN")}
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
 * Project preview not found content
 * @returns Not found dialog content
 */
function NotFoundProjectPreviewDialogContent() {
	return (
		<DialogContent className="max-h-[95vh] w-[95vw] max-w-3xl overflow-y-auto bg-white p-0">
			<DialogHeader className="border-b border-[#E7D0AF] px-5 py-5 sm:px-6">
				<DialogTitle className="font-serif text-2xl font-bold text-[#342312]">
					Không tìm thấy dự án
				</DialogTitle>

				<DialogDescription className="mt-2 text-sm text-[#342312]/70">
					Dự án này có thể đã bị xóa hoặc không còn tồn tại trong hệ thống.
				</DialogDescription>
			</DialogHeader>

			<div className="px-5 py-6 sm:px-6">
				<p className="text-sm text-[#342312]/70">
					Vui lòng đóng cửa sổ này và tải lại danh sách dự án.
				</p>
			</div>
		</DialogContent>
	);
}