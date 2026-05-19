"use client";

import { ChevronsRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "src/lib/utils";

interface AdminNavigationItemProps {
	href: string;
	children: React.ReactNode;
}

export function AdminNavigationItem({ href, children }: AdminNavigationItemProps) {
	const pathname = usePathname();

	const isActive =
		href === "/admin"
			? pathname === "/admin"
			: pathname === href || pathname.startsWith(`${href}/`);

	return (
		<Link
			href={href}
			className={cn(
				"group flex h-10 items-center px-3 text-sm font-medium transition-colors duration-300",
				isActive ? "text-[#E7D0AF]" : "text-white hover:text-[#E7D0AF]",
			)}
		>
			<div className="flex min-w-0 flex-1 items-center gap-3">
				<span className="shrink-0">{Array.isArray(children) ? children[0] : null}</span>

				<span className="relative">
					{Array.isArray(children) ? children[1] : children}

					<span
						className={cn(
							"absolute left-0 -bottom-1 h-[1px] bg-[#E7D0AF] transition-all duration-300",
							isActive ? "w-full" : "w-0 group-hover:w-full",
						)}
					/>
				</span>
			</div>

			{isActive && <ChevronsRight className="size-4 shrink-0 text-[#E7D0AF]" />}
		</Link>
	);
}