"use client";

import { Clock, ImageIcon, Phone, Upload } from "lucide-react";
import {
	FormField,
	FormHelpText,
	FormInput,
	FormLabel,
} from "src/components/form-field";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "src/components/ui/card";
import { Textarea } from "src/components/ui/textarea";
import { uploadContactImage } from "./contact.actions";
import {
	useConsultantContent,
	useEmail1,
	useEmail2,
	useFooterContent,
	usePhone1,
	usePhone2,
	useWorkingHours,
} from "./contact-context";
import type { ContactSingleImage, LocalizedText } from "./contact.type";

interface LocalizedTextareaFieldProps {
	fieldName: string;
	label: string;
	value: LocalizedText;
	updateEn: (value: string) => void;
	updateVi: (value: string) => void;
	rows?: number;
}

interface SingleImageUploadFieldProps {
	fieldName: string;
	label: string;
	image: ContactSingleImage;
	setImage: (image: ContactSingleImage) => void;
	removeImage: () => void;
}

/**
 * Localized textarea fields for Vietnamese and English content
 * @param props - Localized textarea field props
 * @returns Vietnamese and English textarea inputs
 */
function LocalizedTextareaField({
	fieldName,
	label,
	value,
	updateEn,
	updateVi,
	rows = 3,
}: LocalizedTextareaFieldProps) {
	return (
		<div className="grid gap-5 lg:grid-cols-2">
			<FormField
				fieldId={`${fieldName}Vi`}
				label={`${label} tiếng Việt`}
				value={value.vi}
			>
				<FormLabel>{label} tiếng Việt</FormLabel>

				<FormInput asChild>
					<Textarea
						name={`${fieldName}Vi`}
						rows={rows}
						value={value.vi}
						onChange={(event) => updateVi(event.target.value)}
					/>
				</FormInput>

				<FormHelpText />
			</FormField>

			<FormField
				fieldId={`${fieldName}En`}
				label={`${label} tiếng Anh`}
				value={value.en}
			>
				<FormLabel>{label} tiếng Anh</FormLabel>

				<FormInput asChild>
					<Textarea
						name={`${fieldName}En`}
						rows={rows}
						value={value.en}
						onChange={(event) => updateEn(event.target.value)}
					/>
				</FormInput>

				<FormHelpText />
			</FormField>
		</div>
	);
}

/**
 * Single image upload field for contact admin
 * @param props - Single image upload field props
 * @returns Image upload field with preview and remove action
 */
function SingleImageUploadField({
	fieldName,
	label,
	image,
	setImage,
	removeImage,
}: SingleImageUploadFieldProps) {
	async function handleUpload(file: File) {
		const formData = new FormData();
		formData.append("image", file);

		const result = await uploadContactImage(formData);

		if (!result.success) {
			alert(result.error);
			return;
		}

		setImage({
			url: result.data,
		});
	}

	return (
		<div className="space-y-3">
			<label className="text-sm font-medium text-[#342312]">{label}</label>

			<input type="hidden" name={fieldName} value={JSON.stringify(image)} />

			{image.url ? (
				<div className="overflow-hidden rounded-2xl border border-[#E7D0AF] bg-white shadow-sm">
					<div className="flex h-[260px] items-center justify-center bg-[#FAF7F1] p-4">
						<img
							src={image.url}
							alt={label}
							className="max-h-full max-w-full rounded-lg object-contain"
						/>
					</div>

					<div className="flex flex-col gap-3 border-t border-[#E7D0AF]/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="min-w-0">
							<p className="text-sm font-semibold text-[#342312]">{label}</p>

							<p className="mt-1 break-all text-xs italic text-[#342312]/60">
								Ảnh hiện tại: {image.url}
							</p>
						</div>

						<div className="flex shrink-0 gap-2">
							<label className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-[#E7D0AF] bg-white px-3 text-sm font-semibold text-[#342312] transition hover:bg-[#FAF7F1]">
								Đổi ảnh

								<input
									type="file"
									accept="image/jpeg,image/png,image/webp,image/svg+xml"
									className="hidden"
									onChange={(event) => {
										const file = event.target.files?.[0];

										if (!file) return;

										handleUpload(file);
										event.target.value = "";
									}}
								/>
							</label>

							<button
								type="button"
								onClick={removeImage}
								className="inline-flex h-9 items-center justify-center rounded-lg bg-destructive px-3 text-sm font-semibold text-destructive-foreground transition hover:opacity-90"
							>
								Xóa ảnh
							</button>
						</div>
					</div>
				</div>
			) : (
				<label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E7D0AF] bg-[#FAF7F1] p-8 text-center transition-colors hover:bg-white">
					<div className="mb-4 flex size-14 items-center justify-center rounded-full bg-white">
						<Upload className="size-7 text-[#342312]" />
					</div>

					<p className="text-base font-semibold text-[#342312]">{label}</p>

					<p className="mt-1 text-sm italic text-[#342312]/65">
						Bấm để tải ảnh lên
					</p>

					<input
						type="file"
						accept="image/jpeg,image/png,image/webp,image/svg+xml"
						className="hidden"
						onChange={(event) => {
							const file = event.target.files?.[0];

							if (!file) return;

							handleUpload(file);
							event.target.value = "";
						}}
					/>
				</label>
			)}
		</div>
	);
}

/**
 * Contact details form card
 * @returns Contact details, consultant CTA, and footer content fields
 */
export function ContactDetailsFormCard() {
	const { phone1, updatePhone1 } = usePhone1();
	const { phone2, updatePhone2 } = usePhone2();
	const { email1, updateEmail1 } = useEmail1();
	const { email2, updateEmail2 } = useEmail2();

	const {
		consultanttitle,
		updateConsultanttitleEn,
		updateConsultanttitleVi,
		consultantsubtitle,
		updateConsultantsubtitleEn,
		updateConsultantsubtitleVi,
		consultantdescription,
		updateConsultantdescriptionEn,
		updateConsultantdescriptionVi,
		consultantimage,
		setConsultantimage,
		removeConsultantimage,
	} = useConsultantContent();

	const {
		footerlogo,
		setFooterlogo,
		removeFooterlogo,
		footercompanyname,
		updateFootercompanynameEn,
		updateFootercompanynameVi,
		footercompanydescription,
		updateFootercompanydescriptionEn,
		updateFootercompanydescriptionVi,
	} = useFooterContent();

	return (
		<Card className="border-[#E7D0AF] bg-white shadow-sm">
			<CardHeader className="border-b border-[#E7D0AF]/70">
				<CardTitle className="flex items-center gap-2 font-serif text-xl text-[#342312]">
					<Phone className="size-5" />
					<span>Thông tin liên hệ</span>
				</CardTitle>

				<CardDescription className="text-[#342312]/65">
					Quản lý số điện thoại, email, khối tư vấn và nội dung footer.
				</CardDescription>
			</CardHeader>

			<CardContent className="grid gap-8 px-5 py-6">
				<div className="grid gap-5 lg:grid-cols-2">
					<FormField
						fieldId="phone1"
						label="Số điện thoại chính"
						value={phone1}
						placeholder="0123 456 789"
						helpText="Số điện thoại chính hiển thị trên website."
						pattern="[0-9+\-\s()]+"
						title="Số điện thoại chỉ được chứa số, khoảng trắng, dấu gạch ngang, ngoặc và dấu cộng"
					>
						<FormLabel>Số điện thoại chính *</FormLabel>

						<FormInput
							name="phone1"
							value={phone1}
							onChange={(event) => updatePhone1(event.target.value)}
						/>

						<FormHelpText />
					</FormField>

					<FormField
						fieldId="phone2"
						label="Số điện thoại phụ"
						value={phone2}
						placeholder="0987 654 321"
						helpText="Số điện thoại phụ nếu có."
						pattern="[0-9+\-\s()]+"
						title="Số điện thoại chỉ được chứa số, khoảng trắng, dấu gạch ngang, ngoặc và dấu cộng"
					>
						<FormLabel>Số điện thoại phụ</FormLabel>

						<FormInput
							name="phone2"
							value={phone2}
							onChange={(event) => updatePhone2(event.target.value)}
						/>

						<FormHelpText />
					</FormField>

					<FormField
						fieldId="email1"
						label="Email chính"
						value={email1}
						type="email"
						placeholder="info@nghiephung.com"
						helpText="Email chính nhận liên hệ từ khách hàng."
					>
						<FormLabel>Email chính *</FormLabel>

						<FormInput
							name="email1"
							type="email"
							value={email1}
							onChange={(event) => updateEmail1(event.target.value)}
						/>

						<FormHelpText />
					</FormField>

					<FormField
						fieldId="email2"
						label="Email phụ"
						value={email2}
						type="email"
						placeholder="sales@nghiephung.com"
						helpText="Email phụ nếu có."
					>
						<FormLabel>Email phụ</FormLabel>

						<FormInput
							name="email2"
							type="email"
							value={email2}
							onChange={(event) => updateEmail2(event.target.value)}
						/>

						<FormHelpText />
					</FormField>
				</div>

				<div className="grid gap-5 border-t border-[#E7D0AF]/70 pt-8">
					<div className="flex items-center gap-2">
						<ImageIcon className="size-5 text-[#342312]" />
						<h3 className="text-lg font-semibold text-[#342312]">
							Khối tư vấn
						</h3>
					</div>

					<LocalizedTextareaField
						fieldName="consultanttitle"
						label="Tiêu đề tư vấn"
						value={consultanttitle}
						updateEn={updateConsultanttitleEn}
						updateVi={updateConsultanttitleVi}
						rows={2}
					/>

					<LocalizedTextareaField
						fieldName="consultantsubtitle"
						label="Tiêu đề phụ"
						value={consultantsubtitle}
						updateEn={updateConsultantsubtitleEn}
						updateVi={updateConsultantsubtitleVi}
						rows={2}
					/>

					<LocalizedTextareaField
						fieldName="consultantdescription"
						label="Mô tả tư vấn"
						value={consultantdescription}
						updateEn={updateConsultantdescriptionEn}
						updateVi={updateConsultantdescriptionVi}
						rows={4}
					/>

					<SingleImageUploadField
						fieldName="consultantimage"
						label="Ảnh khối tư vấn"
						image={consultantimage}
						setImage={setConsultantimage}
						removeImage={removeConsultantimage}
					/>
				</div>

				<div className="grid gap-5 border-t border-[#E7D0AF]/70 pt-8">
					<div className="flex items-center gap-2">
						<ImageIcon className="size-5 text-[#342312]" />
						<h3 className="text-lg font-semibold text-[#342312]">
							Footer website
						</h3>
					</div>

					<SingleImageUploadField
						fieldName="footerlogo"
						label="Logo footer"
						image={footerlogo}
						setImage={setFooterlogo}
						removeImage={removeFooterlogo}
					/>

					<LocalizedTextareaField
						fieldName="footercompanyname"
						label="Tên công ty footer"
						value={footercompanyname}
						updateEn={updateFootercompanynameEn}
						updateVi={updateFootercompanynameVi}
						rows={2}
					/>

					<LocalizedTextareaField
						fieldName="footercompanydescription"
						label="Mô tả footer"
						value={footercompanydescription}
						updateEn={updateFootercompanydescriptionEn}
						updateVi={updateFootercompanydescriptionVi}
						rows={4}
					/>
				</div>
			</CardContent>
		</Card>
	);
}

/**
 * Working hours form card
 * @returns Working hours fields
 */
export function WorkingHoursFormCard() {
	const { workingHours, updateWorkingHoursEn, updateWorkingHoursVi } =
		useWorkingHours();

	return (
		<Card className="border-[#E7D0AF] bg-white shadow-sm">
			<CardHeader className="border-b border-[#E7D0AF]/70">
				<CardTitle className="flex items-center gap-2 font-serif text-xl text-[#342312]">
					<Clock className="size-5" />
					<span>Giờ làm việc</span>
				</CardTitle>

				<CardDescription className="text-[#342312]/65">
					Quản lý giờ làm việc hiển thị ở trang liên hệ và footer.
				</CardDescription>
			</CardHeader>

			<CardContent className="grid gap-5 px-5 py-6 lg:grid-cols-2">
				<FormField
					fieldId="workingHoursVi"
					label="Giờ làm việc tiếng Việt"
					value={workingHours.vi}
					placeholder={`Thứ 2 - Thứ 6: 08:00 - 17:30
Thứ 7: 08:00 - 12:00
Chủ nhật: Nghỉ`}
					helpText="Giờ làm việc hiển thị trên website tiếng Việt."
				>
					<FormLabel>Giờ làm việc tiếng Việt *</FormLabel>

					<Textarea
						id="workingHoursVi"
						name="workingHoursVi"
						value={workingHours.vi}
						placeholder={`Thứ 2 - Thứ 6: 08:00 - 17:30
Thứ 7: 08:00 - 12:00
Chủ nhật: Nghỉ`}
						rows={5}
						onChange={(event) => updateWorkingHoursVi(event.target.value)}
						className="min-h-[150px] w-full resize-y"
					/>

					<FormHelpText />
				</FormField>

				<FormField
					fieldId="workingHoursEn"
					label="Giờ làm việc tiếng Anh"
					value={workingHours.en}
					placeholder={`Monday - Friday: 8:00 AM - 5:30 PM
Saturday: 8:00 AM - 12:00 PM
Sunday: Closed`}
					helpText="Giờ làm việc hiển thị trên website tiếng Anh."
				>
					<FormLabel>Giờ làm việc tiếng Anh *</FormLabel>

					<Textarea
						id="workingHoursEn"
						name="workingHoursEn"
						value={workingHours.en}
						placeholder={`Monday - Friday: 8:00 AM - 5:30 PM
Saturday: 8:00 AM - 12:00 PM
Sunday: Closed`}
						rows={5}
						onChange={(event) => updateWorkingHoursEn(event.target.value)}
						className="min-h-[150px] w-full resize-y"
					/>

					<FormHelpText />
				</FormField>
			</CardContent>
		</Card>
	);
}