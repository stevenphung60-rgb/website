import Link from "next/link";
import type { ReactNode } from "react";

interface AdminListToolbarProps {
	searchName?: string;
	searchPlaceholder?: string;
	defaultSearchValue?: string;
	children?: ReactNode;
	actions?: ReactNode;
	resetHref?: string;
}

/**
 * Shared toolbar for admin list pages
 * @param props - Admin list toolbar props
 * @returns Search, filters, reset link, and optional actions for admin list pages
 */
export function AdminListToolbar({
	searchName = "q",
	searchPlaceholder = "Tìm kiếm...",
	defaultSearchValue = "",
	children,
	actions,
	resetHref,
}: AdminListToolbarProps) {
	return (
		<div className="mb-6 rounded-2xl border border-[#E7D0AF] bg-white px-4 py-4 shadow-sm sm:px-6">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<form className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(16rem,1fr)_auto_auto]">
					<div className="min-w-0">
						<label
							htmlFor={searchName}
							className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/70"
						>
							Tìm kiếm
						</label>

						<input
							id={searchName}
							name={searchName}
							defaultValue={defaultSearchValue}
							placeholder={searchPlaceholder}
							className="h-10 w-full rounded-lg border border-[#E7D0AF] bg-white px-3 text-sm text-[#342312] outline-none transition focus:border-[#342312] focus:ring-2 focus:ring-[#342312]/10"
						/>
					</div>

					{children ? (
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:contents">
							{children}
						</div>
					) : null}

					<div className="flex items-end gap-2">
						<button
							type="submit"
							className="inline-flex h-10 items-center justify-center rounded-lg bg-[#342312] px-4 text-sm font-semibold text-[#E7D0AF] transition hover:bg-[#23160B]"
						>
							Lọc
						</button>

						{resetHref ? (
							<Link
								href={resetHref}
								className="inline-flex h-10 items-center justify-center rounded-lg border border-[#E7D0AF] bg-white px-4 text-sm font-semibold text-[#342312] transition hover:bg-[#FAF7F1]"
							>
								Xóa lọc
							</Link>
						) : null}
					</div>
				</form>

				{actions ? <div className="shrink-0">{actions}</div> : null}
			</div>
		</div>
	);
}