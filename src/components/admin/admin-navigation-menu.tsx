"use client";

import type { LucideIcon } from "lucide-react";
import {
	Building2,
	ChevronDown,
	ChevronsRight,
	FileText,
	FolderOpen,
	Home,
	ImageIcon,
	Inbox,
	Info,
	LayoutDashboard,
	Package,
	Palette,
	Phone,
	Settings,
	Tags,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface NavigationItem {
	href: string;
	label: string;
	icon: LucideIcon;
}

interface NavigationGroup {
	label: string;
	icon: LucideIcon;
	children: NavigationItem[];
}

interface AdminNavigationMenuProps {
	isCollapsed: boolean;
	onRequestExpand: () => void;
}

const dashboardItem: NavigationItem = {
	href: "/admin",
	label: "DASHBOARD",
	icon: LayoutDashboard,
};

const contactSubmissionsItem: NavigationItem = {
	href: "/admin/contact-submissions",
	label: "KHÁCH HÀNG LIÊN HỆ",
	icon: Inbox,
};

const topLevelItems = [dashboardItem, contactSubmissionsItem];

const navigationGroups: NavigationGroup[] = [
	{
		label: "NỘI DUNG CHUNG",
		icon: Settings,
		children: [
			{
				href: "/admin/herobrand",
				label: "Logo & tên công ty",
				icon: Building2,
			},
			{
				href: "/admin/appearance",
				label: "Giao diện website",
				icon: Palette,
			},
			{
				href: "/admin/hero",
				label: "Trang chủ",
				icon: Home,
			},
			{
				href: "/admin/heroabout",
				label: "Giới thiệu",
				icon: Info,
			},
		],
	},
	{
		label: "SẢN PHẨM",
		icon: Package,
		children: [
			{
				href: "/admin/products",
				label: "Sản phẩm",
				icon: Package,
			},
			{
				href: "/admin/productcategories",
				label: "Loại sản phẩm",
				icon: Tags,
			},
		],
	},
	{
		label: "DỊCH VỤ",
		icon: Wrench,
		children: [
			{
				href: "/admin/services",
				label: "Dịch vụ",
				icon: Wrench,
			},
			{
				href: "/admin/heroservice",
				label: "Banner dịch vụ",
				icon: ImageIcon,
			},
		],
	},
	{
		label: "DỰ ÁN",
		icon: FolderOpen,
		children: [
			{
				href: "/admin/projects",
				label: "Dự án",
				icon: FolderOpen,
			},
			{
				href: "/admin/projectcategories",
				label: "Loại dự án",
				icon: Tags,
			},
			{
				href: "/admin/heroproject",
				label: "Banner dự án",
				icon: ImageIcon,
			},
		],
	},
	{
		label: "BLOG",
		icon: FileText,
		children: [
			{
				href: "/admin/blogs",
				label: "Blog",
				icon: FileText,
			},
			{
				href: "/admin/blogcategories",
				label: "Loại blog",
				icon: Tags,
			},
		],
	},
	{
		label: "LIÊN HỆ",
		icon: Phone,
		children: [
			{
				href: "/admin/contact",
				label: "Liên hệ",
				icon: Phone,
			},
			{
				href: "/admin/herocontact",
				label: "Banner liên hệ",
				icon: ImageIcon,
			},
		],
	},
];

/**
 * Check whether a sidebar route is active
 * @param pathname - Current pathname
 * @param href - Navigation item href
 * @returns Whether the route is active
 */
function isRouteActive(pathname: string, href: string): boolean {
	if (href === "/admin") {
		return pathname === "/admin";
	}

	return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Admin sidebar navigation menu
 * @param props - Admin navigation menu props
 * @returns Sidebar menu grouped by content area
 */
export function AdminNavigationMenu({ isCollapsed, onRequestExpand }: AdminNavigationMenuProps) {
	const pathname = usePathname();

	const activeGroupLabel = useMemo(() => {
		const activeGroup = navigationGroups.find((group) =>
			group.children.some((item) => isRouteActive(pathname, item.href)),
		);

		return activeGroup?.label ?? null;
	}, [pathname]);

	const [openGroupLabel, setOpenGroupLabel] = useState<string | null>(activeGroupLabel);

	useEffect(() => {
		setOpenGroupLabel(activeGroupLabel);
	}, [activeGroupLabel]);

	return (
		<nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto pr-1">
			{topLevelItems.map((item) => {
				const ItemIcon = item.icon;
				const isActive = isRouteActive(pathname, item.href);

				return (
					<Link
						key={item.href}
						href={item.href}
						title={item.label}
						aria-current={isActive ? "page" : undefined}
						className={[
							"group relative flex items-center rounded-xl py-2.5 text-[14px] font-bold leading-5 tracking-[0.01em] transition-colors duration-200",
							isCollapsed ? "justify-center px-0" : "gap-2 px-3",
							isActive ? "bg-[#342312] text-[#E7D0AF]" : "text-[#E7D0AF] hover:bg-[#2B190B]",
						].join(" ")}
					>
						{isActive && !isCollapsed ? (
							<span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#A87E3C]" />
						) : null}

						<ItemIcon className="size-4 shrink-0 text-[#A87E3C]" />

						{!isCollapsed ? (
							<>
								<span className="min-w-0 flex-1 truncate">{item.label}</span>

								{isActive ? <ChevronsRight className="size-4 shrink-0 text-[#A87E3C]" /> : null}
							</>
						) : null}
					</Link>
				);
			})}

			{navigationGroups.map((group) => {
				const GroupIcon = group.icon;
				const isGroupOpen = openGroupLabel === group.label;
				const isGroupActive = activeGroupLabel === group.label;

				return (
					<div key={group.label}>
						<button
							type="button"
							title={group.label}
							onClick={() => {
								if (isCollapsed) {
									onRequestExpand();
									setOpenGroupLabel(group.label);
									return;
								}

								setOpenGroupLabel(isGroupOpen ? null : group.label);
							}}
							className={[
								"relative flex w-full items-center rounded-xl py-2.5 text-[14px] font-bold leading-5 tracking-[0.01em] transition-colors duration-200",
								isCollapsed ? "justify-center px-0" : "justify-between px-3",
								isGroupActive || isGroupOpen
									? "bg-[#342312] text-[#E7D0AF]"
									: "text-[#E7D0AF] hover:bg-[#2B190B]",
							].join(" ")}
						>
							{isGroupActive && !isCollapsed ? (
								<span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#A87E3C]" />
							) : null}

							<span
								className={[
									"flex min-w-0 items-center",
									isCollapsed ? "justify-center" : "gap-2",
								].join(" ")}
							>
								<GroupIcon className="size-4 shrink-0 text-[#A87E3C]" />

								{!isCollapsed ? <span className="truncate">{group.label}</span> : null}
							</span>

							{!isCollapsed ? (
								<ChevronDown
									className={[
										"size-4 shrink-0 text-[#A87E3C] transition-transform duration-300",
										isGroupOpen ? "rotate-180" : "",
									].join(" ")}
								/>
							) : null}
						</button>

						{!isCollapsed ? (
							<div
								className={[
									"grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
									isGroupOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
								].join(" ")}
							>
								<div className="overflow-hidden">
									<div className="ml-4 mt-1 flex flex-col gap-1 border-l border-[#A87E3C]/25 pl-3">
										{group.children.map((item) => {
											const ItemIcon = item.icon;
											const isActive = isRouteActive(pathname, item.href);

											return (
												<Link
													key={item.href}
													href={item.href}
													onClick={() => setOpenGroupLabel(group.label)}
													className={[
														"group/child flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-[14px] leading-5 transition-colors duration-200",
														isActive
															? "bg-[#4A2E17] text-[#E7D0AF]"
															: "text-[#E7D0AF]/85 hover:bg-[#2B190B] hover:text-[#E7D0AF]",
													].join(" ")}
												>
													<span className="flex min-w-0 items-center gap-2">
														<ItemIcon
															className={[
																"size-4 shrink-0",
																isActive ? "text-[#A87E3C]" : "text-[#A87E3C]/80",
															].join(" ")}
														/>

														<span className="min-w-0 truncate">{item.label}</span>
													</span>

													{isActive ? (
														<ChevronsRight className="size-4 shrink-0 text-[#A87E3C]" />
													) : null}
												</Link>
											);
										})}
									</div>
								</div>
							</div>
						) : null}
					</div>
				);
			})}
		</nav>
	);
}
