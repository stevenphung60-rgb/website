import { Home, Save } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { AdminPageHeader } from "src/components/admin/admin-page-header";
import { AdminStickyActions } from "src/components/admin/admin-sticky-actions";
import {
	Form,
	FormErrorDisplay,
	FormPendingMessage,
	FormSubmitMessage,
} from "src/components/form-state";
import { Button } from "src/components/ui/button";
import { getHeroInfo } from "src/server/hero";
import { updateHeroInformation } from "./hero.actions";
import { HeroProvider } from "./hero-context";
import { HeroDetailsFormCard } from "./hero-form-cards";

export const metadata: Metadata = {
	title: "Hero Management - Admin - Nghiệp Hưng",
	description: "Update hero information links in the admin panel",
};

/**
 * Home hero management page
 * @returns Home hero admin page
 */
export default async function HeroPage() {
	await connection();

	const heroInfo = await getHeroInfo();

	return (
		<HeroProvider heroInfo={heroInfo}>
			<div className="w-full">
				<AdminPageHeader
					title="Trang chủ"
					eyebrow="Quản trị nội dung"
					description="Quản lý nội dung trang chủ hiển thị trên website."
					icon={Home}
				/>

				<Form action={updateHeroInformation}>
					<div className="grid w-full grid-cols-1 gap-6">
						<HeroDetailsFormCard />
					</div>

					<FormErrorDisplay />

					<AdminStickyActions note="Sau khi lưu, nội dung trang chủ sẽ được cập nhật trên website.">
						<Button
							type="submit"
							className="bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B]"
						>
							<FormSubmitMessage>
								<Save className="mr-2 size-4" />
								Lưu thay đổi
							</FormSubmitMessage>

							<FormPendingMessage>
								<Save className="mr-2 size-4" />
								Đang lưu...
							</FormPendingMessage>
						</Button>
					</AdminStickyActions>
				</Form>
			</div>
		</HeroProvider>
	);
}