"use client";

import { Home, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AdminAccountDisplayWithState } from "./admin-account-display-with-state";
import { AdminNavigationMenu } from "./admin-navigation-menu";

interface AdminNavigationUser {
	name: string;
	email: string;
	image?: string | null;
}

interface AdminNavigationProps {
	user: AdminNavigationUser;
	isCollapsed: boolean;
	onToggle: () => void;
}

/**
 * Admin sidebar navigation
 * @param props - Admin navigation props
 * @returns Admin navigation sidebar
 */
export function AdminNavigation({
	user,
	isCollapsed,
	onToggle,
}: AdminNavigationProps) {
	return (
		<aside
			className={[
				"fixed left-0 top-0 z-50 h-screen border-r border-[#A87E3C]/25 bg-[#1F1208] text-[#E7D0AF] shadow-2xl transition-[width] duration-300 ease-in-out",
				isCollapsed ? "w-[76px]" : "w-64",
			].join(" ")}
		>
			<button
				type="button"
				onClick={onToggle}
				className="absolute -right-3 top-6 z-20 flex size-7 items-center justify-center rounded-full border border-[#A87E3C]/60 bg-[#342312] text-[#E7D0AF] shadow-lg transition hover:bg-[#4A2E17]"
				aria-label={isCollapsed ? "Mở sidebar" : "Thu sidebar"}
				title={isCollapsed ? "Mở sidebar" : "Thu sidebar"}
			>
				{isCollapsed ? (
					<PanelLeftOpen className="size-4" />
				) : (
					<PanelLeftClose className="size-4" />
				)}
			</button>

			<div
				className={[
					"flex h-full flex-col py-6",
					isCollapsed ? "px-2" : "px-3",
				].join(" ")}
			>
				<div
					className={[
						"mb-6 flex items-center gap-3",
						isCollapsed ? "justify-center px-0" : "px-2",
					].join(" ")}
				>
					<Image
						src="/nghiep_hung_logo_no_bg.svg"
						alt="NH Logo"
						width={40}
						height={40}
						className="shrink-0"
					/>

					{!isCollapsed ? (
						<div className="min-w-0">
							<p className="truncate text-[16px] font-semibold leading-5 text-[#E7D0AF]">
								NH - DUCT Admin
							</p>

							<p className="mt-1 truncate text-[14px] leading-5 text-[#A87E3C]">
								Quản trị nội dung
							</p>
						</div>
					) : null}
				</div>

				<Link
					href="/"
					title="Xem website"
					className={[
						"group mb-6 inline-flex items-center rounded-xl py-2.5 text-[14px] font-semibold leading-5 text-[#E7D0AF] transition-colors hover:bg-[#342312]",
						isCollapsed ? "justify-center px-0" : "gap-2 px-3",
					].join(" ")}
				>
					<Home className="size-4 shrink-0 text-[#A87E3C]" />

					{!isCollapsed ? (
						<span className="min-w-0 truncate">Xem website</span>
					) : null}
				</Link>

				<div className="mb-4 h-px w-full bg-[#A87E3C]/25" />

				<AdminNavigationMenu
					isCollapsed={isCollapsed}
					onRequestExpand={() => {
						if (isCollapsed) {
							onToggle();
						}
					}}
				/>

				<div
					className={[
						"mt-auto border-t border-[#A87E3C]/25 pt-4",
						isCollapsed ? "flex justify-center" : "",
					].join(" ")}
				>
					<AdminAccountDisplayWithState
						user={user}
						isCollapsed={isCollapsed}
					/>
				</div>
			</div>
		</aside>
	);
}