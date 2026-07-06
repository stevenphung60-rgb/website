import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface AdminPageHeaderProps {
	title: string;
	description?: string;
	eyebrow?: string;
	icon?: LucideIcon;
	actions?: ReactNode;
}

/**
 * Shared header for admin pages
 * @param props - Admin page header props
 * @returns Admin page title, description, optional icon, and actions
 */
export function AdminPageHeader({
	title,
	description,
	eyebrow,
	icon: Icon,
	actions,
}: AdminPageHeaderProps) {
	return (
		<div className="mb-6 rounded-2xl border border-[#E7D0AF] bg-white px-4 py-5 shadow-sm sm:px-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex min-w-0 items-start gap-4">
					{Icon ? (
						<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#342312]/10 text-[#342312]">
							<Icon className="size-5" />
						</div>
					) : null}

					<div className="min-w-0">
						{eyebrow ? (
							<p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#A87E3C]">
								{eyebrow}
							</p>
						) : null}

						<h1 className="break-words font-serif text-2xl font-bold leading-tight text-[#342312]">
							{title}
						</h1>

						{description ? (
							<p className="mt-2 max-w-3xl break-words text-sm leading-6 text-[#342312]/70">
								{description}
							</p>
						) : null}
					</div>
				</div>

				{actions ? <div className="shrink-0">{actions}</div> : null}
			</div>
		</div>
	);
}