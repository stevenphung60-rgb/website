import { Palette } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { AdminPageHeader } from "src/components/admin/admin-page-header";
import { getSiteAppearance } from "src/server/site-appearance";
import { AppearanceForm } from "./appearance-form";

export const metadata: Metadata = {
	title: "Giao diện website - Admin - Nghiệp Hưng",
	description: "Quản lý font chữ và giao diện website",
};

/**
 * Site appearance management page
 * @returns Site appearance admin page
 */
export default async function AppearancePage() {
	await connection();

	const appearance = await getSiteAppearance();

	return (
		<div className="w-full">
			<AdminPageHeader
				title="Giao diện website"
				eyebrow="Quản trị giao diện"
				description="Quản lý font tiêu đề và font nội dung hiển thị trên website."
				icon={Palette}
			/>

			<AppearanceForm appearance={appearance} />
		</div>
	);
}