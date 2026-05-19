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

function LogoUploadField({
	logo,
	setLogo,
	removeLogo,
}: {
	logo: HeroBrandLogo;
	setLogo: (logo: HeroBrandLogo) => void;
	removeLogo: () => void;
}) {
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
		<div className="space-y-4">
			<label className="text-sm font-medium">Logo</label>

			<input type="hidden" name="logo" value={JSON.stringify(logo)} />

			{logo.url ? (
				<div className="relative overflow-hidden rounded-lg border bg-muted p-6">
					<div className="flex min-h-[180px] items-center justify-center rounded-md bg-white p-8">
						<img
							src={logo.url}
							alt="Hero brand logo"
							className="max-h-28 w-auto max-w-full object-contain"
						/>
					</div>

					<button
						type="button"
						onClick={removeLogo}
						className="absolute right-3 top-3 rounded-full bg-background px-3 py-1 text-sm font-medium shadow"
					>
						Remove
					</button>
				</div>
			) : (
				<label
					className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/40 p-8 text-center transition-colors hover:bg-muted"
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
					<div className="mb-4 flex size-14 items-center justify-center rounded-full bg-background">
						<Upload className="size-7 text-muted-foreground" />
					</div>

					<p className="text-base font-semibold">Upload Logo</p>

					<p className="mt-1 text-sm text-muted-foreground">
						Click here or drag and drop your logo
					</p>

					<p className="mt-1 text-xs text-muted-foreground">
						Support JPG, PNG, WEBP, SVG
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

export function HeroBrandDetailsFormCard() {
	const { logo, setLogo, removeLogo } = useLogo();
	const { companyName, updateCompanyNameEn, updateCompanyNameVi } =
		useCompanyName();

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<ImageIcon className="size-5" />
					<span>Hero Brand</span>
				</CardTitle>

				<CardDescription>
					Logo and company name displayed in the website header.
				</CardDescription>
			</CardHeader>

			<CardContent className="grid gap-8">
				<LogoUploadField
					logo={logo}
					setLogo={setLogo}
					removeLogo={removeLogo}
				/>

				<div className="grid gap-6 md:grid-cols-2">
					<FormField
						fieldId="companyNameEn"
						label="Company Name (English)"
						value={companyName.en}
						placeholder="Nghiep Hung"
						helpText="Company name displayed in English header."
					>
						<FormLabel>Company Name (EN)</FormLabel>

						<FormInput
							name="companyNameEn"
							value={companyName.en}
							onChange={(event) => updateCompanyNameEn(event.target.value)}
						/>

						<FormHelpText />
					</FormField>

					<FormField
						fieldId="companyNameVi"
						label="Company Name (Vietnamese)"
						value={companyName.vi}
						placeholder="Nghiệp Hưng"
						helpText="Company name displayed in Vietnamese header."
					>
						<FormLabel>Company Name (VI)</FormLabel>

						<FormInput
							name="companyNameVi"
							value={companyName.vi}
							onChange={(event) => updateCompanyNameVi(event.target.value)}
						/>

						<FormHelpText />
					</FormField>
				</div>
			</CardContent>
		</Card>
	);
}