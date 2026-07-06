"use client";

import { ImageIcon, Upload } from "lucide-react";
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
import { uploadHeroBrandLogoImage } from "./herobrand.actions";
import { useCompanyName, useLogo } from "./herobrand-context";
import type { HeroBrandLogo } from "./herobrand.type";

interface LogoUploadFieldProps {
	logo: HeroBrandLogo;
	setLogo: (logo: HeroBrandLogo) => void;
	removeLogo: () => void;
}

/**
 * Logo upload field for brand admin
 * @param props - Logo upload field props
 * @returns Logo upload field with preview and actions
 */
function LogoUploadField({ logo, setLogo, removeLogo }: LogoUploadFieldProps) {
	async function handleUpload(file: File) {
		const formData = new FormData();
		formData.append("image", file);

		const result = await uploadHeroBrandLogoImage(formData);

		if (!result.success) {
			alert(result.error);
			return;
		}

		setLogo({
			url: result.data,
		});
	}

	return (
		<div className="space-y-3">
			<label className="text-sm font-medium text-[#342312]">Logo công ty</label>

			<input type="hidden" name="logo" value={JSON.stringify(logo)} />

			{logo.url ? (
				<div className="overflow-hidden rounded-2xl border border-[#E7D0AF] bg-white shadow-sm">
					<div className="flex h-[260px] items-center justify-center bg-[#FAF7F1] p-6">
						<img
							src={logo.url}
							alt="Logo công ty"
							className="max-h-full max-w-full rounded-lg object-contain"
						/>
					</div>

					<div className="flex justify-end gap-2 border-t border-[#E7D0AF]/70 px-4 py-3">
						<label className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-[#E7D0AF] bg-white px-3 text-sm font-semibold text-[#342312] transition hover:bg-[#FAF7F1]">
							Đổi logo

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
							onClick={removeLogo}
							className="inline-flex h-9 items-center justify-center rounded-lg bg-destructive px-3 text-sm font-semibold text-destructive-foreground transition hover:opacity-90"
						>
							Xóa logo
						</button>
					</div>
				</div>
			) : (
				<label
					className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E7D0AF] bg-[#FAF7F1] p-8 text-center transition-colors hover:bg-white"
					onDragOver={(event) => {
						event.preventDefault();
					}}
					onDrop={(event) => {
						event.preventDefault();

						const file = event.dataTransfer.files?.[0];

						if (!file) return;

						handleUpload(file);
					}}
				>
					<div className="mb-4 flex size-14 items-center justify-center rounded-full bg-white">
						<Upload className="size-7 text-[#342312]" />
					</div>

					<p className="text-base font-semibold text-[#342312]">
						Tải logo lên
					</p>

					<p className="mt-1 text-sm italic text-[#342312]/65">
						Bấm để chọn logo hoặc kéo thả logo vào khu vực này.
					</p>

					<p className="mt-1 text-xs italic text-[#342312]/60">
						Hỗ trợ JPG, PNG, WEBP hoặc SVG.
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
 * Hero brand details form card
 * @returns Brand logo and company name fields
 */
export function HeroBrandDetailsFormCard() {
	const { logo, setLogo, removeLogo } = useLogo();
	const { companyName, updateCompanyNameEn, updateCompanyNameVi } =
		useCompanyName();

	return (
		<Card className="border-[#E7D0AF] bg-white shadow-sm">
			<CardHeader className="border-b border-[#E7D0AF]/70">
				<CardTitle className="flex items-center gap-2 font-serif text-xl text-[#342312]">
					<ImageIcon className="size-5" />
					<span>Logo & tên công ty</span>
				</CardTitle>

				<CardDescription className="text-[#342312]/65">
					Quản lý logo và tên công ty hiển thị ở header website.
				</CardDescription>
			</CardHeader>

			<CardContent className="grid gap-8 px-5 py-6">
				<LogoUploadField
					logo={logo}
					setLogo={setLogo}
					removeLogo={removeLogo}
				/>

				<div className="grid gap-5 lg:grid-cols-2">
					<FormField
						fieldId="companyNameVi"
						label="Tên công ty tiếng Việt"
						value={companyName.vi}
						placeholder="Nghiệp Hưng"
						helpText="Tên công ty hiển thị trên giao diện tiếng Việt."
					>
						<FormLabel>Tên công ty tiếng Việt</FormLabel>

						<FormInput
							name="companyNameVi"
							value={companyName.vi}
							onChange={(event) => updateCompanyNameVi(event.target.value)}
						/>

						<FormHelpText />
					</FormField>

					<FormField
						fieldId="companyNameEn"
						label="Tên công ty tiếng Anh"
						value={companyName.en}
						placeholder="Nghiep Hung"
						helpText="Tên công ty hiển thị trên giao diện tiếng Anh."
					>
						<FormLabel>Tên công ty tiếng Anh</FormLabel>

						<FormInput
							name="companyNameEn"
							value={companyName.en}
							onChange={(event) => updateCompanyNameEn(event.target.value)}
						/>

						<FormHelpText />
					</FormField>
				</div>
			</CardContent>
		</Card>
	);
}