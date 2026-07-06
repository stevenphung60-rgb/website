"use client";

import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { BlogContentBlock, BlogGalleryBlock, BlogImage, BlogImageBlock, BlogListBlock, BlogTableBlock } from "src/server/blogs";
import { uploadBlogImageAction } from "./blog.actions";

interface BlogContentEditorProps {
	fieldName: string;
	label: string;
	defaultBlocks: BlogContentBlock[];
}

function createId() {
	return `block-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createParagraphBlock(): BlogContentBlock {
	return {
		id: createId(),
		type: "paragraph",
		text: "",
		size: "standard",
		align: "left",
	};
}

function createHeadingBlock(): BlogContentBlock {
	return {
		id: createId(),
		type: "heading",
		level: 2,
		text: "",
		size: "standard",
		align: "left",
	};
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
 * Controlled blog content block editor
 * @param props - Blog content editor props
 * @returns Blog content editor
 */
export function BlogContentEditor({ fieldName, label, defaultBlocks }: BlogContentEditorProps) {
	const [blocks, setBlocks] = useState<BlogContentBlock[]>(
		defaultBlocks.length > 0 ? defaultBlocks : [createParagraphBlock()],
	);

	const serializedBlocks = useMemo(() => JSON.stringify(blocks), [blocks]);

	function updateBlock(blockId: string, nextBlock: BlogContentBlock) {
		setBlocks((currentBlocks) =>
			currentBlocks.map((block) => (block.id === blockId ? nextBlock : block)),
		);
	}

	function removeBlock(blockId: string) {
		setBlocks((currentBlocks) => {
			const nextBlocks = currentBlocks.filter((block) => block.id !== blockId);
			return nextBlocks.length > 0 ? nextBlocks : [createParagraphBlock()];
		});
	}

	function addBlock(type: BlogContentBlock["type"]) {
		const newBlock: BlogContentBlock =
			type === "heading"
				? createHeadingBlock()
				: type === "quote"
					? { id: createId(), type: "quote", text: "" }
					: type === "list"
						? { id: createId(), type: "list", style: "bullet", items: [""] }
						: type === "image"
							? { id: createId(), type: "image", image: createImage() }
							: type === "gallery"
								? { id: createId(), type: "gallery", images: [], columns: 3 }
								: type === "table"
									? { id: createId(), type: "table", rows: [["Tiêu đề 1", "Tiêu đề 2"], ["", ""]] }
									: createParagraphBlock();

		setBlocks((currentBlocks) => [...currentBlocks, newBlock]);
	}

	return (
		<div className="rounded-2xl border border-[#E7D0AF] bg-white p-4">
			<input type="hidden" name={fieldName} value={serializedBlocks} />

			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-sm font-semibold text-[#342312]">{label}</p>
					<p className="mt-1 text-xs italic text-[#342312]/60">
						Hỗ trợ **đậm**, *nghiêng*, __gạch dưới__, [link](https://...)
					</p>
				</div>

				<div className="flex flex-wrap gap-2">
					<button type="button" onClick={() => addBlock("paragraph")} className="rounded-lg border border-[#E7D0AF] px-3 py-2 text-xs font-semibold text-[#342312] hover:bg-[#FAF7F1]">
						<Plus className="mr-1 inline size-3" /> Đoạn
					</button>
					<button type="button" onClick={() => addBlock("heading")} className="rounded-lg border border-[#E7D0AF] px-3 py-2 text-xs font-semibold text-[#342312] hover:bg-[#FAF7F1]">Tiêu đề</button>
					<button type="button" onClick={() => addBlock("image")} className="rounded-lg border border-[#E7D0AF] px-3 py-2 text-xs font-semibold text-[#342312] hover:bg-[#FAF7F1]">Ảnh</button>
					<button type="button" onClick={() => addBlock("gallery")} className="rounded-lg border border-[#E7D0AF] px-3 py-2 text-xs font-semibold text-[#342312] hover:bg-[#FAF7F1]">Gallery</button>
					<button type="button" onClick={() => addBlock("list")} className="rounded-lg border border-[#E7D0AF] px-3 py-2 text-xs font-semibold text-[#342312] hover:bg-[#FAF7F1]">List</button>
					<button type="button" onClick={() => addBlock("table")} className="rounded-lg border border-[#E7D0AF] px-3 py-2 text-xs font-semibold text-[#342312] hover:bg-[#FAF7F1]">Bảng</button>
					<button type="button" onClick={() => addBlock("quote")} className="rounded-lg border border-[#E7D0AF] px-3 py-2 text-xs font-semibold text-[#342312] hover:bg-[#FAF7F1]">Quote</button>
				</div>
			</div>

			<div className="space-y-4">
				{blocks.map((block, index) => (
					<div key={block.id} className="rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] p-4">
						<div className="mb-3 flex items-center justify-between gap-3">
							<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/60">
								Block {index + 1}: {block.type}
							</p>

							<button type="button" onClick={() => removeBlock(block.id)} className="rounded-lg bg-destructive px-2 py-1 text-xs font-semibold text-destructive-foreground">
								<Trash2 className="inline size-3" /> Xóa
							</button>
						</div>

						<BlockEditor block={block} onChange={(nextBlock) => updateBlock(block.id, nextBlock)} />
					</div>
				))}
			</div>
		</div>
	);
}

function BlockEditor({ block, onChange }: { block: BlogContentBlock; onChange: (block: BlogContentBlock) => void }) {
	if (block.type === "paragraph") {
		return (
			<div className="space-y-3">
				<textarea value={block.text} onChange={(event) => onChange({ ...block, text: event.target.value })} rows={5} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm text-[#342312]" />
				<div className="grid gap-3 sm:grid-cols-2">
					<select value={block.size} onChange={(event) => onChange({ ...block, size: event.target.value as any })} className="rounded-lg border border-[#E7D0AF] bg-white p-2 text-sm"><option value="small">Nhỏ</option><option value="standard">Chuẩn</option><option value="large">Lớn</option></select>
					<select value={block.align} onChange={(event) => onChange({ ...block, align: event.target.value as any })} className="rounded-lg border border-[#E7D0AF] bg-white p-2 text-sm"><option value="left">Căn trái</option><option value="center">Căn giữa</option></select>
				</div>
			</div>
		);
	}

	if (block.type === "heading") {
		return (
			<div className="space-y-3">
				<input value={block.text} onChange={(event) => onChange({ ...block, text: event.target.value })} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm text-[#342312]" />
				<div className="grid gap-3 sm:grid-cols-3">
					<select value={block.level} onChange={(event) => onChange({ ...block, level: Number(event.target.value) as 2 | 3 })} className="rounded-lg border border-[#E7D0AF] bg-white p-2 text-sm"><option value="2">H2</option><option value="3">H3</option></select>
					<select value={block.size} onChange={(event) => onChange({ ...block, size: event.target.value as any })} className="rounded-lg border border-[#E7D0AF] bg-white p-2 text-sm"><option value="standard">Chuẩn</option><option value="large">Lớn</option><option value="xlarge">Rất lớn</option></select>
					<select value={block.align} onChange={(event) => onChange({ ...block, align: event.target.value as any })} className="rounded-lg border border-[#E7D0AF] bg-white p-2 text-sm"><option value="left">Căn trái</option><option value="center">Căn giữa</option></select>
				</div>
			</div>
		);
	}

	if (block.type === "quote") {
		return <textarea value={block.text} onChange={(event) => onChange({ ...block, text: event.target.value })} rows={4} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm text-[#342312]" />;
	}

	if (block.type === "list") {
		return (
			<div className="space-y-3">
				<select value={block.style} onChange={(event) => onChange({ ...block, style: event.target.value as any })} className="rounded-lg border border-[#E7D0AF] bg-white p-2 text-sm"><option value="bullet">Bullet</option><option value="numbered">Đánh số</option></select>
				<textarea value={block.items.join("\n")} onChange={(event) => onChange({ ...block, items: event.target.value.split("\n") })} rows={5} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm text-[#342312]" />
			</div>
		);
	}

	if (block.type === "image") {
		const imageBlock = block as BlogImageBlock;
		return <ImageFields image={imageBlock.image} onChange={(image) => onChange({ ...imageBlock, image })} />;
	}

	if (block.type === "gallery") {
		const galleryBlock = block as BlogGalleryBlock;
		return (
			<div className="space-y-3">
				<select value={galleryBlock.columns} onChange={(event) => onChange({ ...galleryBlock, columns: Number(event.target.value) as 2 | 3 })} className="rounded-lg border border-[#E7D0AF] bg-white p-2 text-sm"><option value="2">Grid 2 cột</option><option value="3">Grid 3 cột</option></select>
				<div className="grid gap-3 sm:grid-cols-2">
					{galleryBlock.images.map((image, index) => (
						<div key={`${image.url}-${index}`} className="rounded-lg border border-[#E7D0AF] bg-white p-3">
							<ImageFields image={image} onChange={(nextImage) => {
								const nextImages = galleryBlock.images.map((currentImage, imageIndex) => imageIndex === index ? nextImage : currentImage);
								onChange({ ...galleryBlock, images: nextImages });
							}} />
							<button type="button" onClick={() => onChange({ ...galleryBlock, images: galleryBlock.images.filter((_, imageIndex) => imageIndex !== index) })} className="mt-2 rounded-lg bg-destructive px-2 py-1 text-xs font-semibold text-destructive-foreground">Xóa ảnh</button>
						</div>
					))}
				</div>
				<button type="button" onClick={() => onChange({ ...galleryBlock, images: [...galleryBlock.images, createImage()] })} className="rounded-lg border border-[#E7D0AF] bg-white px-3 py-2 text-sm font-semibold text-[#342312]"><Plus className="mr-1 inline size-4" />Thêm ảnh</button>
			</div>
		);
	}

	if (block.type === "table") {
		const tableBlock = block as BlogTableBlock;
		return (
			<textarea
				value={tableBlock.rows.map((row) => row.join("\t")).join("\n")}
				onChange={(event) => onChange({ ...tableBlock, rows: event.target.value.split("\n").map((row) => row.split("\t")) })}
				rows={6}
				className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 font-mono text-sm text-[#342312]"
				placeholder="Cột 1\tCột 2\nDữ liệu 1\tDữ liệu 2"
			/>
		);
	}

	return null;
}

function ImageFields({ image, onChange }: { image: BlogImage; onChange: (image: BlogImage) => void }) {
	return (
		<div className="space-y-3">
			<div className="flex gap-2">
				<input value={image.url} onChange={(event) => onChange({ ...image, url: event.target.value })} className="min-w-0 flex-1 rounded-lg border border-[#E7D0AF] bg-white p-2 text-sm" placeholder="URL ảnh" />
				<label className="inline-flex cursor-pointer items-center rounded-lg border border-[#E7D0AF] bg-white px-3 py-2 text-sm font-semibold text-[#342312] hover:bg-[#FAF7F1]">
					<ImagePlus className="mr-1 size-4" /> Upload
					<input type="file" accept="image/*" className="hidden" onChange={async (event) => {
						const file = event.target.files?.[0];
						if (!file) return;
						const url = await uploadImage(file);
						if (url) onChange({ ...image, url });
						event.target.value = "";
					}} />
				</label>
			</div>
			<input value={image.alt.vi} onChange={(event) => onChange({ ...image, alt: { ...image.alt, vi: event.target.value } })} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-2 text-sm" placeholder="Alt tiếng Việt" />
			<input value={image.alt.en} onChange={(event) => onChange({ ...image, alt: { ...image.alt, en: event.target.value } })} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-2 text-sm" placeholder="Alt tiếng Anh" />
			<input value={image.caption?.vi || ""} onChange={(event) => onChange({ ...image, caption: { vi: event.target.value, en: image.caption?.en || "" } })} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-2 text-sm" placeholder="Caption tiếng Việt" />
			<input value={image.caption?.en || ""} onChange={(event) => onChange({ ...image, caption: { vi: image.caption?.vi || "", en: event.target.value } })} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-2 text-sm" placeholder="Caption tiếng Anh" />
		</div>
	);
}
