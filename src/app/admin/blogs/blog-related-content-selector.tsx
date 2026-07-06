"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export interface RelatedContentOption {
	id: string;
	label: string;
	meta?: string;
}

interface BlogRelatedContentSelectorProps {
	products: RelatedContentOption[];
	productCategories: RelatedContentOption[];
	services: RelatedContentOption[];
	projects: RelatedContentOption[];
	projectCategories: RelatedContentOption[];
	blogPosts: RelatedContentOption[];
	defaultProductIds?: string[];
	defaultProductCategoryIds?: string[];
	defaultServiceIds?: string[];
	defaultProjectIds?: string[];
	defaultProjectCategoryIds?: string[];
	defaultBlogPostIds?: string[];
}

/**
 * Related content selector for blog posts.
 * @param props - Related content options and defaults
 * @returns Related content selector
 */
export function BlogRelatedContentSelector({
	products,
	productCategories,
	services,
	projects,
	projectCategories,
	blogPosts,
	defaultProductIds = [],
	defaultProductCategoryIds = [],
	defaultServiceIds = [],
	defaultProjectIds = [],
	defaultProjectCategoryIds = [],
	defaultBlogPostIds = [],
}: BlogRelatedContentSelectorProps) {
	return (
		<section className="rounded-2xl border border-[#E7D0AF] bg-white shadow-sm">
			<div className="border-b border-[#E7D0AF]/70 px-4 py-4 sm:px-6">
				<h2 className="text-base font-semibold text-[#342312]">Liên kết nội dung liên quan</h2>
				<p className="mt-1 text-sm leading-6 text-[#342312]/65">
					Chọn trực tiếp sản phẩm, loại sản phẩm, dịch vụ, dự án, loại dự án và blog liên quan. Không cần nhập ID thủ công.
				</p>
			</div>

			<div className="grid gap-4 px-4 py-5 lg:grid-cols-2 sm:px-6">
				<RelatedGroup fieldName="relatedProductIds" title="Sản phẩm liên quan" options={products} defaultSelectedIds={defaultProductIds} />
				<RelatedGroup fieldName="relatedProductCategoryIds" title="Loại sản phẩm liên quan" options={productCategories} defaultSelectedIds={defaultProductCategoryIds} />
				<RelatedGroup fieldName="relatedServiceIds" title="Dịch vụ liên quan" options={services} defaultSelectedIds={defaultServiceIds} />
				<RelatedGroup fieldName="relatedProjectIds" title="Dự án liên quan" options={projects} defaultSelectedIds={defaultProjectIds} />
				<RelatedGroup fieldName="relatedProjectCategoryIds" title="Loại dự án liên quan" options={projectCategories} defaultSelectedIds={defaultProjectCategoryIds} />
				<RelatedGroup fieldName="relatedBlogPostIds" title="Blog liên quan" options={blogPosts} defaultSelectedIds={defaultBlogPostIds} />
			</div>
		</section>
	);
}

function RelatedGroup({
	fieldName,
	title,
	options,
	defaultSelectedIds,
}: {
	fieldName: string;
	title: string;
	options: RelatedContentOption[];
	defaultSelectedIds: string[];
}) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelectedIds);
	const normalizedSearchTerm = searchTerm.trim().toLowerCase();
	const filteredOptions = useMemo(
		() =>
			options.filter((option) =>
				`${option.label} ${option.meta || ""}`.toLowerCase().includes(normalizedSearchTerm),
			),
		[normalizedSearchTerm, options],
	);

	function toggleSelectedId(optionId: string) {
		setSelectedIds((currentIds) =>
			currentIds.includes(optionId)
				? currentIds.filter((currentId) => currentId !== optionId)
				: [...currentIds, optionId],
		);
	}

	return (
		<div className="rounded-2xl border border-[#E7D0AF] bg-[#FAF7F1] p-4">
			<input type="hidden" name={fieldName} value={selectedIds.join(",")} />

			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="text-sm font-semibold text-[#342312]">{title}</p>
					<p className="mt-1 text-xs text-[#342312]/60">Đã chọn {selectedIds.length} mục</p>
				</div>
			</div>

			<div className="relative mt-3">
				<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#342312]/45" />
				<input
					value={searchTerm}
					onChange={(event) => setSearchTerm(event.target.value)}
					placeholder="Tìm nhanh..."
					className="w-full rounded-lg border border-[#E7D0AF] bg-white py-2 pl-9 pr-3 text-sm text-[#342312] outline-none focus:border-[#342312]"
				/>
			</div>

			<div className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">
				{filteredOptions.length > 0 ? (
					filteredOptions.map((option) => {
						const isSelected = selectedIds.includes(option.id);

						return (
							<label key={option.id} className="flex cursor-pointer items-start gap-3 rounded-lg bg-white px-3 py-2 text-sm text-[#342312] transition hover:bg-[#FFFDF8]">
								<input type="checkbox" checked={isSelected} onChange={() => toggleSelectedId(option.id)} className="mt-1" />
								<span className="min-w-0">
									<span className="block truncate font-semibold">{option.label}</span>
									{option.meta ? <span className="mt-0.5 block truncate text-xs text-[#342312]/55">{option.meta}</span> : null}
								</span>
							</label>
						);
					})
				) : (
					<div className="rounded-lg bg-white px-3 py-6 text-center text-xs text-[#342312]/55">Không có dữ liệu phù hợp.</div>
				)}
			</div>
		</div>
	);
}
