"use client";

import { Check, ImagePlus, Star, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "src/components/ui/button";
import type { BlogImage } from "src/server/blogs";
import { uploadBlogImageAction } from "./blog.actions";

interface BlogGallerySelectorProps {
	fieldName: string;
	defaultImages: BlogImage[];
}

function createImage(url = ""): BlogImage {
	return {
		url,
		alt: {
			vi: "",
			en: "",
		},
		caption: {
			vi: "",
			en: "",
		},
		order: 0,
		isMain: false,
	};
}

function normalizeImages(images: BlogImage[]): BlogImage[] {
	const filteredImages = images
		.filter((image) => image.url)
		.map((image, index) => ({
			...image,
			alt: {
				vi: image.alt?.vi || "",
				en: image.alt?.en || "",
			},
			caption: {
				vi: image.caption?.vi || "",
				en: image.caption?.en || "",
			},
			order: index,
		}));

	if (filteredImages.length === 0) {
		return [];
	}

	const mainIndex = filteredImages.findIndex((image) => image.isMain);

	return filteredImages.map((image, index) => ({
		...image,
		isMain: mainIndex >= 0 ? index === mainIndex : index === 0,
		order: index,
	}));
}

async function uploadImage(file: File) {
	const formData = new FormData();
	formData.append("image", file);

	const result = await uploadBlogImageAction(formData);

	if (!result.success) {
		alert(result.error);
		return "";
	}

	return result.data;
}

/**
 * Blog image gallery selector with main-image selection.
 * @param props - Gallery selector props
 * @returns Gallery selector
 */
export function BlogGallerySelector({
	fieldName,
	defaultImages,
}: BlogGallerySelectorProps) {
	const [images, setImages] = useState<BlogImage[]>(
		normalizeImages(defaultImages),
	);
	const serializedImages = useMemo(
		() => JSON.stringify(normalizeImages(images)),
		[images],
	);

	function setMainImage(index: number) {
		setImages((currentImages) =>
			normalizeImages(
				currentImages.map((image, imageIndex) => ({
					...image,
					isMain: imageIndex === index,
				})),
			),
		);
	}

	function removeImage(index: number) {
		setImages((currentImages) =>
			normalizeImages(currentImages.filter((_, imageIndex) => imageIndex !== index)),
		);
	}

	async function handleUpload(files: FileList | null) {
		if (!files || files.length === 0) return;

		const uploadedImages: BlogImage[] = [];

		for (const file of Array.from(files)) {
			const url = await uploadImage(file);
			if (url) uploadedImages.push(createImage(url));
		}

		setImages((currentImages) =>
			normalizeImages([...currentImages, ...uploadedImages]),
		);
	}

	return (
		<section className="rounded-2xl border border-[#E7D0AF] bg-white shadow-sm">
			<input type="hidden" name={fieldName} value={serializedImages} />

			<div className="border-b border-[#E7D0AF]/70 px-4 py-4 sm:px-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h2 className="text-base font-semibold text-[#342312]">
							Gallery ảnh blog
						</h2>
						<p className="mt-1 text-sm leading-6 text-[#342312]/65">
							Upload nhiều ảnh và chọn một ảnh làm ảnh chính. Ảnh chính dùng cho
							card blog và cover đầu bài.
						</p>
					</div>

					<label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-[#E7D0AF] bg-white px-4 py-2 text-sm font-semibold text-[#342312] hover:bg-[#FAF7F1]">
						<ImagePlus className="mr-2 size-4" />
						Upload ảnh
						<input
							type="file"
							accept="image/*"
							multiple
							className="hidden"
							onChange={(event) => {
								handleUpload(event.target.files);
								event.target.value = "";
							}}
						/>
					</label>
				</div>
			</div>

			<div className="space-y-4 px-4 py-5 sm:px-6">
				{images.length > 0 ? (
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{images.map((image, index) => (
							<div
								key={`${image.url}-${index}`}
								className="rounded-2xl border border-[#E7D0AF] bg-[#FAF7F1] p-3"
							>
								<div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#E7D0AF] bg-white">
									<img
										src={image.url}
										alt="Blog image"
										className="h-full w-full object-cover"
									/>

									{image.isMain ? (
										<div className="absolute left-2 top-2 inline-flex items-center rounded-full bg-[#A87E3C] px-2 py-1 text-xs font-semibold text-white">
											<Star className="mr-1 size-3" /> Ảnh chính
										</div>
									) : null}
								</div>

								<div className="mt-3 flex flex-wrap gap-2">
									<Button
										type="button"
										variant="outline"
										onClick={() => setMainImage(index)}
										className="border-[#E7D0AF] bg-white text-[#342312]"
									>
										<Check className="mr-1 size-4" /> Chọn ảnh chính
									</Button>

									<Button
										type="button"
										variant="destructive"
										onClick={() => removeImage(index)}
									>
										<Trash2 className="mr-1 size-4" /> Xóa
									</Button>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="rounded-2xl border border-dashed border-[#E7D0AF] bg-[#FAF7F1] px-4 py-10 text-center text-sm text-[#342312]/65">
						Chưa có ảnh. Upload ảnh để tạo gallery blog.
					</div>
				)}
			</div>
		</section>
	);
}
