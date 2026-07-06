"use client";

import { Check, Palette, RotateCcw, Save } from "lucide-react";
import { useMemo, useState } from "react";
import {
	Form,
	FormErrorDisplay,
	FormPendingMessage,
	FormSubmitMessage,
} from "src/components/form-state";
import { Button } from "src/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "src/components/ui/card";
import {
	CUSTOM_FONT_PRESET_ID,
	getSiteFontFamilyValue,
	getSiteFontPresetById,
	SITE_FONT_OPTIONS,
	SITE_FONT_PRESETS,
	type SiteAppearance,
	type SiteFontId,
	type SiteFontPreset,
	type SiteFontPresetSelection,
} from "src/lib/font-presets";
import { updateSiteAppearanceAction } from "./appearance.actions";

interface AppearanceFormProps {
	appearance: SiteAppearance;
}

interface FontPreviewProps {
	headingFontId: SiteFontId;
	bodyFontId: SiteFontId;
	selectedPreset: SiteFontPreset | null;
}

interface PresetRowProps {
	preset: SiteFontPreset;
	isSelected: boolean;
	onSelect: () => void;
}

/**
 * Site appearance form
 * @param props - Appearance form props
 * @returns Appearance settings form
 */
export function AppearanceForm({ appearance }: AppearanceFormProps) {
	const [selectedPresetId, setSelectedPresetId] =
		useState<SiteFontPresetSelection>(appearance.fontPresetId);
	const [headingFontId, setHeadingFontId] = useState<SiteFontId>(
		appearance.headingFontId,
	);
	const [bodyFontId, setBodyFontId] = useState<SiteFontId>(
		appearance.bodyFontId,
	);

	const effectiveFonts = useMemo(() => {
		if (selectedPresetId === CUSTOM_FONT_PRESET_ID) {
			return {
				headingFontId,
				bodyFontId,
			};
		}

		const preset = getSiteFontPresetById(selectedPresetId);

		return {
			headingFontId: preset.headingFontId,
			bodyFontId: preset.bodyFontId,
		};
	}, [selectedPresetId, headingFontId, bodyFontId]);

	const selectedPreset =
		selectedPresetId === CUSTOM_FONT_PRESET_ID
			? null
			: getSiteFontPresetById(selectedPresetId);

	const fontOptions = Object.entries(SITE_FONT_OPTIONS) as [
		SiteFontId,
		(typeof SITE_FONT_OPTIONS)[SiteFontId],
	][];

	const selectPreset = (preset: SiteFontPreset) => {
		setSelectedPresetId(preset.id);
		setHeadingFontId(preset.headingFontId);
		setBodyFontId(preset.bodyFontId);
	};

	const setCustomHeadingFont = (fontId: SiteFontId) => {
		setSelectedPresetId(CUSTOM_FONT_PRESET_ID);
		setHeadingFontId(fontId);
	};

	const setCustomBodyFont = (fontId: SiteFontId) => {
		setSelectedPresetId(CUSTOM_FONT_PRESET_ID);
		setBodyFontId(fontId);
	};

	const resetToDefault = () => {
		const defaultPreset = SITE_FONT_PRESETS[0];
		selectPreset(defaultPreset);
	};

	return (
		<Form action={updateSiteAppearanceAction}>
			<input type="hidden" name="fontPresetId" value={selectedPresetId} />
			<input
				type="hidden"
				name="headingFontId"
				value={effectiveFonts.headingFontId}
			/>
			<input type="hidden" name="bodyFontId" value={effectiveFonts.bodyFontId} />

			<div className="mb-6 rounded-2xl border border-[#E7D0AF] bg-white p-4 shadow-sm">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<p className="text-sm font-semibold text-[#342312]">
							Cấu hình đang chọn
						</p>

						<p className="mt-1 text-xs leading-5 text-[#342312]/65">
							Tiêu đề:{" "}
							<span className="font-semibold text-[#342312]">
								{SITE_FONT_OPTIONS[effectiveFonts.headingFontId].label}
							</span>
							{" · "}
							Nội dung:{" "}
							<span className="font-semibold text-[#342312]">
								{SITE_FONT_OPTIONS[effectiveFonts.bodyFontId].label}
							</span>
							{selectedPreset ? (
								<>
									{" · "}
									Bộ font:{" "}
									<span className="font-semibold text-[#342312]">
										{selectedPreset.label}
									</span>
								</>
							) : (
								<>
									{" · "}
									<span className="font-semibold text-[#A87E3C]">
										Tùy chỉnh trực tiếp
									</span>
								</>
							)}
						</p>
					</div>

					<Button
						type="submit"
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
				<div className="space-y-6">
					<Card className="border-[#A87E3C]/45 bg-white shadow-sm">
						<CardHeader className="border-b border-[#E7D0AF]/70">
							<div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
								<div>
									<CardTitle className="flex items-center gap-2 font-serif text-2xl text-[#342312]">
										<Palette className="size-5 text-[#A87E3C]" />
										<span>Thiết lập font website</span>
									</CardTitle>

									<CardDescription className="mt-2 text-[#342312]/65">
										Chọn font tiêu đề và font nội dung. Đây là phần chính quyết định cảm giác chữ trên website.
									</CardDescription>
								</div>

								<div className="w-fit rounded-full border border-[#A87E3C]/35 bg-[#FAF7F1] px-3 py-1 text-xs font-semibold text-[#A87E3C]">
									Chỉnh trực tiếp
								</div>
							</div>
						</CardHeader>

						<CardContent className="space-y-5 px-5 py-6">
							<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
								<div className="rounded-2xl border border-[#E7D0AF] bg-[#FAF7F1] p-4">
									<label
										htmlFor="headingFont"
										className="text-sm font-semibold text-[#342312]"
									>
										Font tiêu đề
									</label>

									<select
										id="headingFont"
										value={effectiveFonts.headingFontId}
										onChange={(event) =>
											setCustomHeadingFont(event.target.value as SiteFontId)
										}
										className="mt-2 flex h-10 w-full rounded-lg border border-[#E7D0AF] bg-white px-3 py-2 text-sm text-[#342312] shadow-sm outline-none transition focus:border-[#342312] focus:ring-2 focus:ring-[#342312]/10"
									>
										{fontOptions.map(([fontId, font]) => (
											<option key={fontId} value={fontId}>
												{font.label}
											</option>
										))}
									</select>

									<div className="mt-4 rounded-xl border border-[#E7D0AF] bg-white p-4">
										<p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A87E3C]">
											Mẫu tiêu đề
										</p>

										<p
											className="mt-2 text-2xl font-bold leading-tight text-[#342312]"
											style={{
												fontFamily: getSiteFontFamilyValue(
													effectiveFonts.headingFontId,
												),
											}}
										>
											Giải pháp ống gió công nghiệp
										</p>

										<p
											className="mt-2 text-sm font-semibold text-[#342312]/70"
											style={{
												fontFamily: getSiteFontFamilyValue(
													effectiveFonts.headingFontId,
												),
											}}
										>
											TDF001 · +680,000 · 3,000 m²/ngày
										</p>
									</div>

									<p className="mt-3 text-xs italic leading-5 text-[#342312]/60">
										Dùng cho tiêu đề trang, tiêu đề section, tên sản phẩm, tên dịch vụ và tên dự án.
									</p>
								</div>

								<div className="rounded-2xl border border-[#E7D0AF] bg-[#FAF7F1] p-4">
									<label
										htmlFor="bodyFont"
										className="text-sm font-semibold text-[#342312]"
									>
										Font nội dung
									</label>

									<select
										id="bodyFont"
										value={effectiveFonts.bodyFontId}
										onChange={(event) =>
											setCustomBodyFont(event.target.value as SiteFontId)
										}
										className="mt-2 flex h-10 w-full rounded-lg border border-[#E7D0AF] bg-white px-3 py-2 text-sm text-[#342312] shadow-sm outline-none transition focus:border-[#342312] focus:ring-2 focus:ring-[#342312]/10"
									>
										{fontOptions.map(([fontId, font]) => (
											<option key={fontId} value={fontId}>
												{font.label}
											</option>
										))}
									</select>

									<div className="mt-4 rounded-xl border border-[#E7D0AF] bg-white p-4">
										<p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A87E3C]">
											Mẫu nội dung
										</p>

										<p
											className="mt-2 text-sm leading-7 text-[#342312]/75"
											style={{
												fontFamily: getSiteFontFamilyValue(
													effectiveFonts.bodyFontId,
												),
											}}
										>
											Nghiệp Hưng cung cấp giải pháp sản xuất và thi công hệ thống ống gió cho công trình công nghiệp và dân dụng.
										</p>

										<p
											className="mt-2 text-xs leading-5 text-[#342312]/65"
											style={{
												fontFamily: getSiteFontFamilyValue(
													effectiveFonts.bodyFontId,
												),
											}}
										>
											Ngày cập nhật: 07/05/2026 · Hotline: 0901 234 567 · Mã: CLEAT001
										</p>
									</div>

									<p className="mt-3 text-xs italic leading-5 text-[#342312]/60">
										Dùng cho đoạn văn, mô tả sản phẩm, thông tin liên hệ, footer và nội dung dài.
									</p>
								</div>
							</div>

							<div className="flex flex-col gap-3 rounded-2xl border border-[#E7D0AF] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
								<div>
									<p className="text-sm font-semibold text-[#342312]">
										Muốn quay lại font ban đầu?
									</p>

									<p className="mt-1 text-xs leading-5 text-[#342312]/65">
										Mặc định hiện tại là Montserrat cho tiêu đề và Roboto cho nội dung.
									</p>
								</div>

								<Button
									type="button"
									variant="outline"
									onClick={resetToDefault}
									className="border-[#E7D0AF] bg-white text-[#342312] hover:bg-[#FAF7F1]"
								>
									<RotateCcw className="mr-2 size-4" />
									Về mặc định
								</Button>
							</div>
						</CardContent>
					</Card>

					<Card className="border-[#E7D0AF] bg-white shadow-sm">
						<CardHeader className="border-b border-[#E7D0AF]/70">
							<CardTitle className="font-serif text-xl text-[#342312]">
								Danh sách bộ font tiêu chuẩn
							</CardTitle>

							<CardDescription className="text-[#342312]/65">
								Chọn nhanh một bộ font phổ biến cho website tiếng Việt và tiếng Anh.
							</CardDescription>
						</CardHeader>

						<CardContent className="p-0">
							<div className="hidden border-b border-[#E7D0AF]/70 bg-[#FAF7F1] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/65 lg:grid lg:grid-cols-[2rem_minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1.1fr)] lg:gap-4">
								<div />
								<div>Bộ font</div>
								<div>Tiêu đề</div>
								<div>Nội dung</div>
								<div>Phù hợp</div>
							</div>

							<div className="divide-y divide-[#E7D0AF]/70">
								{SITE_FONT_PRESETS.map((preset) => (
									<PresetRow
										key={preset.id}
										preset={preset}
										isSelected={selectedPresetId === preset.id}
										onSelect={() => selectPreset(preset)}
									/>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="xl:sticky xl:top-8 xl:self-start">
					<FontPreview
						headingFontId={effectiveFonts.headingFontId}
						bodyFontId={effectiveFonts.bodyFontId}
						selectedPreset={selectedPreset}
					/>
				</div>
			</div>
		</Form>
	);
}

/**
 * Preset row
 * @param props - Preset row props
 * @returns Preset row
 */
function PresetRow({ preset, isSelected, onSelect }: PresetRowProps) {
	return (
		<button
			type="button"
			onClick={onSelect}
			className={[
				"grid w-full grid-cols-1 gap-3 px-5 py-4 text-left transition hover:bg-[#FAF7F1] lg:grid-cols-[2rem_minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1.1fr)] lg:items-center lg:gap-4",
				isSelected ? "bg-[#FAF7F1]" : "bg-white",
			].join(" ")}
		>
			<div className="flex items-center gap-3 lg:block">
				<div
					className={[
						"flex size-7 shrink-0 items-center justify-center rounded-full border",
						isSelected
							? "border-[#A87E3C] bg-[#A87E3C] text-white"
							: "border-[#E7D0AF] bg-white text-transparent",
					].join(" ")}
				>
					<Check className="size-4" />
				</div>

				<div className="lg:hidden">
					<p className="text-sm font-semibold text-[#342312]">{preset.label}</p>

					<p className="mt-1 text-xs font-medium text-[#A87E3C]">
						{preset.tone}
					</p>
				</div>
			</div>

			<div className="hidden min-w-0 lg:block">
				<p className="truncate text-sm font-semibold text-[#342312]">
					{preset.label}
				</p>

				<p className="mt-1 text-xs font-medium text-[#A87E3C]">
					{preset.tone}
				</p>
			</div>

			<div className="min-w-0">
				<p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/50 lg:hidden">
					Tiêu đề
				</p>

				<p className="truncate text-sm text-[#342312]/75">
					{SITE_FONT_OPTIONS[preset.headingFontId].label}
				</p>
			</div>

			<div className="min-w-0">
				<p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/50 lg:hidden">
					Nội dung
				</p>

				<p className="truncate text-sm text-[#342312]/75">
					{SITE_FONT_OPTIONS[preset.bodyFontId].label}
				</p>
			</div>

			<div className="min-w-0">
				<p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/50 lg:hidden">
					Phù hợp
				</p>

				<p className="line-clamp-2 text-xs leading-5 text-[#342312]/60">
					{preset.description}
				</p>
			</div>
		</button>
	);
}

/**
 * Live font preview card
 * @param props - Font preview props
 * @returns Font preview
 */
function FontPreview({
	headingFontId,
	bodyFontId,
	selectedPreset,
}: FontPreviewProps) {
	const headingFont = SITE_FONT_OPTIONS[headingFontId];
	const bodyFont = SITE_FONT_OPTIONS[bodyFontId];

	return (
		<Card className="border-[#E7D0AF] bg-white shadow-sm">
			<CardHeader className="border-b border-[#E7D0AF]/70">
				<CardTitle className="font-serif text-xl text-[#342312]">
					Xem trước
				</CardTitle>

				<CardDescription className="text-[#342312]/65">
					{selectedPreset
						? `Đang chọn: ${selectedPreset.label}`
						: "Đang tùy chỉnh trực tiếp"}
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4 px-5 py-6">
				<div className="rounded-2xl border border-[#E7D0AF] bg-[#FAF7F1] p-5">
					<p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A87E3C]">
						Font tiêu đề · {headingFont.label}
					</p>

					<h3
						className="mt-3 text-3xl font-bold leading-tight text-[#342312]"
						style={{ fontFamily: getSiteFontFamilyValue(headingFontId) }}
					>
						Giải pháp ống gió công nghiệp
					</h3>

					<p
						className="mt-3 text-lg font-bold text-[#342312]"
						style={{ fontFamily: getSiteFontFamilyValue(headingFontId) }}
					>
						+680,000 m² · 3,000 m²/ngày
					</p>
				</div>

				<div className="rounded-2xl border border-[#E7D0AF] bg-white p-5">
					<p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A87E3C]">
						Font nội dung · {bodyFont.label}
					</p>

					<p
						className="mt-3 text-sm leading-7 text-[#342312]/75"
						style={{ fontFamily: getSiteFontFamilyValue(bodyFontId) }}
					>
						Nghiệp Hưng cung cấp giải pháp sản xuất và thi công hệ thống ống gió
						cho các công trình công nghiệp và dân dụng. Nội dung cần dễ đọc,
						rõ ràng và ổn định trên cả tiếng Việt lẫn tiếng Anh.
					</p>

					<div
						className="mt-4 rounded-xl bg-[#FAF7F1] px-4 py-3 text-sm leading-6 text-[#342312]/75"
						style={{ fontFamily: getSiteFontFamilyValue(bodyFontId) }}
					>
						<p>0123456789</p>
						<p>Ngày cập nhật: 07/05/2026</p>
						<p>Mã sản phẩm: TDF001 · CLEAT001 · SPIRAL001</p>
						<p>Hotline: 0901 234 567</p>
					</div>
				</div>

				<div className="rounded-2xl border border-[#E7D0AF] bg-white p-5">
					<h4
						className="text-xl font-bold text-[#342312]"
						style={{ fontFamily: getSiteFontFamilyValue(headingFontId) }}
					>
						Sản phẩm nổi bật
					</h4>

					<p
						className="mt-2 text-sm leading-6 text-[#342312]/70"
						style={{ fontFamily: getSiteFontFamilyValue(bodyFontId) }}
					>
						Các dòng sản phẩm được thiết kế để đáp ứng yêu cầu kỹ thuật, độ bền
						và tiến độ thi công thực tế.
					</p>

					<div className="mt-4 rounded-xl bg-[#342312] px-4 py-3">
						<p
							className="text-sm font-semibold text-[#E7D0AF]"
							style={{ fontFamily: getSiteFontFamilyValue(bodyFontId) }}
						>
							Xem thêm sản phẩm
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}