"use client";

import { Upload } from "lucide-react";
import { FormField, FormHelpText, FormInput, FormLabel } from "src/components/form-field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Textarea } from "src/components/ui/textarea";
import { uploadHeroProjectGalleryImage } from "./heroproject.actions";
import { useGallery, useHeroProjectActions, useHeroProjectInfo } from "./heroproject-context";

export function HeroProjectDetailsFormCard() {
	const heroProjectInfo = useHeroProjectInfo();
	const { setHeroProjectInfo } = useHeroProjectActions();
	const { gallery, addGalleryImage, removeGalleryImage } = useGallery();

	const updateField = (field: "title" | "description", lang: "en" | "vi", value: string) => {
		setHeroProjectInfo({
			...heroProjectInfo,
			[field]: {
				...heroProjectInfo[field],
				[lang]: value,
			},
		});
	};

	async function handleUpload(files: FileList | File[]) {
		const fileArray = Array.from(files);

		for (const [index, file] of fileArray.entries()) {
			const formData = new FormData();
			formData.append("image", file);

			const result = await uploadHeroProjectGalleryImage(formData);

			if (!result.success) {
				alert(result.error);
				continue;
			}

			addGalleryImage({
				url: result.data,
				order: gallery.length + index,
			});
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>HeroProject Details</CardTitle>
				<CardDescription>Title and description shown in hero project section</CardDescription>
			</CardHeader>

			<CardContent className="grid gap-6">
				<FormField fieldId="titleEn" label="Title (English)" value={heroProjectInfo.title.en}>
					<FormLabel>Title (EN)</FormLabel>
					<FormInput asChild>
						<Textarea
							rows={2}
							value={heroProjectInfo.title.en}
							onChange={(e) => updateField("title", "en", e.target.value)}
						/>
					</FormInput>
					<FormHelpText />
				</FormField>

				<FormField fieldId="titleVi" label="Title (Vietnamese)" value={heroProjectInfo.title.vi}>
					<FormLabel>Title (VI)</FormLabel>
					<FormInput asChild>
						<Textarea
							rows={2}
							value={heroProjectInfo.title.vi}
							onChange={(e) => updateField("title", "vi", e.target.value)}
						/>
					</FormInput>
					<FormHelpText />
				</FormField>

				<FormField
					fieldId="descriptionEn"
					label="Description (English)"
					value={heroProjectInfo.description.en}
				>
					<FormLabel>Description (EN)</FormLabel>
					<FormInput asChild>
						<Textarea
							rows={3}
							value={heroProjectInfo.description.en}
							onChange={(e) => updateField("description", "en", e.target.value)}
						/>
					</FormInput>
					<FormHelpText />
				</FormField>

				<FormField
					fieldId="descriptionVi"
					label="Description (Vietnamese)"
					value={heroProjectInfo.description.vi}
				>
					<FormLabel>Description (VI)</FormLabel>
					<FormInput asChild>
						<Textarea
							rows={3}
							value={heroProjectInfo.description.vi}
							onChange={(e) => updateField("description", "vi", e.target.value)}
						/>
					</FormInput>
					<FormHelpText />
				</FormField>

				<div className="space-y-4">
					<label className="text-sm font-medium">HeroProject GALLERY</label>

					<label
						className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#342312] bg-white p-8 text-center hover:bg-[#faf7f3]"
						onDragOver={(e) => {
							e.preventDefault();
						}}
						onDrop={(e) => {
							e.preventDefault();

							const files = e.dataTransfer.files;
							if (!files || files.length === 0) return;

							handleUpload(files);
						}}
					>
						<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5efe8]">
							<Upload className="h-8 w-8 text-[#342312]" />
						</div>

						<p className="text-lg font-semibold text-[#342312]">Upload Images</p>
						<p className="text-sm text-muted-foreground">
							Click here or drag and drop your images
						</p>

						<input
							type="file"
							accept="image/*"
							multiple
							className="hidden"
							onChange={(e) => {
								const files = e.target.files;
								if (!files || files.length === 0) return;

								handleUpload(files);
								e.target.value = "";
							}}
						/>
					</label>

					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
						{gallery.map((img) => (
							<div
								key={img.url}
								className="relative h-28 overflow-hidden rounded-lg border-2 border-[#342312]"
							>
								<img
									src={img.url}
									alt="HeroProject gallery"
									className="h-full w-full object-cover"
								/>

								<button
									type="button"
									onClick={() => removeGalleryImage(img.url)}
									className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#342312] text-sm text-white"
								>
									×
								</button>
							</div>
						))}
					</div>

					<input type="hidden" name="gallery" value={JSON.stringify(gallery)} />
				</div>
			</CardContent>
		</Card>
	);
}