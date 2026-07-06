import type { ReactNode } from "react";

interface AdminFormSectionProps {
	title: string;
	description?: string;
	children: ReactNode;
	actions?: ReactNode;
}

/**
 * Shared section wrapper for admin forms
 * @param props - Admin form section props
 * @returns Admin form section with title, description, optional actions, and content
 */
export function AdminFormSection({
	title,
	description,
	children,
	actions,
}: AdminFormSectionProps) {
	return (
		<section className="rounded-2xl border border-[#E7D0AF] bg-white shadow-sm">
			<div className="border-b border-[#E7D0AF]/70 px-4 py-4 sm:px-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div className="min-w-0">
						<h2 className="break-words text-base font-semibold text-[#342312]">
							{title}
						</h2>

						{description ? (
							<p className="mt-1 break-words text-sm leading-6 text-[#342312]/65">
								{description}
							</p>
						) : null}
					</div>

					{actions ? <div className="shrink-0">{actions}</div> : null}
				</div>
			</div>

			<div className="space-y-5 px-4 py-5 sm:px-6">{children}</div>
		</section>
	);
}