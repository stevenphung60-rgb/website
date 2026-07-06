import { Info, Save } from "lucide-react";
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
import { getHeroAboutInfo } from "src/server/heroabout";
import { updateHeroAboutInformation } from "./heroabout.actions";
import { HeroAboutProvider } from "./heroabout-context";
import { HeroAboutDetailsFormCard } from "./heroabout-form-cards";

export const metadata: Metadata = {
	title: "HeroAbout Management - Admin - Nghiệp Hưng",
	description: "Update hero about information in the admin panel",
};

/**
 * About page content management
 * @returns About admin page
 */
export default async function HeroAboutPage() {
	await connection();

	const heroAboutInfo = await getHeroAboutInfo();

	return (
		<HeroAboutProvider heroAboutInfo={heroAboutInfo}>
			<div className="w-full">
				<AdminPageHeader
					title="Giới thiệu"
					eyebrow="Quản trị nội dung"
					description="Quản lý nội dung giới thiệu hiển thị trên website."
					icon={Info}
				/>

				<Form action={updateHeroAboutInformation}>
					<div className="grid w-full grid-cols-1 gap-6">
						<HeroAboutDetailsFormCard />
					</div>

					<FormErrorDisplay />

					<AdminStickyActions note="Sau khi lưu, nội dung giới thiệu sẽ được cập nhật trên website.">
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
		</HeroAboutProvider>
	);
}