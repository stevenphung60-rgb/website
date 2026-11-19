"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { AdminNavigation } from "./admin-navigation";

interface AdminShellUser {
	name: string;
	email: string;
	image?: string | null;
}

interface AdminShellProps {
	children: ReactNode;
	user: AdminShellUser;
}

/**
 * Admin shell with collapsible sidebar
 * @param props - Admin shell props
 * @returns Admin layout shell
 */
export function AdminShell({ children, user }: AdminShellProps) {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	return (
		<div
			className="min-h-screen bg-[#FAF7F1] font-sans"
		>
			<AdminNavigation
				user={user}
				isCollapsed={isSidebarCollapsed}
				onToggle={() => setIsSidebarCollapsed((current) => !current)}
			/>

			<div
				className={[
					"transition-[padding-left] duration-300 ease-in-out",
					isSidebarCollapsed ? "pl-[76px]" : "pl-64",
				].join(" ")}
			>
				<main className="min-h-screen px-8 py-10">{children}</main>
			</div>
		</div>
	);
}