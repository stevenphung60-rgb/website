import { Edit, Eye, ImageIcon, MoreHorizontal, Trash2, Wrench } from "lucide-react";
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
import { getServiceById } from "src/server/services";
import { deleteServiceAction } from "./delete-service.actions";
import {
	ServiceEditTrigger,
	ServiceImageTrigger,
	ServicePreviewTrigger,
} from "./service-dialog-triggers";
import { ServiceEditDialogContent } from "./service-edit-dialog-content";
import { ServiceImageDialogContent } from "./service-image-dialog-content";
import { ServicePreviewDialogContent } from "./service-preview-dialog-content";
import { ServiceRowDialog } from "./service-row-context.ui";

interface ServiceRowProps {
	serviceId: string;
}

/**
 * Display a single service row in the admin service list
 * @param props - Service row props
 * @returns Service row with preview, edit, image management, and delete actions
 */
export async function ServiceRow({ serviceId }: ServiceRowProps) {
	const service = await getServiceById(serviceId);

	if (!service) {
		throw new Error(`Service with id ${serviceId} not found`);
	}

	const mainImage = service.gallery.find((image) => image.isMain) || service.gallery[0];
	const serviceName = service.name.vi || service.name.en || "Chưa có tên dịch vụ";
	const serviceNameEn = service.name.en || "Chưa có tên tiếng Anh";
	const serviceNameVi = service.name.vi || "Chưa có tên tiếng Việt";
	const serviceDescription =
		service.description.vi || service.description.en || "Chưa có mô tả dịch vụ";

	return (
		<div className="bg-white px-4 py-4 transition-colors hover:bg-[#FAF7F1] sm:px-5">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-[5rem_minmax(0,1.5fr)_minmax(0,1fr)_8rem_5rem] lg:items-center lg:gap-4">
				<div className="flex items-start gap-4 lg:block">
					<div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] lg:size-16">
						{mainImage ? (
							<Image
								src={mainImage.url}
								alt={serviceName}
								fill
								className="object-cover"
								sizes="80px"
							/>
						) : (
							<div className="flex size-full items-center justify-center">
								<Wrench className="size-7 text-[#342312]/45" />
							</div>
						)}
					</div>

					<div className="min-w-0 lg:hidden">
						<h3 className="break-words text-base font-semibold text-[#342312]">
							{serviceNameVi}
						</h3>

						<p className="mt-1 break-words text-sm text-[#342312]/65">
							{serviceNameEn}
						</p>

						<p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-[#342312]/70">
							{serviceDescription}
						</p>

						<div className="mt-3 flex flex-wrap items-center gap-2">
							<AdminStatusBadge status={service.status} />

							<span className="rounded-full border border-[#E7D0AF] bg-white px-2.5 py-1 text-xs font-semibold text-[#342312]/70">
								{service.gallery.length} ảnh
							</span>
						</div>
					</div>
				</div>

				<div className="hidden min-w-0 lg:block">
					<h3 className="truncate text-sm font-semibold text-[#342312]">
						{serviceNameVi}
					</h3>

					<p className="mt-1 truncate text-sm text-[#342312]/65">
						{serviceNameEn}
					</p>

					<p className="mt-1 truncate text-xs text-[#342312]/50">
						Cập nhật:{" "}
						{new Date(service.updatedAt).toLocaleDateString("vi-VN", {
							year: "numeric",
							month: "2-digit",
							day: "2-digit",
						})}
					</p>
				</div>

				<div className="min-w-0">
					<p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55 lg:hidden">
						Mô tả
					</p>

					<p className="line-clamp-2 break-words text-sm leading-6 text-[#342312]/75 lg:truncate">
						{serviceDescription}
					</p>
				</div>

				<div className="hidden lg:block">
					<AdminStatusBadge status={service.status} />
				</div>

				<div className="flex items-center justify-end">
					<Form action={deleteServiceAction} confirmBeforeSubmit>
						<input type="hidden" name="serviceId" value={service.id} />

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="text-[#342312]">
									<MoreHorizontal className="size-4" />
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align="end" className="w-52 bg-white">
								<ServicePreviewTrigger className="flex w-full items-center gap-2">
									<Eye className="size-4" />
									Xem nhanh
								</ServicePreviewTrigger>

								<ServiceEditTrigger className="flex w-full items-center gap-2">
									<Edit className="size-4" />
									Sửa thông tin
								</ServiceEditTrigger>

								<ServiceImageTrigger className="flex w-full items-center gap-2">
									<ImageIcon className="size-4" />
									Quản lý ảnh
								</ServiceImageTrigger>

								<SubmitButton asChild className="flex w-full items-center gap-2">
									<DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
										<Trash2 className="size-4" />
										Xóa dịch vụ
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
											<DialogTitle>Xóa dịch vụ</DialogTitle>

											<DialogDescription>
												Thao tác này không thể hoàn tác. Dịch vụ và hình ảnh liên quan sẽ bị xóa khỏi hệ thống.
											</DialogDescription>
										</div>
									</div>
								</DialogHeader>

								<div className="space-y-3">
									<div className="rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] p-4">
										<p className="font-medium text-[#342312]">{serviceNameVi}</p>

										<p className="mt-1 text-sm text-[#342312]/65">
											{serviceNameEn}
										</p>

										<p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-[#342312]/70">
											{serviceDescription}
										</p>

										<p className="mt-3 text-xs text-[#342312]/65">
											{service.gallery.length} ảnh sẽ bị xóa cùng dịch vụ này.
										</p>
									</div>

									<FormErrorDisplay />
								</div>

								<DialogFooter className="gap-2">
									<CancelButton>Hủy</CancelButton>

									<ConfirmButton variant="destructive">
										<FormSubmitMessage>Xóa dịch vụ</FormSubmitMessage>
										<FormPendingMessage>Đang xóa...</FormPendingMessage>
									</ConfirmButton>
								</DialogFooter>
							</DialogContent>
						</ConfirmDialog>
					</Form>
				</div>
			</div>

			<ServiceRowDialog type="preview">
				<ServicePreviewDialogContent serviceId={service.id} />
			</ServiceRowDialog>

			<ServiceRowDialog type="edit">
				<ServiceEditDialogContent service={service} />
			</ServiceRowDialog>

			<ServiceRowDialog type="image">
				<ServiceImageDialogContent service={service} />
			</ServiceRowDialog>
		</div>
	);
}