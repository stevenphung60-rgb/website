import { FolderOpen, Save } from "lucide-react";
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
import { getHeroProjectInfo } from "src/server/heroproject";
import { updateHeroProjectInformation } from "./heroproject.actions";
import { HeroProjectProvider } from "./heroproject-context";
import { HeroProjectDetailsFormCard } from "./heroproject-form-cards";

export const metadata: Metadata = {
	title: "HeroProject Management - Admin - Nghiệp Hưng",
	description: "Update hero project information links in the admin panel",
};

/**
 * Project banner management page
 * @returns Project banner admin page
 */
export default async function HeroProjectPage() {
	await connection();

	const heroProjectInfo = await getHeroProjectInfo();

	return (
		<HeroProjectProvider heroProjectInfo={heroProjectInfo}>
			<div className="w-full">
				<AdminPageHeader
					title="Banner dự án"
					eyebrow="Quản trị nội dung"
					description="Quản lý banner dự án hiển thị trên website."
					icon={FolderOpen}
				/>

				<Form action={updateHeroProjectInformation}>
					<div className="grid w-full grid-cols-1 gap-6">
						<HeroProjectDetailsFormCard />
					</div>

					<FormErrorDisplay />

					<AdminStickyActions note="Sau khi lưu, banner dự án sẽ được cập nhật trên website.">
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
		</HeroProjectProvider>
	);
}