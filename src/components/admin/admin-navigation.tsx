import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AdminAccountDisplay } from "./admin-account-display";
import { AdminNavigationMenu } from "./admin-navigation-menu";

export function AdminNavigation() {
	return (
		<aside className="fixed left-0 top-0 z-50 h-screen w-64 bg-[#342312] text-white shadow-xl">
			<div className="flex h-full flex-col px-3 py-6">
				<div className="mb-6 flex items-center gap-3 px-2">
					<Image
						src="/nghiep_hung_logo_no_bg.svg"
						alt="NH Logo"
						width={40}
						height={40}
						className="shrink-0"
					/>

					<span className="text-[16px] font-semibold text-[#E7D0AF]">
						NH Website Admin
					</span>
				</div>

				<Link
					href="/"
					className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-[#E7D0AF]"
				>
					<Home className="size-4 shrink-0" />

					<span className="relative">
						Back to HOMEPAGE
						<span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[#E7D0AF] transition-all duration-300 group-hover:w-full" />
					</span>
				</Link>

				<div className="my-4 h-[1px] w-full bg-white/20" />

				<AdminNavigationMenu />

				<div className="border-t border-white/20 pt-4 text-[#342312]">
					<AdminAccountDisplay />
				</div>
			</div>
		</aside>
	);
}