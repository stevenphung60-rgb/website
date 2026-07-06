export const SITE_APPEARANCE_ID = "site-appearance";
export const CUSTOM_FONT_PRESET_ID = "custom";

export const SITE_FONT_OPTIONS = {
	montserrat: {
		label: "Montserrat",
		cssVariable: "--font-montserrat",
		description: "Chắc, rõ, hợp tiêu đề doanh nghiệp.",
	},
	roboto: {
		label: "Roboto",
		cssVariable: "--font-roboto",
		description: "Gọn, quen thuộc, dễ đọc nội dung dài.",
	},
	openSans: {
		label: "Open Sans",
		cssVariable: "--font-open-sans",
		description: "Mềm hơn Roboto, dễ đọc và thân thiện.",
	},
	raleway: {
		label: "Raleway",
		cssVariable: "--font-raleway",
		description: "Hiện đại, mảnh, phù hợp tiêu đề kỹ thuật.",
	},
	beVietnamPro: {
		label: "Be Vietnam Pro",
		cssVariable: "--font-be-vietnam-pro",
		description: "Rất hợp tiếng Việt, chắc chắn và hiện đại.",
	},
	inter: {
		label: "Inter",
		cssVariable: "--font-inter",
		description: "Hiện đại, trung tính, dễ đọc trên giao diện số.",
	},
	notoSans: {
		label: "Noto Sans",
		cssVariable: "--font-noto-sans",
		description: "Ổn định, hỗ trợ đa ngôn ngữ tốt.",
	},
	nunitoSans: {
		label: "Nunito Sans",
		cssVariable: "--font-nunito-sans",
		description: "Bo tròn, thân thiện, dễ đọc.",
	},
	sourceSans3: {
		label: "Source Sans 3",
		cssVariable: "--font-source-sans-3",
		description: "Sạch, thoáng, phù hợp nội dung dài.",
	},
	lora: {
		label: "Lora",
		cssVariable: "--font-lora",
		description: "Serif nhẹ, có cảm giác cao cấp và trang trọng.",
	},
	merriweather: {
		label: "Merriweather",
		cssVariable: "--font-merriweather",
		description: "Serif chắc, nghiêm túc, hợp nội dung thương hiệu.",
	},
} as const;

export type SiteFontId = keyof typeof SITE_FONT_OPTIONS;

interface SiteFontPresetConfig {
	id: string;
	label: string;
	description: string;
	tone: string;
	headingFontId: SiteFontId;
	bodyFontId: SiteFontId;
	sampleHeading: string;
	sampleBody: string;
}

export const SITE_FONT_PRESETS = [
	{
		id: "current",
		label: "BỘ MẶC ĐỊNH",
		description: "Giữ đúng cảm giác website đang dùng.",
		tone: "An toàn",
		headingFontId: "montserrat",
		bodyFontId: "roboto",
		sampleHeading: "Giải pháp ống gió công nghiệp",
		sampleBody:
			"Nghiệp Hưng cung cấp giải pháp sản xuất và thi công hệ thống ống gió cho công trình công nghiệp và dân dụng.",
	},
	{
		id: "industrial-modern",
		label: "Công nghiệp hiện đại",
		description: "Rõ, chắc, hợp doanh nghiệp kỹ thuật và sản xuất.",
		tone: "Khuyên dùng",
		headingFontId: "beVietnamPro",
		bodyFontId: "inter",
		sampleHeading: "Năng lực sản xuất vượt trội",
		sampleBody:
			"Hệ thống nhà xưởng, thiết bị và đội ngũ kỹ thuật được tổ chức để đáp ứng tiến độ thi công thực tế.",
	},
	{
		id: "vietnamese-clean",
		label: "Tiếng Việt rõ nét",
		description: "Dùng Be Vietnam Pro xuyên suốt, rất ổn cho website tiếng Việt.",
		tone: "Dễ đọc",
		headingFontId: "beVietnamPro",
		bodyFontId: "beVietnamPro",
		sampleHeading: "Thi công hệ thống thông gió",
		sampleBody:
			"Từng hạng mục được kiểm soát từ bản vẽ, sản xuất, vận chuyển đến lắp đặt tại công trình.",
	},
	{
		id: "corporate-solid",
		label: "Doanh nghiệp chắc chắn",
		description: "Tiêu đề mạnh, nội dung mềm và dễ đọc hơn.",
		tone: "Chững chạc",
		headingFontId: "montserrat",
		bodyFontId: "openSans",
		sampleHeading: "Đồng hành cùng khách hàng",
		sampleBody:
			"Chúng tôi tập trung vào giải pháp phù hợp, rõ ràng trong tư vấn và ổn định trong quá trình triển khai.",
	},
	{
		id: "technical-clean",
		label: "Kỹ thuật gọn",
		description: "Hợp ngành sản xuất, cơ điện và hệ thống ống gió.",
		tone: "Kỹ thuật",
		headingFontId: "raleway",
		bodyFontId: "roboto",
		sampleHeading: "Dự án tiêu biểu",
		sampleBody:
			"Các dự án được thực hiện với tiêu chuẩn kỹ thuật rõ ràng, đáp ứng yêu cầu vận hành của từng công trình.",
	},
	{
		id: "minimal-modern",
		label: "Hiện đại tối giản",
		description: "Dùng Inter xuyên suốt, sạch và rất dễ đọc.",
		tone: "Tối giản",
		headingFontId: "inter",
		bodyFontId: "inter",
		sampleHeading: "Sản phẩm ống gió chất lượng cao",
		sampleBody:
			"Quy trình sản xuất được kiểm soát nhằm đảm bảo độ chính xác, độ bền và tính ổn định khi lắp đặt.",
	},
	{
		id: "friendly-readable",
		label: "Dễ đọc thân thiện",
		description: "Ít góc cạnh, phù hợp website có nhiều nội dung mô tả.",
		tone: "Thân thiện",
		headingFontId: "nunitoSans",
		bodyFontId: "sourceSans3",
		sampleHeading: "Dịch vụ thi công chuyên nghiệp",
		sampleBody:
			"Đội ngũ kỹ thuật triển khai theo kế hoạch rõ ràng, phối hợp chặt chẽ với tiến độ tổng thể của dự án.",
	},
	{
		id: "stable-multilingual",
		label: "Ổn định đa ngôn ngữ",
		description: "Noto Sans ổn định, an toàn cho tiếng Việt và tiếng Anh.",
		tone: "Ổn định",
		headingFontId: "notoSans",
		bodyFontId: "notoSans",
		sampleHeading: "Giá trị cốt lõi",
		sampleBody:
			"Nghiệp Hưng hướng tới sự ổn định, trách nhiệm và hiệu quả trong từng sản phẩm bàn giao.",
	},
	{
		id: "editorial-premium",
		label: "Cao cấp nhẹ",
		description: "Lora tạo điểm nhấn tiêu đề, nội dung vẫn sáng và dễ đọc.",
		tone: "Cao cấp",
		headingFontId: "lora",
		bodyFontId: "sourceSans3",
		sampleHeading: "Giải pháp đồng bộ cho công trình",
		sampleBody:
			"Nội dung được trình bày với cảm giác trang trọng hơn nhưng vẫn giữ được sự rõ ràng khi đọc.",
	},
	{
		id: "classic-serious",
		label: "Truyền thống chắc chắn",
		description: "Merriweather tạo cảm giác nghiêm túc, phù hợp thương hiệu lâu năm.",
		tone: "Truyền thống",
		headingFontId: "merriweather",
		bodyFontId: "roboto",
		sampleHeading: "Kinh nghiệm và năng lực thi công",
		sampleBody:
			"Các hạng mục được triển khai với sự phối hợp chặt chẽ giữa sản xuất, vận chuyển và lắp đặt.",
	},
	{
		id: "corporate-clean",
		label: "Corporate clean",
		description: "Gọn, chuyên nghiệp, phù hợp website doanh nghiệp hiện đại.",
		tone: "Chuyên nghiệp",
		headingFontId: "inter",
		bodyFontId: "openSans",
		sampleHeading: "Giải pháp kỹ thuật cho doanh nghiệp",
		sampleBody:
			"Thông tin được trình bày rõ ràng, dễ đọc và phù hợp với cả khách hàng Việt Nam lẫn quốc tế.",
	},
	{
		id: "content-focused",
		label: "Nội dung dài dễ đọc",
		description: "Source Sans 3 giúp các đoạn mô tả dài nhẹ mắt và thoáng hơn.",
		tone: "Nội dung",
		headingFontId: "sourceSans3",
		bodyFontId: "sourceSans3",
		sampleHeading: "Tối ưu nội dung trình bày",
		sampleBody:
			"Phù hợp các trang có nhiều đoạn giới thiệu, mô tả năng lực, quy trình và thông tin kỹ thuật chi tiết.",
	},
] as const satisfies readonly SiteFontPresetConfig[];

export type SiteFontPreset = (typeof SITE_FONT_PRESETS)[number];
export type SiteFontPresetId = SiteFontPreset["id"];
export type SiteFontPresetSelection =
	| SiteFontPresetId
	| typeof CUSTOM_FONT_PRESET_ID;

export interface SiteAppearance {
	id: typeof SITE_APPEARANCE_ID;
	fontPresetId: SiteFontPresetSelection;
	headingFontId: SiteFontId;
	bodyFontId: SiteFontId;
}

export const DEFAULT_SITE_FONT_PRESET = SITE_FONT_PRESETS[0];

export const DEFAULT_SITE_APPEARANCE: SiteAppearance = {
	id: SITE_APPEARANCE_ID,
	fontPresetId: DEFAULT_SITE_FONT_PRESET.id,
	headingFontId: DEFAULT_SITE_FONT_PRESET.headingFontId,
	bodyFontId: DEFAULT_SITE_FONT_PRESET.bodyFontId,
};

/**
 * Check whether a value is a supported site font ID
 * @param value - Value to check
 * @returns Whether value is a site font ID
 */
export function isSiteFontId(value: unknown): value is SiteFontId {
	return typeof value === "string" && value in SITE_FONT_OPTIONS;
}

/**
 * Check whether a value is a supported font preset ID
 * @param value - Value to check
 * @returns Whether value is a site font preset ID
 */
export function isSiteFontPresetId(value: unknown): value is SiteFontPresetId {
	return (
		typeof value === "string" &&
		SITE_FONT_PRESETS.some((preset) => preset.id === value)
	);
}

/**
 * Check whether a value is a supported font preset selection
 * @param value - Value to check
 * @returns Whether value is a font preset selection
 */
export function isSiteFontPresetSelection(
	value: unknown,
): value is SiteFontPresetSelection {
	return value === CUSTOM_FONT_PRESET_ID || isSiteFontPresetId(value);
}

/**
 * Get font preset by ID
 * @param presetId - Font preset ID
 * @returns Font preset or default preset
 */
export function getSiteFontPresetById(presetId: unknown): SiteFontPreset {
	if (!isSiteFontPresetId(presetId)) {
		return DEFAULT_SITE_FONT_PRESET;
	}

	return (
		SITE_FONT_PRESETS.find((preset) => preset.id === presetId) ??
		DEFAULT_SITE_FONT_PRESET
	);
}

/**
 * Get CSS variable name for a font
 * @param fontId - Site font ID
 * @returns CSS variable name
 */
export function getSiteFontCssVariable(fontId: SiteFontId): string {
	return SITE_FONT_OPTIONS[fontId].cssVariable;
}

/**
 * Get CSS font-family value for a font
 * @param fontId - Site font ID
 * @returns CSS variable font-family value
 */
export function getSiteFontFamilyValue(fontId: SiteFontId): string {
	return `var(${getSiteFontCssVariable(fontId)})`;
}

/**
 * Normalize site appearance data from database or form input
 * @param input - Partial site appearance data
 * @returns Valid site appearance data
 */
export function normalizeSiteAppearance(
	input?: Partial<SiteAppearance> | null,
): SiteAppearance {
	const fontPresetId = isSiteFontPresetSelection(input?.fontPresetId)
		? input.fontPresetId
		: DEFAULT_SITE_APPEARANCE.fontPresetId;

	if (fontPresetId !== CUSTOM_FONT_PRESET_ID) {
		const preset = getSiteFontPresetById(fontPresetId);

		return {
			id: SITE_APPEARANCE_ID,
			fontPresetId: preset.id,
			headingFontId: preset.headingFontId,
			bodyFontId: preset.bodyFontId,
		};
	}

	return {
		id: SITE_APPEARANCE_ID,
		fontPresetId,
		headingFontId: isSiteFontId(input?.headingFontId)
			? input.headingFontId
			: DEFAULT_SITE_APPEARANCE.headingFontId,
		bodyFontId: isSiteFontId(input?.bodyFontId)
			? input.bodyFontId
			: DEFAULT_SITE_APPEARANCE.bodyFontId,
	};
}