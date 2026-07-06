import type { ReactNode } from "react";

interface AdminStickyActionsProps {
	children: ReactNode;
	note?: string;
}

/**
 * Shared sticky action bar for long admin forms
 * @param props - Sticky action bar props
 * @returns Sticky action area for form buttons
 */
export function AdminStickyActions({ children, note }: AdminStickyActionsProps) {
	return (
		<div className="sticky bottom-0 z-20 -mx-4 border-t border-[#E7D0AF] bg-[#FAF7F1]/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
			<div className="flex flex-col gap-3 rounded-2xl border border-[#E7D0AF] bg-white px-4 py-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
				<div className="min-w-0">
					<p className="text-sm font-medium text-[#342312]">Lưu thay đổi</p>

					<p className="mt-1 text-xs leading-5 text-[#342312]/65">
						{note || "Kiểm tra lại nội dung trước khi lưu để cập nhật lên website."}
					</p>
				</div>

				<div className="flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
					{children}
				</div>
			</div>
		</div>
	);
}