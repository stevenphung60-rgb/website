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

type LocalizedTextareaFieldProps = {
	fieldName: string;
	label: string;
	value: LocalizedText;
	updateEn: (value: string) => void;
	updateVi: (value: string) => void;
	rows?: number;
};

function LocalizedTextareaField({
	fieldName,
	label,
	value,
	updateEn,
	updateVi,
	rows = 3,
}: LocalizedTextareaFieldProps) {
	return (
		<div className="grid gap-6 md:grid-cols-2">
			<FormField
				fieldId={`${fieldName}En`}
				label={`${label} (English)`}
				value={value.en}
			>
				<FormLabel>{label} (EN)</FormLabel>

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

			<FormField
				fieldId={`${fieldName}Vi`}
				label={`${label} (Vietnamese)`}
				value={value.vi}
			>
				<FormLabel>{label} (VI)</FormLabel>

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
		</div>
	);
}

function SingleImageUploadField({
	fieldName,
	label,
	image,
	setImage,
	removeImage,
}: {
	fieldName: string;
	label: string;
	image: ContactSingleImage;
	setImage: (image: ContactSingleImage) => void;
	removeImage: () => void;
}) {
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
		<div className="space-y-4">
			<label className="text-sm font-medium">{label}</label>

			<input type="hidden" name={fieldName} value={JSON.stringify(image)} />

			{image.url ? (
				<div className="relative w-full overflow-hidden rounded-lg border bg-muted">
					<img
						src={image.url}
						alt={label}
						className="h-[220px] w-full object-cover"
					/>

					<button
						type="button"
						onClick={removeImage}
						className="absolute right-3 top-3 rounded-full bg-background px-3 py-1 text-sm font-medium shadow"
					>
						Remove
					</button>
				</div>
			) : (
				<label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/40 p-8 text-center transition-colors hover:bg-muted">
					<div className="mb-4 flex size-14 items-center justify-center rounded-full bg-background">
						<Upload className="size-7 text-muted-foreground" />
					</div>

					<p className="text-base font-semibold">{label}</p>

					<p className="mt-1 text-sm text-muted-foreground">
						Click here to upload an image
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
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Phone className="size-5" />
					<span>Contact Details</span>
				</CardTitle>

				<CardDescription>
					Phone, email, consultant CTA, and footer content shown on the public
					website.
				</CardDescription>
			</CardHeader>

			<CardContent className="grid gap-8">
				<div className="grid gap-6 lg:grid-cols-2">
					<FormField
						fieldId="phone1"
						label="Primary Phone"
						value={phone1}
						placeholder="0123 456 789"
						helpText="Main contact number displayed prominently"
						pattern="[0-9+\-\s()]+"
						title="Phone number must contain only numbers, spaces, hyphens, parentheses, and plus signs"
					>
						<FormLabel>Primary Phone</FormLabel>

						<FormInput
							name="phone1"
							value={phone1}
							onChange={(event) => updatePhone1(event.target.value)}
						/>

						<FormHelpText />
					</FormField>

					<FormField
						fieldId="phone2"
						label="Secondary Phone"
						value={phone2}
						placeholder="0987 654 321"
						helpText="Alternative contact number"
						pattern="[0-9+\-\s()]+"
						title="Phone number must contain only numbers, spaces, hyphens, parentheses, and plus signs"
					>
						<FormLabel>Secondary Phone</FormLabel>

						<FormInput
							name="phone2"
							value={phone2}
							onChange={(event) => updatePhone2(event.target.value)}
						/>

						<FormHelpText />
					</FormField>

					<FormField
						fieldId="email1"
						label="Primary Email"
						value={email1}
						type="email"
						placeholder="info@nghiephung.com"
						helpText="Main email address for inquiries"
					>
						<FormLabel>Primary Email</FormLabel>

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
						label="Secondary Email"
						value={email2}
						type="email"
						placeholder="sales@nghiephung.com"
						helpText="Alternative email address"
					>
						<FormLabel>Secondary Email</FormLabel>

						<FormInput
							name="email2"
							type="email"
							value={email2}
							onChange={(event) => updateEmail2(event.target.value)}
						/>

						<FormHelpText />
					</FormField>
				</div>

				<div className="grid gap-6 border-t pt-8">
					<div className="flex items-center gap-2">
						<ImageIcon className="size-5" />
						<h3 className="text-lg font-semibold">Consultant CTA</h3>
					</div>

					<LocalizedTextareaField
						fieldName="consultanttitle"
						label="Consultant Title"
						value={consultanttitle}
						updateEn={updateConsultanttitleEn}
						updateVi={updateConsultanttitleVi}
						rows={2}
					/>

					<LocalizedTextareaField
						fieldName="consultantsubtitle"
						label="Consultant Subtitle"
						value={consultantsubtitle}
						updateEn={updateConsultantsubtitleEn}
						updateVi={updateConsultantsubtitleVi}
						rows={2}
					/>

					<LocalizedTextareaField
						fieldName="consultantdescription"
						label="Consultant Description"
						value={consultantdescription}
						updateEn={updateConsultantdescriptionEn}
						updateVi={updateConsultantdescriptionVi}
						rows={4}
					/>

					<SingleImageUploadField
						fieldName="consultantimage"
						label="Consultant Image"
						image={consultantimage}
						setImage={setConsultantimage}
						removeImage={removeConsultantimage}
					/>
				</div>

				<div className="grid gap-6 border-t pt-8">
					<div className="flex items-center gap-2">
						<ImageIcon className="size-5" />
						<h3 className="text-lg font-semibold">Footer Content</h3>
					</div>

					<SingleImageUploadField
						fieldName="footerlogo"
						label="Footer Logo"
						image={footerlogo}
						setImage={setFooterlogo}
						removeImage={removeFooterlogo}
					/>

					<LocalizedTextareaField
						fieldName="footercompanyname"
						label="Footer Company Name"
						value={footercompanyname}
						updateEn={updateFootercompanynameEn}
						updateVi={updateFootercompanynameVi}
						rows={2}
					/>

					<LocalizedTextareaField
						fieldName="footercompanydescription"
						label="Footer Company Description"
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

export function WorkingHoursFormCard() {
	const { workingHours, updateWorkingHoursEn, updateWorkingHoursVi } =
		useWorkingHours();

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Clock className="size-5" />
					<span>Working Hours</span>
				</CardTitle>

				<CardDescription>
					Enter your business hours in both English and Vietnamese. This text
					will be displayed in the contact section and footer.
				</CardDescription>
			</CardHeader>

			<CardContent className="grid gap-6">
				<FormField
					fieldId="workingHoursEn"
					label="Working Hours (English)"
					value={workingHours.en}
					placeholder={`Monday - Friday: 8:00 AM - 5:30 PM
Saturday: 8:00 AM - 12:00 PM
Sunday: Closed`}
					helpText="Working hours text displayed in English. Use multiple lines for different time periods."
				>
					<FormLabel>Working Hours (English)</FormLabel>

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

				<FormField
					fieldId="workingHoursVi"
					label="Working Hours (Vietnamese)"
					value={workingHours.vi}
					placeholder={`Thứ 2 - Thứ 6: 08:00 - 17:30
Thứ 7: 08:00 - 12:00
Chủ nhật: Nghỉ`}
					helpText="Working hours text displayed in Vietnamese. Use multiple lines for different time periods."
				>
					<FormLabel>Working Hours (Vietnamese)</FormLabel>

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
			</CardContent>
		</Card>
	);
}