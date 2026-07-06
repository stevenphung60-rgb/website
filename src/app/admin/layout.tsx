import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import type React from "react";
import { Suspense } from "react";
import { AdminShell } from "src/components/admin/admin-shell";
import { requireAdminAuth } from "src/lib/admin-auth";

export const metadata: Metadata = {
	title: "Admin - Nghiệp Hưng",
	description: "Trang quản trị website Nghiệp Hưng",
};

function CheckingAdminAuth() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-[#FAF7F1]">
			<div className="flex items-center space-x-2">
				<Loader2 className="size-6 animate-spin text-[#342312]" />
				<span>Đang kiểm tra phiên đăng nhập...</span>
			</div>
		</div>
	);
}

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Suspense fallback={<CheckingAdminAuth />}>
			<AdminLayoutContent>{children}</AdminLayoutContent>
		</Suspense>
	);
}

async function AdminLayoutContent({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await requireAdminAuth();

	return (
		<AdminShell
			user={{
				name: session.user.name,
				email: session.user.email,
				image: session.user.image,
			}}
		>
			{children}
		</AdminShell>
	);
}