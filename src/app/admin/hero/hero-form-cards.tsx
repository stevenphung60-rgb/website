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

interface LocalizedTextareaConfig {
	field: LocalizedHeroField;
	fieldIdEn: string;
	fieldIdVi: string;
	labelEn: string;
	labelVi: string;
	rows?: number;
}

interface SingleImageUploadConfig {
	field: SingleImageHeroField;
	label: string;
}

interface GalleryUploadConfig {
	field: GalleryHeroField;
	label: string;
}

/**
 * Home hero details form card
 * @returns Home page content fields
 */
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
	}: LocalizedTextareaConfig) {
		return (
			<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
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
			</div>
		);
	}

	function renderSingleImageUpload({ field, label }: SingleImageUploadConfig) {
		const image = heroInfo[field];
		const isUploading = uploadingField === field;

		return (
			<div className="space-y-3">
				<label className="text-sm font-medium text-[#342312]">{label}</label>

				{image.url ? (
					<div className="overflow-hidden rounded-2xl border border-[#E7D0AF] bg-white shadow-sm">
						<div className="flex h-[260px] items-center justify-center bg-[#FAF7F1] p-4">
							<img
								src={image.url}
								alt={label}
								className="max-h-full max-w-full rounded-lg object-contain"
							/>
						</div>

						<div className="flex justify-end gap-2 border-t border-[#E7D0AF]/70 px-4 py-3">
							<label className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-[#E7D0AF] bg-white px-3 text-sm font-semibold text-[#342312] transition hover:bg-[#FAF7F1]">
								Đổi ảnh

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

							<button
								type="button"
								onClick={() => setSingleImage(field, "")}
								className="inline-flex h-9 items-center justify-center rounded-lg bg-destructive px-3 text-sm font-semibold text-destructive-foreground transition hover:opacity-90"
							>
								Xóa ảnh
							</button>
						</div>
					</div>
				) : (
					<label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E7D0AF] bg-[#FAF7F1] p-8 text-center transition-colors hover:bg-white">
						<div className="mb-4 flex size-14 items-center justify-center rounded-full bg-white">
							<Upload className="size-7 text-[#342312]" />
						</div>

						<p className="text-base font-semibold text-[#342312]">
							{isUploading ? "Đang tải ảnh..." : label}
						</p>

						<p className="mt-1 text-sm italic text-[#342312]/65">
							Bấm để tải ảnh lên
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
				)}

				<input type="hidden" name={field} value={JSON.stringify(image)} />
			</div>
		);
	}

	function renderGalleryUpload({ field, label }: GalleryUploadConfig) {
		const gallery = heroInfo[field] || [];
		const isUploading = uploadingField === field;

		return (
			<div className="space-y-4">
				<label className="text-sm font-medium text-[#342312]">{label}</label>

				<label
					className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E7D0AF] bg-[#FAF7F1] p-8 text-center transition-colors hover:bg-white"
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
					<div className="mb-4 flex size-16 items-center justify-center rounded-full bg-white">
						<Upload className="size-8 text-[#342312]" />
					</div>

					<p className="text-base font-semibold text-[#342312]">
						{isUploading ? "Đang tải ảnh..." : "Tải ảnh lên"}
					</p>

					<p className="mt-1 text-sm italic text-[#342312]/65">
						Bấm để chọn ảnh hoặc kéo thả ảnh vào khu vực này.
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

				{gallery.length > 0 ? (
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
						{gallery.map((image) => (
							<div
								key={image.url}
								className="overflow-hidden rounded-2xl border border-[#E7D0AF] bg-white shadow-sm"
							>
								<div className="relative flex h-32 items-center justify-center bg-[#FAF7F1] p-2">
									<img
										src={image.url}
										alt={label}
										className="max-h-full max-w-full rounded-lg object-contain"
									/>

									<button
										type="button"
										onClick={() => removeGalleryImage(field, image.url)}
										className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow transition hover:opacity-90"
										aria-label="Xóa ảnh"
									>
										<X className="size-4" />
									</button>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="rounded-xl border border-dashed border-[#E7D0AF] bg-white px-4 py-6 text-center">
						<p className="text-sm font-medium text-[#342312]">Chưa có ảnh</p>

						<p className="mt-1 text-xs italic leading-5 text-[#342312]/65">
							Tải ít nhất một ảnh nếu khu vực này cần hiển thị gallery trên website.
						</p>
					</div>
				)}

				<input type="hidden" name={field} value={JSON.stringify(gallery)} />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<Card className="border-[#E7D0AF] bg-white shadow-sm">
				<CardHeader className="border-b border-[#E7D0AF]/70">
					<CardTitle className="font-serif text-xl text-[#342312]">
						Banner chính
					</CardTitle>

					<CardDescription className="text-[#342312]/65">
						Quản lý tiêu đề, mô tả và ảnh banner đầu trang chủ.
					</CardDescription>
				</CardHeader>

				<CardContent className="grid gap-6 px-5 py-6">
					{renderLocalizedTextarea({
						field: "title",
						fieldIdEn: "titleEn",
						fieldIdVi: "titleVi",
						labelVi: "Tiêu đề tiếng Việt",
						labelEn: "Tiêu đề tiếng Anh",
						rows: 2,
					})}

					{renderLocalizedTextarea({
						field: "description",
						fieldIdEn: "descriptionEn",
						fieldIdVi: "descriptionVi",
						labelVi: "Mô tả tiếng Việt",
						labelEn: "Mô tả tiếng Anh",
						rows: 3,
					})}

					{renderGalleryUpload({
						field: "gallery",
						label: "Ảnh banner trang chủ",
					})}
				</CardContent>
			</Card>

			<Card className="border-[#E7D0AF] bg-white shadow-sm">
				<CardHeader className="border-b border-[#E7D0AF]/70">
					<CardTitle className="font-serif text-xl text-[#342312]">
						Khối sản phẩm
					</CardTitle>

					<CardDescription className="text-[#342312]/65">
						Quản lý tiêu đề và mô tả của khu vực sản phẩm trên trang chủ.
					</CardDescription>
				</CardHeader>

				<CardContent className="grid gap-6 px-5 py-6">
					{renderLocalizedTextarea({
						field: "productitle",
						fieldIdEn: "productitleEn",
						fieldIdVi: "productitleVi",
						labelVi: "Tiêu đề sản phẩm tiếng Việt",
						labelEn: "Tiêu đề sản phẩm tiếng Anh",
						rows: 2,
					})}

					{renderLocalizedTextarea({
						field: "productdescription",
						fieldIdEn: "productdescriptionEn",
						fieldIdVi: "productdescriptionVi",
						labelVi: "Mô tả sản phẩm tiếng Việt",
						labelEn: "Mô tả sản phẩm tiếng Anh",
						rows: 3,
					})}
				</CardContent>
			</Card>

			<Card className="border-[#E7D0AF] bg-white shadow-sm">
				<CardHeader className="border-b border-[#E7D0AF]/70">
					<CardTitle className="font-serif text-xl text-[#342312]">
						Khối dịch vụ
					</CardTitle>

					<CardDescription className="text-[#342312]/65">
						Quản lý tiêu đề và mô tả của khu vực dịch vụ trên trang chủ.
					</CardDescription>
				</CardHeader>

				<CardContent className="grid gap-6 px-5 py-6">
					{renderLocalizedTextarea({
						field: "servicetitle",
						fieldIdEn: "servicetitleEn",
						fieldIdVi: "servicetitleVi",
						labelVi: "Tiêu đề dịch vụ tiếng Việt",
						labelEn: "Tiêu đề dịch vụ tiếng Anh",
						rows: 2,
					})}

					{renderLocalizedTextarea({
						field: "servicedesription",
						fieldIdEn: "servicedesriptionEn",
						fieldIdVi: "servicedesriptionVi",
						labelVi: "Mô tả dịch vụ tiếng Việt",
						labelEn: "Mô tả dịch vụ tiếng Anh",
						rows: 3,
					})}
				</CardContent>
			</Card>

			<Card className="border-[#E7D0AF] bg-white shadow-sm">
				<CardHeader className="border-b border-[#E7D0AF]/70">
					<CardTitle className="font-serif text-xl text-[#342312]">
						Khối công nghệ máy móc
					</CardTitle>

					<CardDescription className="text-[#342312]/65">
						Quản lý nội dung và hình ảnh khu vực công nghệ, máy móc trên trang chủ.
					</CardDescription>
				</CardHeader>

				<CardContent className="grid gap-8 px-5 py-6">
					<div className="grid gap-6">
						{renderLocalizedTextarea({
							field: "machinetitle",
							fieldIdEn: "machinetitleEn",
							fieldIdVi: "machinetitleVi",
							labelVi: "Tiêu đề khối máy móc tiếng Việt",
							labelEn: "Tiêu đề khối máy móc tiếng Anh",
							rows: 2,
						})}

						{renderLocalizedTextarea({
							field: "machinedescription",
							fieldIdEn: "machinedescriptionEn",
							fieldIdVi: "machinedescriptionVi",
							labelVi: "Mô tả khối máy móc tiếng Việt",
							labelEn: "Mô tả khối máy móc tiếng Anh",
							rows: 3,
						})}

						{renderSingleImageUpload({
							field: "machinebackgroundimage",
							label: "Ảnh nền khối máy móc",
						})}
					</div>

					<div className="rounded-2xl border border-[#E7D0AF] bg-[#FAF7F1] p-5">
						<h3 className="mb-5 text-lg font-semibold text-[#342312]">
							Máy móc 01
						</h3>

						<div className="grid gap-6">
							{renderLocalizedTextarea({
								field: "machine1title",
								fieldIdEn: "machine1titleEn",
								fieldIdVi: "machine1titleVi",
								labelVi: "Tên máy móc 01 tiếng Việt",
								labelEn: "Tên máy móc 01 tiếng Anh",
								rows: 2,
							})}

							{renderLocalizedTextarea({
								field: "machine1subtitle",
								fieldIdEn: "machine1subtitleEn",
								fieldIdVi: "machine1subtitleVi",
								labelVi: "Phụ đề máy móc 01 tiếng Việt",
								labelEn: "Phụ đề máy móc 01 tiếng Anh",
								rows: 2,
							})}

							{renderLocalizedTextarea({
								field: "machine1description",
								fieldIdEn: "machine1descriptionEn",
								fieldIdVi: "machine1descriptionVi",
								labelVi: "Mô tả máy móc 01 tiếng Việt",
								labelEn: "Mô tả máy móc 01 tiếng Anh",
								rows: 3,
							})}

							{renderSingleImageUpload({
								field: "machine1image",
								label: "Ảnh máy móc 01",
							})}
						</div>
					</div>

					<div className="rounded-2xl border border-[#E7D0AF] bg-[#FAF7F1] p-5">
						<h3 className="mb-5 text-lg font-semibold text-[#342312]">
							Máy móc 02
						</h3>

						<div className="grid gap-6">
							{renderLocalizedTextarea({
								field: "machine2title",
								fieldIdEn: "machine2titleEn",
								fieldIdVi: "machine2titleVi",
								labelVi: "Tên máy móc 02 tiếng Việt",
								labelEn: "Tên máy móc 02 tiếng Anh",
								rows: 2,
							})}

							{renderLocalizedTextarea({
								field: "machine2subtitle",
								fieldIdEn: "machine2subtitleEn",
								fieldIdVi: "machine2subtitleVi",
								labelVi: "Phụ đề máy móc 02 tiếng Việt",
								labelEn: "Phụ đề máy móc 02 tiếng Anh",
								rows: 2,
							})}

							{renderLocalizedTextarea({
								field: "machine2description",
								fieldIdEn: "machine2descriptionEn",
								fieldIdVi: "machine2descriptionVi",
								labelVi: "Mô tả máy móc 02 tiếng Việt",
								labelEn: "Mô tả máy móc 02 tiếng Anh",
								rows: 3,
							})}

							{renderSingleImageUpload({
								field: "machine2image",
								label: "Ảnh máy móc 02",
							})}
						</div>
					</div>

					<div className="rounded-2xl border border-[#E7D0AF] bg-[#FAF7F1] p-5">
						<h3 className="mb-5 text-lg font-semibold text-[#342312]">
							Máy móc 03
						</h3>

						<div className="grid gap-6">
							{renderLocalizedTextarea({
								field: "machine3title",
								fieldIdEn: "machine3titleEn",
								fieldIdVi: "machine3titleVi",
								labelVi: "Tên máy móc 03 tiếng Việt",
								labelEn: "Tên máy móc 03 tiếng Anh",
								rows: 2,
							})}

							{renderLocalizedTextarea({
								field: "machine3subtitle",
								fieldIdEn: "machine3subtitleEn",
								fieldIdVi: "machine3subtitleVi",
								labelVi: "Phụ đề máy móc 03 tiếng Việt",
								labelEn: "Phụ đề máy móc 03 tiếng Anh",
								rows: 2,
							})}

							{renderLocalizedTextarea({
								field: "machine3description",
								fieldIdEn: "machine3descriptionEn",
								fieldIdVi: "machine3descriptionVi",
								labelVi: "Mô tả máy móc 03 tiếng Việt",
								labelEn: "Mô tả máy móc 03 tiếng Anh",
								rows: 3,
							})}

							{renderSingleImageUpload({
								field: "machine3image",
								label: "Ảnh máy móc 03",
							})}
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="border-[#E7D0AF] bg-white shadow-sm">
				<CardHeader className="border-b border-[#E7D0AF]/70">
					<CardTitle className="font-serif text-xl text-[#342312]">
						Khối khách hàng
					</CardTitle>

					<CardDescription className="text-[#342312]/65">
						Quản lý tiêu đề, mô tả và gallery khách hàng trên trang chủ.
					</CardDescription>
				</CardHeader>

				<CardContent className="grid gap-6 px-5 py-6">
					{renderLocalizedTextarea({
						field: "clienttitle",
						fieldIdEn: "clienttitleEn",
						fieldIdVi: "clienttitleVi",
						labelVi: "Tiêu đề khách hàng tiếng Việt",
						labelEn: "Tiêu đề khách hàng tiếng Anh",
						rows: 2,
					})}

					{renderLocalizedTextarea({
						field: "clientdescription",
						fieldIdEn: "clientdescriptionEn",
						fieldIdVi: "clientdescriptionVi",
						labelVi: "Mô tả khách hàng tiếng Việt",
						labelEn: "Mô tả khách hàng tiếng Anh",
						rows: 3,
					})}

					{renderGalleryUpload({
						field: "clientimagegallery",
						label: "Gallery khách hàng",
					})}
				</CardContent>
			</Card>

			<Card className="border-[#E7D0AF] bg-white shadow-sm">
				<CardHeader className="border-b border-[#E7D0AF]/70">
					<CardTitle className="font-serif text-xl text-[#342312]">
						Khối dự án
					</CardTitle>

					<CardDescription className="text-[#342312]/65">
						Quản lý tiêu đề khu vực dự án nổi bật trên trang chủ.
					</CardDescription>
				</CardHeader>

				<CardContent className="grid gap-6 px-5 py-6">
					{renderLocalizedTextarea({
						field: "projecttitle",
						fieldIdEn: "projecttitleEn",
						fieldIdVi: "projecttitleVi",
						labelVi: "Tiêu đề dự án tiếng Việt",
						labelEn: "Tiêu đề dự án tiếng Anh",
						rows: 2,
					})}
				</CardContent>
			</Card>
		</div>
	);
}