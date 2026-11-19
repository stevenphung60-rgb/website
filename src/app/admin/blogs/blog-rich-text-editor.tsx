"use client";

import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Bold,
	ChevronDown,
	Italic,
	LinkIcon,
	Underline,
} from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "src/components/ui/button";

interface BlogRichTextEditorProps {
	fieldName: string;
	label: string;
	defaultHtml?: string;
}

type ToolbarMenu = "size" | "lineHeight" | null;
type TextAlignState = "left" | "center" | "right";

const fontSizeOptions = [
	{ label: "Nhỏ", value: "2" },
	{ label: "Chuẩn", value: "3" },
	{ label: "Lớn", value: "4" },
	{ label: "Rất lớn", value: "5" },
];

const lineHeightOptions = [
	{ label: "Mặc định", value: "default", cssValue: "" },
	{ label: "Gọn", value: "compact", cssValue: "1.55" },
	{ label: "Chuẩn", value: "standard", cssValue: "1.75" },
	{ label: "Rộng", value: "relaxed", cssValue: "2" },
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
	const savedRangeRef = useRef<Range | null>(null);
	const hasInitializedRef = useRef(false);
	const [html, setHtml] = useState(defaultHtml);
	const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
	const [activeFontSize, setActiveFontSize] = useState("3");
	const [activeLineHeight, setActiveLineHeight] = useState("default");
	const [activeAlign, setActiveAlign] = useState<TextAlignState>("left");
	const [activeMarks, setActiveMarks] = useState({
		bold: false,
		italic: false,
		underline: false,
	});

	useEffect(() => {
		if (!editorRef.current || hasInitializedRef.current) return;

		editorRef.current.innerHTML = defaultHtml;
		hasInitializedRef.current = true;
	}, [defaultHtml]);

	useEffect(() => {
		function handleSelectionChange() {
			if (!isSelectionInsideEditor()) return;
			storeSelection();
			updateToolbarState();
		}

		document.addEventListener("selectionchange", handleSelectionChange);

		return () => {
			document.removeEventListener("selectionchange", handleSelectionChange);
		};
	});

	function syncHtml() {
		setHtml(editorRef.current?.innerHTML || "");
	}

	function isSelectionInsideEditor() {
		const editor = editorRef.current;
		const selection = window.getSelection();

		if (!editor || !selection || selection.rangeCount === 0) return false;

		const anchorNode = selection.anchorNode;

		return Boolean(anchorNode && editor.contains(anchorNode));
	}

	function storeSelection() {
		const selection = window.getSelection();

		if (!selection || selection.rangeCount === 0 || !isSelectionInsideEditor()) return;

		savedRangeRef.current = selection.getRangeAt(0).cloneRange();
	}

	function restoreSelection() {
		const editor = editorRef.current;
		const savedRange = savedRangeRef.current;

		if (!editor) return;

		editor.focus();

		if (!savedRange) return;

		const selection = window.getSelection();

		selection?.removeAllRanges();
		selection?.addRange(savedRange);
	}

	function focusEditor() {
		restoreSelection();
		editorRef.current?.focus();
	}

	function runCommand(command: string, value?: string) {
		focusEditor();
		document.execCommand("styleWithCSS", false, "true");
		document.execCommand(command, false, value);
		storeSelection();
		syncHtml();
		updateToolbarState();
	}

	function addLink() {
		focusEditor();

		const href = window.prompt("Nhập URL liên kết");

		if (!href) return;

		const selection = window.getSelection();
		const selectedText = selection?.toString() || "";

		if (!selectedText) {
			const label = window.prompt("Nhập chữ hiển thị cho liên kết", href);

			if (!label) return;

			document.execCommand(
				"insertHTML",
				false,
				`<a href="${escapeAttribute(href)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`,
			);
			syncHtml();
			updateToolbarState();
			return;
		}

		runCommand("createLink", href);
	}

	function applyFontSize(fontSize: string) {
		runCommand("fontSize", fontSize);
		setActiveFontSize(fontSize);
		setOpenMenu(null);
	}

	function applyLineHeight(lineHeight: string) {
		focusEditor();

		const option =
			lineHeightOptions.find((lineHeightOption) => lineHeightOption.value === lineHeight) ||
			lineHeightOptions[0];
		const blockElement = getCurrentBlockElement();

		if (blockElement) {
			blockElement.style.lineHeight = option.cssValue;
		}

		setActiveLineHeight(lineHeight);
		setOpenMenu(null);
		storeSelection();
		syncHtml();
		updateToolbarState();
	}

	function updateToolbarState() {
		setActiveMarks({
			bold: document.queryCommandState("bold"),
			italic: document.queryCommandState("italic"),
			underline: document.queryCommandState("underline"),
		});

		if (document.queryCommandState("justifyCenter")) {
			setActiveAlign("center");
		} else if (document.queryCommandState("justifyRight")) {
			setActiveAlign("right");
		} else {
			setActiveAlign("left");
		}

		const currentFontSize = document.queryCommandValue("fontSize") || "3";
		const currentLineHeight = getCurrentLineHeight();

		setActiveFontSize(String(currentFontSize));
		setActiveLineHeight(currentLineHeight);
	}

	function getCurrentLineHeight() {
		const blockElement = getCurrentBlockElement();
		const lineHeight = blockElement?.style.lineHeight || "";

		return (
			lineHeightOptions.find((option) => option.cssValue && option.cssValue === lineHeight)?.value ||
			"default"
		);
	}

	function getCurrentBlockElement() {
		const editor = editorRef.current;
		const selection = window.getSelection();

		if (!editor || !selection || selection.rangeCount === 0) return null;

		let node: Node | null = selection.focusNode;
		let element = node instanceof HTMLElement ? node : node?.parentElement || null;

		while (element && element !== editor) {
			if (/^(P|DIV|LI|H1|H2|H3|H4|H5|H6|BLOCKQUOTE)$/i.test(element.tagName)) {
				return element;
			}

			element = element.parentElement;
		}

		return editor;
	}

	const currentFontSizeLabel =
		fontSizeOptions.find((fontSizeOption) => fontSizeOption.value === activeFontSize)?.label ||
		"Chuẩn";
	const currentLineHeightLabel =
		lineHeightOptions.find((lineHeightOption) => lineHeightOption.value === activeLineHeight)?.label ||
		"Mặc định";

	return (
		<section className="rounded-2xl border border-[#E7D0AF] bg-white shadow-sm">
			<input type="hidden" name={fieldName} value={html} />

			<div className="border-b border-[#E7D0AF]/70 px-4 py-4 sm:px-6">
				<p className="text-base font-semibold text-[#342312]">{label}</p>
				<p className="mt-1 text-sm leading-6 text-[#342312]/65">
					Nội dung dùng font chung của website (chọn ở Admin → Giao diện).
				</p>
			</div>

			<div className="space-y-4 px-4 py-5 sm:px-6">
				<div className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] p-2">
					<ToolbarSelect
						label="Cỡ chữ"
						isOpen={openMenu === "size"}
						onToggle={() => setOpenMenu((currentMenu) => (currentMenu === "size" ? null : "size"))}
						buttonContent={
							<>
								<span className="shrink-0 text-sm font-bold">A</span>
								<span className="min-w-0 truncate text-xs">{currentFontSizeLabel}</span>
								<ChevronDown className="size-3 shrink-0" />
							</>
						}
					>
						{fontSizeOptions.map((fontSizeOption) => (
							<ToolbarMenuItem
								key={fontSizeOption.value}
								isActive={activeFontSize === fontSizeOption.value}
								onClick={() => applyFontSize(fontSizeOption.value)}
							>
								{fontSizeOption.label}
							</ToolbarMenuItem>
						))}
					</ToolbarSelect>

					<ToolbarSelect
						label="Giãn dòng"
						isOpen={openMenu === "lineHeight"}
						onToggle={() =>
							setOpenMenu((currentMenu) =>
								currentMenu === "lineHeight" ? null : "lineHeight",
							)
						}
						buttonContent={
							<>
								<span className="shrink-0 text-sm font-bold">↕</span>
								<span className="min-w-0 truncate text-xs">{currentLineHeightLabel}</span>
								<ChevronDown className="size-3 shrink-0" />
							</>
						}
					>
						{lineHeightOptions.map((lineHeightOption) => (
							<ToolbarMenuItem
								key={lineHeightOption.value}
								isActive={activeLineHeight === lineHeightOption.value}
								onClick={() => applyLineHeight(lineHeightOption.value)}
							>
								{lineHeightOption.label}
							</ToolbarMenuItem>
						))}
					</ToolbarSelect>

					<ToolbarButton
						label="Đậm"
						isActive={activeMarks.bold}
						onClick={() => runCommand("bold")}
					>
						<Bold className="size-4" />
					</ToolbarButton>
					<ToolbarButton
						label="Nghiêng"
						isActive={activeMarks.italic}
						onClick={() => runCommand("italic")}
					>
						<Italic className="size-4" />
					</ToolbarButton>
					<ToolbarButton
						label="Gạch dưới"
						isActive={activeMarks.underline}
						onClick={() => runCommand("underline")}
					>
						<Underline className="size-4" />
					</ToolbarButton>
					<ToolbarButton label="Chèn link" onClick={addLink}>
						<LinkIcon className="size-4" />
					</ToolbarButton>
					<ToolbarButton
						label="Căn trái"
						isActive={activeAlign === "left"}
						onClick={() => runCommand("justifyLeft")}
					>
						<AlignLeft className="size-4" />
					</ToolbarButton>
					<ToolbarButton
						label="Căn giữa"
						isActive={activeAlign === "center"}
						onClick={() => runCommand("justifyCenter")}
					>
						<AlignCenter className="size-4" />
					</ToolbarButton>
					<ToolbarButton
						label="Căn phải"
						isActive={activeAlign === "right"}
						onClick={() => runCommand("justifyRight")}
					>
						<AlignRight className="size-4" />
					</ToolbarButton>
				</div>

				<div
					ref={editorRef}
					contentEditable
					suppressContentEditableWarning
					className="min-h-[360px] rounded-2xl border border-[#E7D0AF] bg-white px-4 py-4 text-base leading-8 text-[#342312] outline-none focus:border-[#342312] focus:ring-2 focus:ring-[#342312]/10"
					onInput={syncHtml}
					onFocus={() => {
						storeSelection();
						updateToolbarState();
					}}
					onKeyUp={() => {
						storeSelection();
						updateToolbarState();
					}}
					onMouseUp={() => {
						storeSelection();
						updateToolbarState();
					}}
				/>
			</div>
		</section>
	);
}

function escapeAttribute(value: string) {
	return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function escapeHtml(value: string) {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function ToolbarSelect({
	children,
	buttonContent,
	isOpen,
	label,
	onToggle,
}: {
	children: ReactNode;
	buttonContent: ReactNode;
	isOpen: boolean;
	label: string;
	onToggle: () => void;
}) {
	return (
		<div className="relative">
			<button
				type="button"
				title={label}
				aria-label={label}
				className="inline-flex h-9 w-[132px] items-center gap-1.5 rounded-lg border border-[#E7D0AF] bg-white px-2 text-[#342312] shadow-sm transition hover:bg-[#FAF7F1]"
				onMouseDown={(event) => event.preventDefault()}
				onClick={onToggle}
			>
				{buttonContent}
			</button>

			{isOpen ? (
				<div className="absolute left-0 top-[calc(100%+0.35rem)] z-[80] max-h-64 min-w-[12rem] overflow-y-auto rounded-xl border border-[#E7D0AF] bg-white p-1 shadow-xl">
					{children}
				</div>
			) : null}
		</div>
	);
}

function ToolbarMenuItem({
	children,
	isActive,
	onClick,
}: {
	children: ReactNode;
	isActive?: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			className={[
				"block w-full rounded-lg px-3 py-2 text-left text-sm transition",
				isActive
					? "bg-[#342312] font-semibold text-[#E7D0AF]"
					: "text-[#342312] hover:bg-[#FAF7F1]",
			].join(" ")}
			onMouseDown={(event) => event.preventDefault()}
			onClick={onClick}
		>
			{children}
		</button>
	);
}

function ToolbarButton({
	children,
	isActive = false,
	label,
	onClick,
}: {
	children: ReactNode;
	isActive?: boolean;
	label: string;
	onClick: () => void;
}) {
	return (
		<Button
			type="button"
			variant="outline"
			aria-label={label}
			title={label}
			className={[
				"h-9 w-10 border-[#E7D0AF] px-0 transition",
				isActive
					? "bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B] hover:text-[#E7D0AF]"
					: "bg-white text-[#342312] hover:bg-[#FAF7F1]",
			].join(" ")}
			onMouseDown={(event) => event.preventDefault()}
			onClick={onClick}
		>
			{children}
		</Button>
	);
}
