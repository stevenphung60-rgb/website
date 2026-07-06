import { Phone, Save } from "lucide-react";
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
import { getHeroContactInfo } from "src/server/herocontact";
import { updateHeroContactInformation } from "./herocontact.actions";
import { HeroContactProvider } from "./herocontact-context";
import { HeroContactDetailsFormCard } from "./herocontact-form-cards";

export const metadata: Metadata = {
	title: "HeroContact Management - Admin - Nghiệp Hưng",
	description: "Update hero contact information links in the admin panel",
};

/**
 * Contact banner management page
 * @returns Contact banner admin page
 */
export default async function HeroContactPage() {
	await connection();

	const heroContactInfo = await getHeroContactInfo();

	return (
		<HeroContactProvider heroContactInfo={heroContactInfo}>
			<div className="w-full">
				<AdminPageHeader
					title="Banner liên hệ"
					eyebrow="Quản trị nội dung"
					description="Quản lý banner liên hệ hiển thị trên website."
					icon={Phone}
				/>

				<Form action={updateHeroContactInformation}>
					<div className="grid w-full grid-cols-1 gap-6">
						<HeroContactDetailsFormCard />
					</div>

					<FormErrorDisplay />

					<AdminStickyActions note="Sau khi lưu, banner liên hệ sẽ được cập nhật trên website.">
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
		</HeroContactProvider>
	);
}