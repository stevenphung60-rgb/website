"use client";

import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { BlogImage } from "src/server/blogs";
import { uploadBlogImageAction } from "./blog.actions";

interface BlogGalleryEditorProps {
	fieldName: string;
	label: string;
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
	};
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
 * Blog gallery editor for article-level gallery images
 * @param props - Blog gallery editor props
 * @returns Blog gallery editor
 */
export function BlogGalleryEditor({ fieldName, label, defaultImages }: BlogGalleryEditorProps) {
	const [images, setImages] = useState<BlogImage[]>(defaultImages);
	const serializedImages = useMemo(() => JSON.stringify(images.map((image, index) => ({ ...image, order: index }))), [images]);

	function updateImage(index: number, nextImage: BlogImage) {
		setImages((currentImages) => currentImages.map((image, imageIndex) => imageIndex === index ? nextImage : image));
	}

	return (
		<div className="rounded-2xl border border-[#E7D0AF] bg-white p-4 shadow-sm">
			<input type="hidden" name={fieldName} value={serializedImages} />

			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-sm font-semibold text-[#342312]">{label}</p>
					<p className="mt-1 text-xs italic text-[#342312]/60">Danh sách ảnh bổ sung hiển thị dưới nội dung bài viết.</p>
				</div>

				<button type="button" onClick={() => setImages((currentImages) => [...currentImages, createImage()])} className="rounded-lg border border-[#E7D0AF] bg-white px-3 py-2 text-sm font-semibold text-[#342312] hover:bg-[#FAF7F1]">
					<Plus className="mr-1 inline size-4" />Thêm ảnh
				</button>
			</div>

			{images.length > 0 ? (
				<div className="grid gap-4 lg:grid-cols-2">
					{images.map((image, index) => (
						<div key={`${image.url}-${index}`} className="rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] p-4">
							<div className="flex gap-2">
								<input value={image.url} onChange={(event) => updateImage(index, { ...image, url: event.target.value })} className="min-w-0 flex-1 rounded-lg border border-[#E7D0AF] bg-white p-2 text-sm" placeholder="URL ảnh" />
								<label className="inline-flex cursor-pointer items-center rounded-lg border border-[#E7D0AF] bg-white px-3 py-2 text-sm font-semibold text-[#342312] hover:bg-[#FAF7F1]">
									<ImagePlus className="mr-1 size-4" /> Upload
									<input type="file" accept="image/*" className="hidden" onChange={async (event) => {
										const file = event.target.files?.[0];
										if (!file) return;
										const url = await uploadImage(file);
										if (url) updateImage(index, { ...image, url });
										event.target.value = "";
									}} />
								</label>
							</div>

							<div className="mt-3 grid gap-2">
								<input value={image.alt.vi} onChange={(event) => updateImage(index, { ...image, alt: { ...image.alt, vi: event.target.value } })} className="rounded-lg border border-[#E7D0AF] bg-white p-2 text-sm" placeholder="Alt tiếng Việt" />
								<input value={image.alt.en} onChange={(event) => updateImage(index, { ...image, alt: { ...image.alt, en: event.target.value } })} className="rounded-lg border border-[#E7D0AF] bg-white p-2 text-sm" placeholder="Alt tiếng Anh" />
								<input value={image.caption?.vi || ""} onChange={(event) => updateImage(index, { ...image, caption: { vi: event.target.value, en: image.caption?.en || "" } })} className="rounded-lg border border-[#E7D0AF] bg-white p-2 text-sm" placeholder="Caption tiếng Việt" />
								<input value={image.caption?.en || ""} onChange={(event) => updateImage(index, { ...image, caption: { vi: image.caption?.vi || "", en: event.target.value } })} className="rounded-lg border border-[#E7D0AF] bg-white p-2 text-sm" placeholder="Caption tiếng Anh" />
							</div>

							<button type="button" onClick={() => setImages((currentImages) => currentImages.filter((_, imageIndex) => imageIndex !== index))} className="mt-3 rounded-lg bg-destructive px-3 py-2 text-xs font-semibold text-destructive-foreground">
								<Trash2 className="mr-1 inline size-3" />Xóa ảnh
							</button>
						</div>
					))}
				</div>
			) : (
				<div className="rounded-xl border border-dashed border-[#E7D0AF] bg-[#FAF7F1] px-4 py-8 text-center text-sm text-[#342312]/60">Chưa có ảnh gallery.</div>
			)}
		</div>
	);
}
