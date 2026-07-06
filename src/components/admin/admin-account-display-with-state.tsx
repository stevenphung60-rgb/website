"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "src/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import { signOut } from "src/lib/auth-client";

interface AdminUser {
	name: string;
	email: string;
	image?: string | null;
}

interface AdminAccountDisplayWithStateProps {
	user: AdminUser;
	isCollapsed?: boolean;
}

/**
 * Admin account display with sign out action
 * @param props - Admin account display props
 * @returns Admin account dropdown
 */
export function AdminAccountDisplayWithState({
	user,
	isCollapsed = false,
}: AdminAccountDisplayWithStateProps) {
	const [isSigningOut, setIsSigningOut] = useState(false);
	const [imageError, setImageError] = useState(false);
	const router = useRouter();

	const displayName = user.name || user.email.split("@")[0];

	const initials = user.name
		? user.name
				.split(" ")
				.map((namePart) => namePart[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: user.email[0].toUpperCase();

	const handleSignOut = async () => {
		try {
			setIsSigningOut(true);
			await signOut();
			router.push("/login");
		} catch (error) {
			console.error("Error signing out:", error);
		} finally {
			setIsSigningOut(false);
		}
	};

	const avatar = user.image && !imageError ? (
		<Image
			src={user.image}
			alt={displayName}
			width={32}
			height={32}
			className="size-8 rounded-full object-cover"
			onError={() => setImageError(true)}
			referrerPolicy="no-referrer"
		/>
	) : (
		<div className="flex size-8 items-center justify-center rounded-full border border-[#A87E3C]/45 bg-[#102A26] text-xs font-semibold text-[#E7D0AF]">
			{initials}
		</div>
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					title={displayName}
					className={[
						"h-auto rounded-xl border border-[#A87E3C]/25 bg-[#2B190B] text-[#E7D0AF] transition hover:bg-[#342312] hover:text-[#E7D0AF]",
						isCollapsed
							? "w-11 justify-center px-0 py-2"
							: "w-full justify-start gap-2 px-2.5 py-2",
					].join(" ")}
				>
					{avatar}

					{!isCollapsed ? (
						<span className="min-w-0 truncate text-[14px] font-semibold">
							{displayName}
						</span>
					) : null}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				side="right"
				align="end"
				className="w-64 border-[#E7D0AF] bg-white"
			>
				<DropdownMenuLabel>
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-semibold leading-none text-[#342312]">
							{user.name || displayName}
						</p>

						<p className="break-all text-xs leading-5 text-[#342312]/60">
							{user.email}
						</p>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					onClick={handleSignOut}
					disabled={isSigningOut}
					className="text-destructive focus:text-destructive"
				>
					<LogOut className="mr-2 size-4" />
					{isSigningOut ? "Đang đăng xuất..." : "Đăng xuất"}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}