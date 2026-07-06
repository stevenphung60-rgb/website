"use client";

import { Bold, Italic, LinkIcon, List, ListOrdered, Underline } from "lucide-react";
import { type ReactNode, useMemo, useRef, useState } from "react";
import { SITE_FONT_OPTIONS, type SiteFontId } from "src/lib/font-presets";
import { Button } from "src/components/ui/button";

interface BlogRichTextEditorProps {
	fieldName: string;
	label: string;
	defaultHtml?: string;
}

const fontSizeOptions = [
	{ label: "Nhỏ", value: "2" },
	{ label: "Chuẩn", value: "3" },
	{ label: "Lớn", value: "4" },
	{ label: "Rất lớn", value: "5" },
];

/**
 * Lightweight controlled rich text editor for blog HTML content.
 * @param props - Blog rich text editor props
 * @returns Rich text editor with hidden form input
 */
export function BlogRichTextEditor({
	fieldName,
	label,
	defaultHtml = "",
}: BlogRichTextEditorProps) {
	const editorRef = useRef<HTMLDivElement>(null);
	const [html, setHtml] = useState(defaultHtml);
	const fontOptions = useMemo(
		() => Object.entries(SITE_FONT_OPTIONS) as [SiteFontId, (typeof SITE_FONT_OPTIONS)[SiteFontId]][],
		[],
	);

	function focusEditor() {
		editorRef.current?.focus();
	}

	function runCommand(command: string, value?: string) {
		focusEditor();
		document.execCommand("styleWithCSS", false, "true");
		document.execCommand(command, false, value);
		setHtml(editorRef.current?.innerHTML || "");
	}

	function addLink() {
		const href = window.prompt("Nhập URL liên kết");

		if (!href) return;

		runCommand("createLink", href);
	}

	return (
		<section className="rounded-2xl border border-[#E7D0AF] bg-white shadow-sm">
			<input type="hidden" name={fieldName} value={html} />

			<div className="border-b border-[#E7D0AF]/70 px-4 py-4 sm:px-6">
				<p className="text-base font-semibold text-[#342312]">{label}</p>
				<p className="mt-1 text-sm leading-6 text-[#342312]/65">
					Chọn font, cỡ chữ, in đậm, nghiêng, gạch dưới, danh sách và chèn link trực tiếp trong nội dung.
				</p>
			</div>

			<div className="space-y-4 px-4 py-5 sm:px-6">
				<div className="flex flex-wrap gap-2 rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] p-2">
					<select
						aria-label="Font chữ"
						defaultValue=""
						onChange={(event) => {
							if (!event.target.value) return;
							runCommand("fontName", event.target.value);
							event.target.value = "";
						}}
						className="h-9 rounded-lg border border-[#E7D0AF] bg-white px-3 text-sm text-[#342312]"
					>
						<option value="">Font chữ</option>
						{fontOptions.map(([fontId, font]) => (
							<option key={fontId} value={font.label}>
								{font.label}
							</option>
						))}
					</select>

					<select
						aria-label="Cỡ chữ"
						defaultValue=""
						onChange={(event) => {
							if (!event.target.value) return;
							runCommand("fontSize", event.target.value);
							event.target.value = "";
						}}
						className="h-9 rounded-lg border border-[#E7D0AF] bg-white px-3 text-sm text-[#342312]"
					>
						<option value="">Cỡ chữ</option>
						{fontSizeOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>

					<ToolbarButton label="Đậm" onClick={() => runCommand("bold")}>
						<Bold className="size-4" />
					</ToolbarButton>
					<ToolbarButton label="Nghiêng" onClick={() => runCommand("italic")}>
						<Italic className="size-4" />
					</ToolbarButton>
					<ToolbarButton label="Gạch dưới" onClick={() => runCommand("underline")}>
						<Underline className="size-4" />
					</ToolbarButton>
					<ToolbarButton label="Link" onClick={addLink}>
						<LinkIcon className="size-4" />
					</ToolbarButton>
					<ToolbarButton label="Bullet" onClick={() => runCommand("insertUnorderedList")}>
						<List className="size-4" />
					</ToolbarButton>
					<ToolbarButton label="Đánh số" onClick={() => runCommand("insertOrderedList")}>
						<ListOrdered className="size-4" />
					</ToolbarButton>

					<Button type="button" variant="outline" className="h-9 border-[#E7D0AF] bg-white px-3 text-xs" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("formatBlock", "h2")}>
						H2
					</Button>
					<Button type="button" variant="outline" className="h-9 border-[#E7D0AF] bg-white px-3 text-xs" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("formatBlock", "h3")}>
						H3
					</Button>
					<Button type="button" variant="outline" className="h-9 border-[#E7D0AF] bg-white px-3 text-xs" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("formatBlock", "p")}>
						Đoạn
					</Button>
				</div>

				<div
					ref={editorRef}
					contentEditable
					suppressContentEditableWarning
					className="min-h-[360px] rounded-2xl border border-[#E7D0AF] bg-white px-4 py-4 text-base leading-8 text-[#342312] outline-none focus:border-[#342312] focus:ring-2 focus:ring-[#342312]/10"
					dangerouslySetInnerHTML={{ __html: defaultHtml }}
					onInput={() => setHtml(editorRef.current?.innerHTML || "")}
				/>
			</div>
		</section>
	);
}

function ToolbarButton({
	children,
	label,
	onClick,
}: {
	children: ReactNode;
	label: string;
	onClick: () => void;
}) {
	return (
		<Button
			type="button"
			variant="outline"
			aria-label={label}
			className="h-9 border-[#E7D0AF] bg-white px-3 text-[#342312]"
			onMouseDown={(event) => event.preventDefault()}
			onClick={onClick}
		>
			{children}
		</Button>
	);
}
