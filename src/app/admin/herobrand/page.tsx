import { Building2, Save } from "lucide-react";
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
import { getHeroBrandInfo } from "src/server/herobrand";
import { updateHeroBrandInformation } from "./herobrand.actions";
import { HeroBrandProvider } from "./herobrand-context";
import { HeroBrandDetailsFormCard } from "./herobrand-form-cards";

export const metadata: Metadata = {
	title: "Hero Brand Management - Admin - Nghiệp Hưng",
	description: "Update header logo and company name in the admin panel",
};

/**
 * Brand information management page
 * @returns Brand information admin page
 */
export default async function HeroBrandPage() {
	await connection();

	const heroBrandInfo = await getHeroBrandInfo();

	return (
		<HeroBrandProvider heroBrandInfo={heroBrandInfo}>
			<div className="w-full">
				<AdminPageHeader
					title="Logo & tên công ty"
					eyebrow="Quản trị nội dung"
					description="Quản lý logo và tên công ty hiển thị trên website."
					icon={Building2}
				/>

				<Form action={updateHeroBrandInformation}>
					<div className="grid w-full grid-cols-1 gap-6">
						<HeroBrandDetailsFormCard />
					</div>

					<FormErrorDisplay />

					<AdminStickyActions note="Sau khi lưu, logo và tên công ty sẽ được cập nhật trên website.">
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
		</HeroBrandProvider>
	);
}