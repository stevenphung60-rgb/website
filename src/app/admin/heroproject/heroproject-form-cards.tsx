"use client";

import { Upload, X } from "lucide-react";
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
import { uploadHeroProjectGalleryImage } from "./heroproject.actions";
import {
	useGallery,
	useHeroProjectActions,
	useHeroProjectInfo,
} from "./heroproject-context";

/**
 * Hero project details form card
 * @returns Project banner content fields
 */
export function HeroProjectDetailsFormCard() {
	const heroProjectInfo = useHeroProjectInfo();
	const { setHeroProjectInfo } = useHeroProjectActions();
	const { gallery, addGalleryImage, removeGalleryImage } = useGallery();

	const updateField = (
		field: "title" | "description",
		lang: "en" | "vi",
		value: string,
	) => {
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
		<Card className="border-[#E7D0AF] bg-white shadow-sm">
			<CardHeader className="border-b border-[#E7D0AF]/70">
				<CardTitle className="font-serif text-xl text-[#342312]">
					Nội dung banner dự án
				</CardTitle>

				<CardDescription className="text-[#342312]/65">
					Quản lý tiêu đề, mô tả và hình ảnh banner của trang dự án.
				</CardDescription>
			</CardHeader>

			<CardContent className="grid gap-6 px-5 py-6">
				<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
					<FormField
						fieldId="titleVi"
						label="Tiêu đề tiếng Việt"
						value={heroProjectInfo.title.vi}
					>
						<FormLabel>Tiêu đề tiếng Việt</FormLabel>

						<FormInput asChild>
							<Textarea
								rows={2}
								value={heroProjectInfo.title.vi}
								onChange={(event) =>
									updateField("title", "vi", event.target.value)
								}
							/>
						</FormInput>

						<FormHelpText />
					</FormField>

					<FormField
						fieldId="titleEn"
						label="Tiêu đề tiếng Anh"
						value={heroProjectInfo.title.en}
					>
						<FormLabel>Tiêu đề tiếng Anh</FormLabel>

						<FormInput asChild>
							<Textarea
								rows={2}
								value={heroProjectInfo.title.en}
								onChange={(event) =>
									updateField("title", "en", event.target.value)
								}
							/>
						</FormInput>

						<FormHelpText />
					</FormField>
				</div>

				<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
					<FormField
						fieldId="descriptionVi"
						label="Mô tả tiếng Việt"
						value={heroProjectInfo.description.vi}
					>
						<FormLabel>Mô tả tiếng Việt</FormLabel>

						<FormInput asChild>
							<Textarea
								rows={3}
								value={heroProjectInfo.description.vi}
								onChange={(event) =>
									updateField("description", "vi", event.target.value)
								}
							/>
						</FormInput>

						<FormHelpText />
					</FormField>

					<FormField
						fieldId="descriptionEn"
						label="Mô tả tiếng Anh"
						value={heroProjectInfo.description.en}
					>
						<FormLabel>Mô tả tiếng Anh</FormLabel>

						<FormInput asChild>
							<Textarea
								rows={3}
								value={heroProjectInfo.description.en}
								onChange={(event) =>
									updateField("description", "en", event.target.value)
								}
							/>
						</FormInput>

						<FormHelpText />
					</FormField>
				</div>

				<div className="space-y-4">
					<label className="text-sm font-medium text-[#342312]">
						Ảnh banner dự án
					</label>

					<label
						className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E7D0AF] bg-[#FAF7F1] p-8 text-center transition-colors hover:bg-white"
						onDragOver={(event) => {
							event.preventDefault();
						}}
						onDrop={(event) => {
							event.preventDefault();

							const files = event.dataTransfer.files;
							if (!files || files.length === 0) return;

							handleUpload(files);
						}}
					>
						<div className="mb-4 flex size-16 items-center justify-center rounded-full bg-white">
							<Upload className="size-8 text-[#342312]" />
						</div>

						<p className="text-base font-semibold text-[#342312]">
							Tải ảnh lên
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

								handleUpload(files);
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
											alt="Banner dự án"
											className="max-h-full max-w-full rounded-lg object-contain"
										/>

										<button
											type="button"
											onClick={() => removeGalleryImage(image.url)}
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
								Tải ít nhất một ảnh để banner dự án hiển thị tốt hơn.
							</p>
						</div>
					)}

					<input type="hidden" name="gallery" value={JSON.stringify(gallery)} />
				</div>
			</CardContent>
		</Card>
	);
}