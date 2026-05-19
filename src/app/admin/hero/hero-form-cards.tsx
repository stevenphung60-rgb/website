"use client";

import { Upload, X } from "lucide-react";
import { useState } from "react";
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
import { uploadHeroGalleryImage } from "./hero.actions";
import { useHeroActions, useHeroInfo } from "./hero-context";
import type { HeroImage, HeroInfo } from "./hero.type";

type LocaleKey = "en" | "vi";

type LocalizedHeroField =
	| "title"
	| "description"
	| "productitle"
	| "productdescription"
	| "servicetitle"
	| "servicedesription"
	| "machinetitle"
	| "machinedescription"
	| "machine1title"
	| "machine1subtitle"
	| "machine1description"
	| "machine2title"
	| "machine2subtitle"
	| "machine2description"
	| "machine3title"
	| "machine3subtitle"
	| "machine3description"
	| "clienttitle"
	| "clientdescription"
	| "projecttitle";

type SingleImageHeroField =
	| "machinebackgroundimage"
	| "machine1image"
	| "machine2image"
	| "machine3image";

type GalleryHeroField = "gallery" | "clientimagegallery";

export function HeroDetailsFormCard() {
	const heroInfo = useHeroInfo();
	const { setHeroInfo } = useHeroActions();

	const [uploadingField, setUploadingField] = useState<string | null>(null);

	function updateLocalizedField(
		field: LocalizedHeroField,
		lang: LocaleKey,
		value: string,
	) {
		setHeroInfo({
			...heroInfo,
			[field]: {
				...heroInfo[field],
				[lang]: value,
			},
		});
	}

	function setSingleImage(field: SingleImageHeroField, url: string) {
		setHeroInfo({
			...heroInfo,
			[field]: {
				url,
			},
		});
	}

	async function handleSingleImageUpload(
		field: SingleImageHeroField,
		file: File,
	) {
		const formData = new FormData();
		formData.append("image", file);

		setUploadingField(field);

		try {
			const result = await uploadHeroGalleryImage(formData);

			if (!result.success) {
				alert(result.error);
				return;
			}

			setSingleImage(field, result.data);
		} finally {
			setUploadingField(null);
		}
	}

	async function handleGalleryUpload(
		field: GalleryHeroField,
		files: FileList | File[],
	) {
		const fileArray = Array.from(files);

		if (fileArray.length === 0) return;

		const currentGallery = heroInfo[field] || [];
		const uploadedImages: HeroImage[] = [];

		setUploadingField(field);

		try {
			for (const file of fileArray) {
				const formData = new FormData();
				formData.append("image", file);

				const result = await uploadHeroGalleryImage(formData);

				if (!result.success) {
					alert(result.error);
					continue;
				}

				uploadedImages.push({
					url: result.data,
					order: currentGallery.length + uploadedImages.length,
				});
			}

			if (uploadedImages.length > 0) {
				setHeroInfo({
					...heroInfo,
					[field]: [...currentGallery, ...uploadedImages],
				} as HeroInfo);
			}
		} finally {
			setUploadingField(null);
		}
	}

	function removeGalleryImage(field: GalleryHeroField, url: string) {
		const updatedGallery = heroInfo[field]
			.filter((image) => image.url !== url)
			.map((image, index) => ({
				...image,
				order: index,
			}));

		setHeroInfo({
			...heroInfo,
			[field]: updatedGallery,
		} as HeroInfo);
	}

	function renderLocalizedTextarea({
		field,
		fieldIdEn,
		fieldIdVi,
		labelEn,
		labelVi,
		rows = 2,
	}: {
		field: LocalizedHeroField;
		fieldIdEn: string;
		fieldIdVi: string;
		labelEn: string;
		labelVi: string;
		rows?: number;
	}) {
		return (
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<FormField fieldId={fieldIdEn} label={labelEn} value={heroInfo[field].en}>
					<FormLabel>{labelEn}</FormLabel>
					<FormInput asChild>
						<Textarea
							name={fieldIdEn}
							rows={rows}
							value={heroInfo[field].en}
							onChange={(event) =>
								updateLocalizedField(field, "en", event.target.value)
							}
						/>
					</FormInput>
					<FormHelpText />
				</FormField>

				<FormField fieldId={fieldIdVi} label={labelVi} value={heroInfo[field].vi}>
					<FormLabel>{labelVi}</FormLabel>
					<FormInput asChild>
						<Textarea
							name={fieldIdVi}
							rows={rows}
							value={heroInfo[field].vi}
							onChange={(event) =>
								updateLocalizedField(field, "vi", event.target.value)
							}
						/>
					</FormInput>
					<FormHelpText />
				</FormField>
			</div>
		);
	}

	function renderSingleImageUpload({
		field,
		label,
	}: {
		field: SingleImageHeroField;
		label: string;
	}) {
		const image = heroInfo[field];
		const isUploading = uploadingField === field;

		return (
			<div className="space-y-3">
				<label className="text-sm font-medium">{label}</label>

				{image.url ? (
					<div className="relative h-44 overflow-hidden rounded-lg border-2 border-[#342312] bg-white">
						<img
							src={image.url}
							alt={label}
							className="h-full w-full object-cover"
						/>

						<button
							type="button"
							onClick={() => setSingleImage(field, "")}
							className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#342312] text-white transition hover:bg-[#A87E3C]"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				) : null}

				<label className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#342312] bg-white p-6 text-center hover:bg-[#faf7f3]">
					<div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5efe8]">
						<Upload className="h-6 w-6 text-[#342312]" />
					</div>

					<p className="text-base font-semibold text-[#342312]">
						{isUploading ? "Uploading..." : "Upload Image"}
					</p>

					<p className="text-sm text-muted-foreground">
						Click here to upload image
					</p>

					<input
						type="file"
						accept="image/*"
						className="hidden"
						onChange={(event) => {
							const file = event.target.files?.[0];

							if (!file) return;

							handleSingleImageUpload(field, file);
							event.target.value = "";
						}}
					/>
				</label>

				<input type="hidden" name={field} value={JSON.stringify(image)} />
			</div>
		);
	}

	function renderGalleryUpload({
		field,
		label,
	}: {
		field: GalleryHeroField;
		label: string;
	}) {
		const gallery = heroInfo[field] || [];
		const isUploading = uploadingField === field;

		return (
			<div className="space-y-4">
				<label className="text-sm font-medium">{label}</label>

				<label
					className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#342312] bg-white p-8 text-center hover:bg-[#faf7f3]"
					onDragOver={(event) => {
						event.preventDefault();
					}}
					onDrop={(event) => {
						event.preventDefault();

						const files = event.dataTransfer.files;
						if (!files || files.length === 0) return;

						handleGalleryUpload(field, files);
					}}
				>
					<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5efe8]">
						<Upload className="h-8 w-8 text-[#342312]" />
					</div>

					<p className="text-lg font-semibold text-[#342312]">
						{isUploading ? "Uploading..." : "Upload Images"}
					</p>

					<p className="text-sm text-muted-foreground">
						Click here or drag and drop your images
					</p>

					<input
						type="file"
						accept="image/*"
						multiple
						className="hidden"
						onChange={(event) => {
							const files = event.target.files;
							if (!files || files.length === 0) return;

							handleGalleryUpload(field, files);
							event.target.value = "";
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
								alt={label}
								className="h-full w-full object-cover"
							/>

							<button
								type="button"
								onClick={() => removeGalleryImage(field, img.url)}
								className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#342312] text-sm text-white transition hover:bg-[#A87E3C]"
							>
								×
							</button>
						</div>
					))}
				</div>

				<input type="hidden" name={field} value={JSON.stringify(gallery)} />
			</div>
		);
	}

	return (
		<div className="space-y-8 lg:col-span-2">
			<Card>
				<CardHeader>
					<CardTitle>Hero Details</CardTitle>
					<CardDescription>
						Title, description and gallery shown in Home hero section
					</CardDescription>
				</CardHeader>

				<CardContent className="grid gap-6">
					{renderLocalizedTextarea({
						field: "title",
						fieldIdEn: "titleEn",
						fieldIdVi: "titleVi",
						labelEn: "Title (EN)",
						labelVi: "Title (VI)",
						rows: 2,
					})}

					{renderLocalizedTextarea({
						field: "description",
						fieldIdEn: "descriptionEn",
						fieldIdVi: "descriptionVi",
						labelEn: "Description (EN)",
						labelVi: "Description (VI)",
						rows: 3,
					})}

					{renderGalleryUpload({
						field: "gallery",
						label: "Hero Gallery",
					})}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Home Products Section</CardTitle>
					<CardDescription>
						Content for home-products-section-database
					</CardDescription>
				</CardHeader>

				<CardContent className="grid gap-6">
					{renderLocalizedTextarea({
						field: "productitle",
						fieldIdEn: "productitleEn",
						fieldIdVi: "productitleVi",
						labelEn: "Product Title (EN)",
						labelVi: "Product Title (VI)",
						rows: 2,
					})}

					{renderLocalizedTextarea({
						field: "productdescription",
						fieldIdEn: "productdescriptionEn",
						fieldIdVi: "productdescriptionVi",
						labelEn: "Product Description (EN)",
						labelVi: "Product Description (VI)",
						rows: 3,
					})}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Home Services Section</CardTitle>
					<CardDescription>Content for home-services-section</CardDescription>
				</CardHeader>

				<CardContent className="grid gap-6">
					{renderLocalizedTextarea({
						field: "servicetitle",
						fieldIdEn: "servicetitleEn",
						fieldIdVi: "servicetitleVi",
						labelEn: "Service Title (EN)",
						labelVi: "Service Title (VI)",
						rows: 2,
					})}

					{renderLocalizedTextarea({
						field: "servicedesription",
						fieldIdEn: "servicedesriptionEn",
						fieldIdVi: "servicedesriptionVi",
						labelEn: "Service Description (EN)",
						labelVi: "Service Description (VI)",
						rows: 3,
					})}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Home Machinery Technology Section</CardTitle>
					<CardDescription>
						Content and images for home-machinery-technology-section
					</CardDescription>
				</CardHeader>

				<CardContent className="grid gap-8">
					<div className="grid gap-6">
						{renderLocalizedTextarea({
							field: "machinetitle",
							fieldIdEn: "machinetitleEn",
							fieldIdVi: "machinetitleVi",
							labelEn: "Machine Section Title (EN)",
							labelVi: "Machine Section Title (VI)",
							rows: 2,
						})}

						{renderLocalizedTextarea({
							field: "machinedescription",
							fieldIdEn: "machinedescriptionEn",
							fieldIdVi: "machinedescriptionVi",
							labelEn: "Machine Section Description (EN)",
							labelVi: "Machine Section Description (VI)",
							rows: 3,
						})}

						{renderSingleImageUpload({
							field: "machinebackgroundimage",
							label: "Machine Background Image",
						})}
					</div>

					<div className="rounded-lg border bg-muted/30 p-5">
						<h3 className="mb-5 text-lg font-semibold">Machine 01</h3>

						<div className="grid gap-6">
							{renderLocalizedTextarea({
								field: "machine1title",
								fieldIdEn: "machine1titleEn",
								fieldIdVi: "machine1titleVi",
								labelEn: "Machine 1 Title (EN)",
								labelVi: "Machine 1 Title (VI)",
								rows: 2,
							})}

							{renderLocalizedTextarea({
								field: "machine1subtitle",
								fieldIdEn: "machine1subtitleEn",
								fieldIdVi: "machine1subtitleVi",
								labelEn: "Machine 1 Subtitle (EN)",
								labelVi: "Machine 1 Subtitle (VI)",
								rows: 2,
							})}

							{renderLocalizedTextarea({
								field: "machine1description",
								fieldIdEn: "machine1descriptionEn",
								fieldIdVi: "machine1descriptionVi",
								labelEn: "Machine 1 Description (EN)",
								labelVi: "Machine 1 Description (VI)",
								rows: 3,
							})}

							{renderSingleImageUpload({
								field: "machine1image",
								label: "Machine 1 Image",
							})}
						</div>
					</div>

					<div className="rounded-lg border bg-muted/30 p-5">
						<h3 className="mb-5 text-lg font-semibold">Machine 02</h3>

						<div className="grid gap-6">
							{renderLocalizedTextarea({
								field: "machine2title",
								fieldIdEn: "machine2titleEn",
								fieldIdVi: "machine2titleVi",
								labelEn: "Machine 2 Title (EN)",
								labelVi: "Machine 2 Title (VI)",
								rows: 2,
							})}

							{renderLocalizedTextarea({
								field: "machine2subtitle",
								fieldIdEn: "machine2subtitleEn",
								fieldIdVi: "machine2subtitleVi",
								labelEn: "Machine 2 Subtitle (EN)",
								labelVi: "Machine 2 Subtitle (VI)",
								rows: 2,
							})}

							{renderLocalizedTextarea({
								field: "machine2description",
								fieldIdEn: "machine2descriptionEn",
								fieldIdVi: "machine2descriptionVi",
								labelEn: "Machine 2 Description (EN)",
								labelVi: "Machine 2 Description (VI)",
								rows: 3,
							})}

							{renderSingleImageUpload({
								field: "machine2image",
								label: "Machine 2 Image",
							})}
						</div>
					</div>

					<div className="rounded-lg border bg-muted/30 p-5">
						<h3 className="mb-5 text-lg font-semibold">Machine 03</h3>

						<div className="grid gap-6">
							{renderLocalizedTextarea({
								field: "machine3title",
								fieldIdEn: "machine3titleEn",
								fieldIdVi: "machine3titleVi",
								labelEn: "Machine 3 Title (EN)",
								labelVi: "Machine 3 Title (VI)",
								rows: 2,
							})}

							{renderLocalizedTextarea({
								field: "machine3subtitle",
								fieldIdEn: "machine3subtitleEn",
								fieldIdVi: "machine3subtitleVi",
								labelEn: "Machine 3 Subtitle (EN)",
								labelVi: "Machine 3 Subtitle (VI)",
								rows: 2,
							})}

							{renderLocalizedTextarea({
								field: "machine3description",
								fieldIdEn: "machine3descriptionEn",
								fieldIdVi: "machine3descriptionVi",
								labelEn: "Machine 3 Description (EN)",
								labelVi: "Machine 3 Description (VI)",
								rows: 3,
							})}

							{renderSingleImageUpload({
								field: "machine3image",
								label: "Machine 3 Image",
							})}
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Home Clients Section</CardTitle>
					<CardDescription>
						Content and gallery for home-featured-clients-section
					</CardDescription>
				</CardHeader>

				<CardContent className="grid gap-6">
					{renderLocalizedTextarea({
						field: "clienttitle",
						fieldIdEn: "clienttitleEn",
						fieldIdVi: "clienttitleVi",
						labelEn: "Client Title (EN)",
						labelVi: "Client Title (VI)",
						rows: 2,
					})}

					{renderLocalizedTextarea({
						field: "clientdescription",
						fieldIdEn: "clientdescriptionEn",
						fieldIdVi: "clientdescriptionVi",
						labelEn: "Client Description (EN)",
						labelVi: "Client Description (VI)",
						rows: 3,
					})}

					{renderGalleryUpload({
						field: "clientimagegallery",
						label: "Client Image Gallery",
					})}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Home Projects Section</CardTitle>
					<CardDescription>
						Title for home-featured-projects-section
					</CardDescription>
				</CardHeader>

				<CardContent className="grid gap-6">
					{renderLocalizedTextarea({
						field: "projecttitle",
						fieldIdEn: "projecttitleEn",
						fieldIdVi: "projecttitleVi",
						labelEn: "Project Title (EN)",
						labelVi: "Project Title (VI)",
						rows: 2,
					})}
				</CardContent>
			</Card>
		</div>
	);
}