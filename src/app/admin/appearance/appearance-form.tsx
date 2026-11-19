"use client";

import { Check, Palette, Save } from "lucide-react";
import { useState } from "react";
import {
	Form,
	FormErrorDisplay,
	FormPendingMessage,
	FormSubmitMessage,
} from "src/components/form-state";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import {
	getSiteFontFamilyValue,
	getSiteFontsByGroup,
	SITE_FONT_OPTIONS,
	type SiteAppearance,
	type SiteFontId,
} from "src/lib/font-presets";
import { updateSiteAppearanceAction } from "./appearance.actions";

interface AppearanceFormProps {
	appearance: SiteAppearance;
}

const SAMPLE_HEADING = "Giải pháp ống gió công nghiệp";
const SAMPLE_LINE = "Ống gió vuông 600 × 400 mm · EI30 · #TDF001 · +680.000";

/**
 * Site font form: one font is applied to the whole website at a time
 * @param props - Appearance form props
 * @returns Appearance settings form
 */
export function AppearanceForm({ appearance }: AppearanceFormProps) {
	const [fontId, setFontId] = useState<SiteFontId>(appearance.fontId);
	const savedFont = SITE_FONT_OPTIONS[appearance.fontId];
	const selectedFont = SITE_FONT_OPTIONS[fontId];
	const hasChanges = fontId !== appearance.fontId;

	return (
		<Form action={updateSiteAppearanceAction}>
			<input type="hidden" name="fontId" value={fontId} />

			<div className="mb-6 rounded-2xl border border-[#E7D0AF] bg-white p-4 shadow-sm">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<p className="text-sm font-semibold text-[#342312]">
							Font đang áp dụng cho toàn website:{" "}
							<span className="text-[#A87E3C]">{savedFont.label}</span>
						</p>

						<p className="mt-1 text-xs leading-5 text-[#342312]/65">
							{hasChanges
								? `Đã chọn ${selectedFont.label}. Bấm "Lưu thay đổi" để áp dụng.`
								: 'Chọn một font bên dưới rồi bấm "Lưu thay đổi". Tiêu đề, nội dung, blog và trang admin đều dùng font này.'}
						</p>
					</div>

					<Button
						type="submit"
						disabled={!hasChanges}
						className="bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B]"
					>
						<FormSubmitMessage>
							<Save className="mr-2 size-4" />
							Lưu thay đổi
						</FormSubmitMessage>

						<FormPendingMessage>
							<Save className="mr-2 size-4" />
							Đang lưu...
						</FormPendingMessage>
					</Button>
				</div>

				<FormErrorDisplay />
			</div>

			<div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
				<Card className="border-[#E7D0AF] bg-white shadow-sm">
					<CardHeader className="border-b border-[#E7D0AF]/70">
						<CardTitle className="flex items-center gap-2 text-2xl text-[#342312]">
							<Palette className="size-5 text-[#A87E3C]" />
							<span>Chọn font website</span>
						</CardTitle>

						<CardDescription className="text-[#342312]/65">
							Mỗi dòng hiển thị chữ mẫu bằng chính font đó.
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6 px-0 py-4">
						{getSiteFontsByGroup().map(({ group, label, fonts }) => (
							<div key={group}>
								<p className="px-5 pb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#A87E3C]">
									{label}
								</p>

								<div className="divide-y divide-[#E7D0AF]/70 border-y border-[#E7D0AF]/70">
									{fonts.map((font) => (
										<FontRow
											key={font.id}
											fontId={font.id}
											label={font.label}
											isSelected={fontId === font.id}
											isSaved={appearance.fontId === font.id}
											onSelect={() => setFontId(font.id)}
										/>
									))}
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				<div className="xl:sticky xl:top-8 xl:self-start">
					<FontPreview fontId={fontId} />
				</div>
			</div>
		</Form>
	);
}

interface FontRowProps {
	fontId: SiteFontId;
	label: string;
	isSelected: boolean;
	isSaved: boolean;
	onSelect: () => void;
}

/**
 * One selectable font, with sample text rendered in that font
 * @param props - Font row props
 * @returns Font row button
 */
function FontRow({ fontId, label, isSelected, isSaved, onSelect }: FontRowProps) {
	const fontFamily = getSiteFontFamilyValue(fontId);

	return (
		<button
			type="button"
			onClick={onSelect}
			aria-pressed={isSelected}
			className={[
				"flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-[#FAF7F1] focus-visible:outline-2 focus-visible:outline-[#A87E3C]",
				isSelected ? "bg-[#FAF7F1]" : "bg-white",
			].join(" ")}
		>
			<span
				className={[
					"mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border",
					isSelected
						? "border-[#A87E3C] bg-[#A87E3C] text-white"
						: "border-[#E7D0AF] bg-white text-transparent",
				].join(" ")}
			>
				<Check className="size-3.5" />
			</span>

			<span className="min-w-0 flex-1">
				<span className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-[#342312]">
					{label}
					{isSaved ? <span className="text-xs font-medium text-[#A87E3C]">Đang dùng</span> : null}
				</span>

				<span
					className="mt-1 block text-2xl font-bold leading-tight text-[#342312] [overflow-wrap:anywhere]"
					style={{ fontFamily }}
				>
					{SAMPLE_HEADING}
				</span>

				<span
					className="mt-1 block text-sm text-[#342312]/70 [overflow-wrap:anywhere]"
					style={{ fontFamily }}
				>
					{SAMPLE_LINE}
				</span>
			</span>
		</button>
	);
}

/**
 * Live preview of the selected font on typical website content
 * @param props - Font preview props
 * @returns Font preview card
 */
function FontPreview({ fontId }: { fontId: SiteFontId }) {
	const fontFamily = getSiteFontFamilyValue(fontId);

	return (
		<Card className="border-[#E7D0AF] bg-white shadow-sm">
			<CardHeader className="border-b border-[#E7D0AF]/70">
				<CardTitle className="text-xl text-[#342312]">Xem trước</CardTitle>

				<CardDescription className="text-[#342312]/65">
					{SITE_FONT_OPTIONS[fontId].label}
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4 px-5 py-6" style={{ fontFamily }}>
				<div className="rounded-2xl border border-[#E7D0AF] bg-[#FAF7F1] p-5">
					<p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A87E3C]">
						Tiêu đề
					</p>

					<h3 className="mt-3 text-3xl font-bold leading-tight text-[#342312]">{SAMPLE_HEADING}</h3>
				</div>

				<div className="rounded-2xl border border-[#E7D0AF] bg-white p-5">
					<p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A87E3C]">
						Nội dung
					</p>

					<p className="mt-3 text-sm leading-7 text-[#342312]/75">
						Công ty TNHH Nghiệp Hưng chuyên sản xuất và thi công hệ thống ống gió, phụ kiện thông
						gió cho nhà xưởng, tòa nhà và công trình dân dụng.
					</p>

					<div className="mt-4 rounded-xl bg-[#FAF7F1] px-4 py-3 text-sm leading-6 text-[#342312]/75">
						<p>Mã sản phẩm: TDF001 · CLEAT001 · SPIRAL001</p>
						<p>Giá: +680.000 đ · 3.000 m²/ngày</p>
						<p>Hotline: 0901 234 567</p>
					</div>
				</div>

				<div className="rounded-2xl border border-[#E7D0AF] bg-white p-5">
					<h4 className="text-xl font-bold text-[#342312]">Sản phẩm nổi bật</h4>

					<p className="mt-2 text-sm leading-6 text-[#342312]/70">
						Các dòng sản phẩm đáp ứng yêu cầu kỹ thuật, độ bền và tiến độ thi công thực tế.
					</p>

					<div className="mt-4 rounded-xl bg-[#342312] px-4 py-3">
						<p className="text-sm font-semibold text-[#E7D0AF]">Xem thêm sản phẩm</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
