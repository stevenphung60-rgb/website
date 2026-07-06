import type { ReactNode } from "react";

interface AdminEmptyStateProps {
	icon?: ReactNode;
	title: string;
	description?: string;
	action?: ReactNode;
	children?: ReactNode;
}

/**
 * Shared empty state for admin pages
 * @param props - Admin empty state props
 * @returns Empty state block with optional icon, description, action, and children
 */
export function AdminEmptyState({
	icon,
	title,
	description,
	action,
	children,
}: AdminEmptyStateProps) {
	return (
		<div className="rounded-2xl border border-dashed border-[#E7D0AF] bg-white px-4 py-10 text-center shadow-sm sm:px-6">
			{icon ? (
				<div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#342312]/10 text-[#342312]">
					{icon}
				</div>
			) : null}

			<h2 className="font-serif text-xl font-bold text-[#342312]">{title}</h2>

			{description ? (
				<p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#342312]/70">
					{description}
				</p>
			) : null}

			{children ? <div className="mt-5">{children}</div> : null}

			{action ? <div className="mt-6 flex justify-center">{action}</div> : null}
		</div>
	);
}