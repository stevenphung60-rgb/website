import { Save, Wrench } from "lucide-react";
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
import { getHeroServiceInfo } from "src/server/heroservice";
import { updateHeroServiceInformation } from "./heroservice.actions";
import { HeroServiceProvider } from "./heroservice-context";
import { HeroServiceDetailsFormCard } from "./heroservice-form-cards";

export const metadata: Metadata = {
	title: "HeroService Management - Admin - Nghiệp Hưng",
	description: "Update hero service information links in the admin panel",
};

/**
 * Service banner management page
 * @returns Service banner admin page
 */
export default async function HeroServicePage() {
	await connection();

	const heroServiceInfo = await getHeroServiceInfo();

	return (
		<HeroServiceProvider heroServiceInfo={heroServiceInfo}>
			<div className="w-full">
				<AdminPageHeader
					title="Banner dịch vụ"
					eyebrow="Quản trị nội dung"
					description="Quản lý banner dịch vụ hiển thị trên website."
					icon={Wrench}
				/>

				<Form action={updateHeroServiceInformation}>
					<div className="grid w-full grid-cols-1 gap-6">
						<HeroServiceDetailsFormCard />
					</div>

					<FormErrorDisplay />

					<AdminStickyActions note="Sau khi lưu, banner dịch vụ sẽ được cập nhật trên website.">
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
		</HeroServiceProvider>
	);
}