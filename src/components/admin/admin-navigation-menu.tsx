"use client";

import type { LucideIcon } from "lucide-react";
import {
	ChevronDown,
	ChevronsRight,
	FolderOpen,
	ImageIcon,
	Package,
	Phone,
	Shield,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationItem = {
	href: string;
	label: string;
	icon: LucideIcon;
};

type NavigationGroup = {
	label: string;
	icon: LucideIcon;
	children: NavigationItem[];
};

export function AdminNavigationMenu() {
	const pathname = usePathname();

	const dashboardItem: NavigationItem = {
		href: "/admin",
		label: "DASHBOARD",
		icon: Shield,
	};

	const navigationGroups: NavigationGroup[] = [
		{
			label: "HEADER",
			icon: ImageIcon,
			children: [
				{ href: "/admin/herobrand", label: "LOGO and COMPANY NAME", icon: ImageIcon },
			],
		},
		{
			label: "HOME PAGE",
			icon: ImageIcon,
			children: [
				{ href: "/admin/hero", label: "HOME", icon: ImageIcon },
			],
		},
		{
			label: "ABOUT US",
			icon: ImageIcon,
			children: [
				{ href: "/admin/heroabout", label: "ABOUT US", icon: ImageIcon },
			],
		},
		{
			label: "PRODUCTS",
			icon: Package,
			children: [
				{ href: "/admin/products", label: "PRODUCTS", icon: Package },
				{
					href: "/admin/productcategories",
					label: "PRODUCT CATEGORIES",
					icon: Package,
				},
			],
		},
		{
			label: "SERVICES",
			icon: Wrench,
			children: [
				{ href: "/admin/services", label: "SERVICES", icon: Wrench },
				{
					href: "/admin/heroservice",
					label: "SERVICES BANNER",
					icon: Wrench,
				},
			],
		},
		{
			label: "PROJECTS",
			icon: FolderOpen,
			children: [
				{ href: "/admin/projects", label: "PROJECTS", icon: FolderOpen },
				{
					href: "/admin/projectcategories",
					label: "PROJECT CATEGORIES",
					icon: FolderOpen,
				},
				{
					href: "/admin/heroproject",
					label: "PROJECT BANNER",
					icon: FolderOpen,
				},
			],
		},
		{
			label: "CONTACT",
			icon: Phone,
			children: [
				{ href: "/admin/contact", label: "CONTACT", icon: Phone },
				{
					href: "/admin/herocontact",
					label: "CONTACT BANNER",
					icon: Phone,
				},
			],
		},
	];

	const DashboardIcon = dashboardItem.icon;
	const isDashboardActive = pathname === dashboardItem.href;

	return (
		<>
			<style>
				{`
					details:not([open]) > .admin-submenu {
						display: grid;
					}

					summary::-webkit-details-marker {
						display: none;
					}
				`}
			</style>

			<nav className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
				<Link
					href={dashboardItem.href}
					className={[
						"group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-300",
						isDashboardActive
							? "text-[#E7D0AF]"
							: "text-white hover:text-[#E7D0AF]",
					].join(" ")}
				>
					<DashboardIcon className="size-4 shrink-0" />

					<span className="relative">
						{dashboardItem.label}

						<span
							className={[
								"absolute -bottom-1 left-0 h-[1px] bg-[#E7D0AF] transition-all duration-300 ease-in-out",
								isDashboardActive ? "w-full" : "w-0 group-hover:w-full",
							].join(" ")}
						/>
					</span>
				</Link>

				{navigationGroups.map((group) => {
					const GroupIcon = group.icon;

					const isGroupActive = group.children.some(
						(item) => pathname === item.href,
					);

					return (
						<details key={group.label} className="group" open={isGroupActive}>
							<summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-[#E7D0AF]">
								<span className="flex items-center gap-2">
									<GroupIcon className="size-4 shrink-0" />
									<span>{group.label}</span>
								</span>

								<ChevronDown className="size-4 shrink-0 transition-transform duration-500 ease-in-out group-open:rotate-180" />
							</summary>

							<div className="admin-submenu grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-700 ease-in-out group-open:grid-rows-[1fr] group-open:opacity-100">
								<div className="overflow-hidden">
									<div className="mt-2 flex flex-col gap-1 border-l border-white/15 pl-3">
										{group.children.map((item) => {
											const ItemIcon = item.icon;
											const isActive = pathname === item.href;

											return (
												<Link
													key={item.href}
													href={item.href}
													className={[
														"group/child flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors duration-300",
														isActive
															? "text-[#E7D0AF]"
															: "text-white hover:text-[#E7D0AF]",
													].join(" ")}
												>
													<span className="flex items-center gap-2">
														<ItemIcon className="size-4 shrink-0" />

														<span className="relative">
															{item.label}

															<span
																className={[
																	"absolute -bottom-1 left-0 h-[1px] bg-[#E7D0AF] transition-all duration-300 ease-in-out",
																	isActive
																		? "w-full"
																		: "w-0 group-hover/child:w-full",
																].join(" ")}
															/>
														</span>
													</span>

													{isActive && (
														<ChevronsRight className="size-4 shrink-0 text-[#E7D0AF]" />
													)}
												</Link>
											);
										})}
									</div>
								</div>
							</div>
						</details>
					);
				})}
			</nav>
		</>
	);
}