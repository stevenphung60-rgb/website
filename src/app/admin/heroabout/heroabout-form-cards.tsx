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
import { uploadHeroAboutGalleryImage } from "./heroabout.actions";
import {
	useGallery,
	useHeroAboutActions,
	useHeroAboutInfo,
} from "./heroabout-context";
import type { HeroAboutInfo } from "./heroabout.type";

type LocalizedHeroAboutField = Exclude<keyof HeroAboutInfo, "gallery">;

/**
 * Hero about details form card
 * @returns About page content fields
 */
export function HeroAboutDetailsFormCard() {
	const heroAboutInfo = useHeroAboutInfo();
	const { setHeroAboutInfo } = useHeroAboutActions();
	const { gallery, addGalleryImage, removeGalleryImage } = useGallery();

	const updateField = (
		field: LocalizedHeroAboutField,
		lang: "en" | "vi",
		value: string,
	) => {
		setHeroAboutInfo({
			...heroAboutInfo,
			[field]: {
				...heroAboutInfo[field],
				[lang]: value,
			},
		});
	};

	const renderLocalizedField = (
		field: LocalizedHeroAboutField,
		labelVi: string,
		labelEn: string,
		rows = 3,
	) => {
		return (
			<div key={field} className="grid gap-5 lg:grid-cols-2">
				<FormField
					fieldId={`${field}Vi`}
					label={labelVi}
					value={heroAboutInfo[field].vi}
				>
					<FormLabel>{labelVi}</FormLabel>

					<FormInput asChild>
						<Textarea
							name={`${field}Vi`}
							rows={rows}
							value={heroAboutInfo[field].vi}
							onChange={(event) => updateField(field, "vi", event.target.value)}
						/>
					</FormInput>

					<FormHelpText />
				</FormField>

				<FormField
					fieldId={`${field}En`}
					label={labelEn}
					value={heroAboutInfo[field].en}
				>
					<FormLabel>{labelEn}</FormLabel>

					<FormInput asChild>
						<Textarea
							name={`${field}En`}
							rows={rows}
							value={heroAboutInfo[field].en}
							onChange={(event) => updateField(field, "en", event.target.value)}
						/>
					</FormInput>

					<FormHelpText />
				</FormField>
			</div>
		);
	};

	async function handleUpload(files: FileList | File[]) {
		const fileArray = Array.from(files);

		for (const [index, file] of fileArray.entries()) {
			const formData = new FormData();
			formData.append("image", file);

			const result = await uploadHeroAboutGalleryImage(formData);

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
					Nội dung giới thiệu
				</CardTitle>

				<CardDescription className="text-[#342312]/65">
					Quản lý nội dung trang giới thiệu hiển thị trên website.
				</CardDescription>
			</CardHeader>

			<CardContent className="grid gap-8 px-5 py-6">
				<div className="grid gap-6">
					<h3 className="text-lg font-semibold text-[#342312]">
						Thông tin đầu trang
					</h3>

					{renderLocalizedField(
						"title",
						"Tiêu đề tiếng Việt",
						"Tiêu đề tiếng Anh",
						2,
					)}

					{renderLocalizedField(
						"description",
						"Mô tả tiếng Việt",
						"Mô tả tiếng Anh",
						3,
					)}

					{renderLocalizedField(
						"factoryaddress",
						"Địa chỉ nhà máy tiếng Việt",
						"Địa chỉ nhà máy tiếng Anh",
						3,
					)}

					{renderLocalizedField(
						"officeaddress",
						"Địa chỉ văn phòng tiếng Việt",
						"Địa chỉ văn phòng tiếng Anh",
						3,
					)}
				</div>

				<div className="grid gap-4 border-t border-[#E7D0AF]/70 pt-8">
					<label className="text-sm font-medium text-[#342312]">
						Gallery giới thiệu
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
											alt="Gallery giới thiệu"
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
								Tải ít nhất một ảnh nếu khu vực giới thiệu cần hiển thị gallery.
							</p>
						</div>
					)}

					<input type="hidden" name="gallery" value={JSON.stringify(gallery)} />
				</div>

				<div className="grid gap-6 border-t border-[#E7D0AF]/70 pt-8">
					<h3 className="text-lg font-semibold text-[#342312]">
						Thông tin video
					</h3>

					{renderLocalizedField(
						"youtubelink",
						"Link YouTube tiếng Việt",
						"Link YouTube tiếng Anh",
						2,
					)}

					{renderLocalizedField(
						"videotitle",
						"Tiêu đề video tiếng Việt",
						"Tiêu đề video tiếng Anh",
						2,
					)}

					{renderLocalizedField(
						"videodescription",
						"Mô tả video tiếng Việt",
						"Mô tả video tiếng Anh",
						4,
					)}
				</div>

				<div className="grid gap-6 border-t border-[#E7D0AF]/70 pt-8">
					<h3 className="text-lg font-semibold text-[#342312]">
						Lịch sử phát triển
					</h3>

					{renderLocalizedField(
						"historytitle",
						"Tiêu đề lịch sử tiếng Việt",
						"Tiêu đề lịch sử tiếng Anh",
						2,
					)}

					{renderLocalizedField(
						"historydescription",
						"Mô tả lịch sử tiếng Việt",
						"Mô tả lịch sử tiếng Anh",
						4,
					)}

					{renderLocalizedField(
						"historytime1",
						"Mốc thời gian 01 tiếng Việt",
						"Mốc thời gian 01 tiếng Anh",
						2,
					)}

					{renderLocalizedField(
						"historytitle1",
						"Tiêu đề mốc 01 tiếng Việt",
						"Tiêu đề mốc 01 tiếng Anh",
						2,
					)}

					{renderLocalizedField(
						"historydetail1",
						"Chi tiết mốc 01 tiếng Việt",
						"Chi tiết mốc 01 tiếng Anh",
						4,
					)}

					{renderLocalizedField(
						"historytime2",
						"Mốc thời gian 02 tiếng Việt",
						"Mốc thời gian 02 tiếng Anh",
						2,
					)}

					{renderLocalizedField(
						"historytitle2",
						"Tiêu đề mốc 02 tiếng Việt",
						"Tiêu đề mốc 02 tiếng Anh",
						2,
					)}

					{renderLocalizedField(
						"historydetail2",
						"Chi tiết mốc 02 tiếng Việt",
						"Chi tiết mốc 02 tiếng Anh",
						4,
					)}

					{renderLocalizedField(
						"historytime3",
						"Mốc thời gian 03 tiếng Việt",
						"Mốc thời gian 03 tiếng Anh",
						2,
					)}

					{renderLocalizedField(
						"historytitle3",
						"Tiêu đề mốc 03 tiếng Việt",
						"Tiêu đề mốc 03 tiếng Anh",
						2,
					)}

					{renderLocalizedField(
						"historydetail3",
						"Chi tiết mốc 03 tiếng Việt",
						"Chi tiết mốc 03 tiếng Anh",
						4,
					)}
				</div>

				<div className="grid gap-6 border-t border-[#E7D0AF]/70 pt-8">
					<h3 className="text-lg font-semibold text-[#342312]">
						Giá trị cốt lõi
					</h3>

					{renderLocalizedField(
						"valuestatementtitle",
						"Tiêu đề khối giá trị tiếng Việt",
						"Tiêu đề khối giá trị tiếng Anh",
						2,
					)}

					{renderLocalizedField(
						"valuestatementtitle1",
						"Tiêu đề giá trị 01 tiếng Việt",
						"Tiêu đề giá trị 01 tiếng Anh",
						2,
					)}

					{renderLocalizedField(
						"valuestatementdetail1",
						"Chi tiết giá trị 01 tiếng Việt",
						"Chi tiết giá trị 01 tiếng Anh",
						4,
					)}

					{renderLocalizedField(
						"valuestatementtitle2",
						"Tiêu đề giá trị 02 tiếng Việt",
						"Tiêu đề giá trị 02 tiếng Anh",
						2,
					)}

					{renderLocalizedField(
						"valuestatementdetail2",
						"Chi tiết giá trị 02 tiếng Việt",
						"Chi tiết giá trị 02 tiếng Anh",
						4,
					)}

					{renderLocalizedField(
						"valuestatementtitle3",
						"Tiêu đề giá trị 03 tiếng Việt",
						"Tiêu đề giá trị 03 tiếng Anh",
						2,
					)}

					{renderLocalizedField(
						"valuestatementdetail3",
						"Chi tiết giá trị 03 tiếng Việt",
						"Chi tiết giá trị 03 tiếng Anh",
						4,
					)}
				</div>

				<div className="grid gap-6 border-t border-[#E7D0AF]/70 pt-8">
					<h3 className="text-lg font-semibold text-[#342312]">
						Năng lực sản xuất
					</h3>

					{renderLocalizedField(
						"capacitytitle",
						"Tiêu đề năng lực tiếng Việt",
						"Tiêu đề năng lực tiếng Anh",
						2,
					)}

					{renderLocalizedField(
						"capacitydescription",
						"Mô tả năng lực tiếng Việt",
						"Mô tả năng lực tiếng Anh",
						4,
					)}

					{renderLocalizedField(
						"capacitytitle1",
						"Tiêu đề năng lực 01 tiếng Việt",
						"Tiêu đề năng lực 01 tiếng Anh",
						2,
					)}

					{renderLocalizedField(
						"capacitydetail1",
						"Chi tiết năng lực 01 tiếng Việt",
						"Chi tiết năng lực 01 tiếng Anh",
						4,
					)}

					{renderLocalizedField(
						"capacitytitle2",
						"Tiêu đề năng lực 02 tiếng Việt",
						"Tiêu đề năng lực 02 tiếng Anh",
						2,
					)}

					{renderLocalizedField(
						"capacitydetail2",
						"Chi tiết năng lực 02 tiếng Việt",
						"Chi tiết năng lực 02 tiếng Anh",
						4,
					)}

					{renderLocalizedField(
						"capacitytitle3",
						"Tiêu đề năng lực 03 tiếng Việt",
						"Tiêu đề năng lực 03 tiếng Anh",
						2,
					)}

					{renderLocalizedField(
						"capacitydetail3",
						"Chi tiết năng lực 03 tiếng Việt",
						"Chi tiết năng lực 03 tiếng Anh",
						4,
					)}

					{renderLocalizedField(
						"capacitytitle4",
						"Tiêu đề năng lực 04 tiếng Việt",
						"Tiêu đề năng lực 04 tiếng Anh",
						2,
					)}

					{renderLocalizedField(
						"capacitydetail4",
						"Chi tiết năng lực 04 tiếng Việt",
						"Chi tiết năng lực 04 tiếng Anh",
						4,
					)}
				</div>
			</CardContent>
		</Card>
	);
}