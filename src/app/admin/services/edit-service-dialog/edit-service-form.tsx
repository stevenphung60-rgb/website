import { AdminFormSection } from "src/components/admin/admin-form-section";
import { AdminStickyActions } from "src/components/admin/admin-sticky-actions";
import { FieldError, FormField, FormInput, FormLabel } from "src/components/form-field";
import {
	Form,
	FormErrorDisplay,
	FormPendingMessage,
	FormResetButton,
	FormSubmitMessage,
} from "src/components/form-state";
import { Button } from "src/components/ui/button";
import { DialogClose } from "src/components/ui/dialog";
import { Textarea } from "src/components/ui/textarea";
import type { Service } from "src/server/services";
import { ServiceStatus } from "src/server/services";
import { updateService } from "./";

interface EditServiceFormProps {
	service: Service;
}

/**
 * Edit service form
 * @param props - Edit service form props
 * @returns Service edit form for admin users
 */
export function EditServiceForm({ service }: EditServiceFormProps) {
	return (
		<Form action={updateService}>
			<input type="hidden" name="serviceId" value={service.id} />

			<div className="space-y-6">
				<AdminFormSection
					title="Thông tin cơ bản"
					description="Cập nhật tên dịch vụ và trạng thái hiển thị. Tiếng Việt là nội dung chính trên website."
				>
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormField
							fieldId="serviceNameVi"
							name="serviceNameVi"
							placeholder="Ví dụ: Thi công hệ thống ống gió"
							required
						>
							<FormLabel>Tên dịch vụ tiếng Việt</FormLabel>
							<FormInput defaultValue={service.name.vi} />
							<FieldError />
						</FormField>

						<FormField
							fieldId="serviceNameEn"
							name="serviceNameEn"
							placeholder="Ví dụ: Air duct system installation"
						>
							<FormLabel>Tên dịch vụ tiếng Anh</FormLabel>
							<FormInput defaultValue={service.name.en} />
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
									defaultChecked={service.status === ServiceStatus.Draft}
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
									defaultChecked={service.status === ServiceStatus.Active}
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
					description="Cập nhật mô tả dịch vụ hiển thị trên website. Có thể để tiếng Anh giống tiếng Việt nếu chưa có bản dịch."
				>
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<FormField
							fieldId="serviceDescriptionVi"
							name="serviceDescriptionVi"
							placeholder="Nhập mô tả dịch vụ bằng tiếng Việt"
							required
						>
							<FormLabel>Mô tả tiếng Việt</FormLabel>

							<FormInput asChild defaultValue={service.description.vi}>
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

							<FormInput asChild defaultValue={service.description.en}>
								<Textarea rows={6} />
							</FormInput>

							<FieldError />
						</FormField>
					</div>
				</AdminFormSection>

				<FormErrorDisplay />

				<AdminStickyActions note="Sau khi lưu, dịch vụ sẽ được cập nhật trên website nếu trạng thái là Đang hiển thị.">
					<DialogClose asChild>
						<FormResetButton>Đóng</FormResetButton>
					</DialogClose>

					<Button type="submit" className="bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B]">
						<FormSubmitMessage>Lưu thay đổi</FormSubmitMessage>
						<FormPendingMessage>Đang lưu...</FormPendingMessage>
					</Button>
				</AdminStickyActions>
			</div>
		</Form>
	);
}