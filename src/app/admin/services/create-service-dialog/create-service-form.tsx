import { Upload } from "lucide-react";
import { AdminFormSection } from "src/components/admin/admin-form-section";
import { AdminStickyActions } from "src/components/admin/admin-sticky-actions";
import { FieldError, FormField, FormInput, FormLabel } from "src/components/form-field";
import {
	Form,
	FormErrorDisplay,
	FormPendingMessage,
	FormSubmitMessage,
} from "src/components/form-state";
import {
	ImageUploadArea,
	ImageUploadError,
	ImageUploadProgress,
	ImageUploadReview,
	ImageUploadRoot,
	ImageUploadTrigger,
} from "src/components/image-upload";
import { Button } from "src/components/ui/button";
import { DialogClose } from "src/components/ui/dialog";
import { Textarea } from "src/components/ui/textarea";
import { ServiceStatus } from "src/server/services";
import { createService } from "./create-service-dialog.actions";
import { HiddenSelectedImageInput } from "./hidden-selected-image-input";
import { ServiceImageRenderer } from "./service-image-renderer";

/**
 * Create service form
 * @returns Service creation form for admin users
 */
export function CreateServiceForm() {
	return (
		<Form action={createService}>
			<div className="space-y-6">
				<AdminFormSection
					title="Thông tin cơ bản"
					description="Nhập tên dịch vụ và trạng thái hiển thị. Tiếng Việt là nội dung chính trên website."
				>
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormField
							fieldId="serviceNameVi"
							name="serviceNameVi"
							placeholder="Ví dụ: Thi công hệ thống ống gió"
							required
						>
							<FormLabel>Tên dịch vụ tiếng Việt</FormLabel>
							<FormInput />
							<FieldError />
						</FormField>

						<FormField
							fieldId="serviceNameEn"
							name="serviceNameEn"
							placeholder="Ví dụ: Air duct system installation"
						>
							<FormLabel>Tên dịch vụ tiếng Anh</FormLabel>
							<FormInput />
							<FieldError />
						</FormField>
					</div>

					<FormField fieldId="serviceStatus" name="serviceStatus" required>
						<FormLabel>Trạng thái hiển thị</FormLabel>

						<div className="grid grid-cols-1 gap-3 rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] p-2 sm:grid-cols-2">
							<label className="block">
								<input
									type="radio"
									name="serviceStatus"
									value={ServiceStatus.Draft}
									className="peer sr-only"
									defaultChecked
								/>

								<div className="cursor-pointer rounded-lg border border-transparent bg-white px-4 py-3 text-sm transition peer-checked:border-yellow-300 peer-checked:bg-yellow-50 peer-checked:text-yellow-700">
									<p className="font-semibold">Bản nháp</p>
									<p className="mt-1 text-xs italic text-current/70">
										Lưu nội dung nhưng chưa hiển thị ngoài website.
									</p>
								</div>
							</label>

							<label className="block">
								<input
									type="radio"
									name="serviceStatus"
									value={ServiceStatus.Active}
									className="peer sr-only"
								/>

								<div className="cursor-pointer rounded-lg border border-transparent bg-white px-4 py-3 text-sm transition peer-checked:border-green-300 peer-checked:bg-green-50 peer-checked:text-green-700">
									<p className="font-semibold">Đang hiển thị</p>
									<p className="mt-1 text-xs italic text-current/70">
										Dịch vụ sẽ được hiển thị trên website public.
									</p>
								</div>
							</label>
						</div>

						<FieldError />
					</FormField>
				</AdminFormSection>

				<AdminFormSection
					title="Mô tả dịch vụ"
					description="Mô tả ngắn gọn nội dung dịch vụ. Có thể nhập tiếng Anh sau nếu chưa có bản dịch."
				>
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormField
							fieldId="serviceDescriptionVi"
							name="serviceDescriptionVi"
							placeholder="Nhập mô tả dịch vụ bằng tiếng Việt"
							required
						>
							<FormLabel>Mô tả tiếng Việt</FormLabel>

							<FormInput asChild>
								<Textarea rows={6} />
							</FormInput>

							<FieldError />
						</FormField>

						<FormField
							fieldId="serviceDescriptionEn"
							name="serviceDescriptionEn"
							placeholder="Enter service description in English"
						>
							<FormLabel>Mô tả tiếng Anh</FormLabel>

							<FormInput asChild>
								<Textarea rows={6} />
							</FormInput>

							<FieldError />
						</FormField>
					</div>
				</AdminFormSection>

				<AdminFormSection
					title="Hình ảnh dịch vụ"
					description="Tải ít nhất 1 ảnh. Chọn một ảnh làm ảnh đại diện để hiển thị trên danh sách dịch vụ."
				>
					<ImageUploadRoot maxFiles={10} maxFileSize={5 * 1024 * 1024} name="serviceImages">
						<ImageUploadArea
							className="flex w-full items-center justify-center rounded-xl border-2 border-dashed border-[#E7D0AF] bg-[#FAF7F1] p-8"
							clickable={false}
						>
							<div className="space-y-4 text-center text-[#342312]/70">
								<div className="flex flex-col items-center gap-3">
									<div className="flex size-16 items-center justify-center rounded-full bg-white">
										<Upload className="size-8 text-[#342312]" />
									</div>

									<div className="space-y-1">
										<h3 className="text-sm font-semibold text-[#342312]">
											Tải ảnh dịch vụ
										</h3>

										<p className="text-xs italic leading-5 text-[#342312]/65">
											Kéo thả ảnh vào đây hoặc bấm nút bên dưới để chọn ảnh.
											Hỗ trợ tối đa 10 ảnh, mỗi ảnh tối đa 5MB.
										</p>
									</div>
								</div>

								<ImageUploadTrigger asChild>
									<Button
										type="button"
										variant="outline"
										className="border-[#E7D0AF] bg-white text-[#342312] hover:bg-[#FAF7F1]"
									>
										<Upload className="mr-2 size-4" />
										Chọn ảnh
									</Button>
								</ImageUploadTrigger>
							</div>
						</ImageUploadArea>

						<ImageUploadProgress />
						<ImageUploadError />

						<ImageUploadReview
							ImageComponent={ServiceImageRenderer}
							className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
						/>

						<HiddenSelectedImageInput />
					</ImageUploadRoot>
				</AdminFormSection>

				<FormErrorDisplay />

				<AdminStickyActions note="Sau khi lưu, dịch vụ sẽ xuất hiện ngoài website nếu trạng thái là Đang hiển thị.">
					<DialogClose asChild>
						<Button type="button" variant="outline" className="border-[#E7D0AF] bg-white text-[#342312] hover:bg-[#FAF7F1]">
							Hủy
						</Button>
					</DialogClose>

					<Button type="submit" className="bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B]">
						<FormSubmitMessage>Tạo dịch vụ</FormSubmitMessage>
						<FormPendingMessage>Đang tạo...</FormPendingMessage>
					</Button>
				</AdminStickyActions>
			</div>
		</Form>
	);
}
