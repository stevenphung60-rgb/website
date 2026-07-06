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
import { getContactInfo } from "src/server/contact";
import { updateContactInformation } from "./contact.actions";
import { ContactProvider } from "./contact-context";
import {
	ContactDetailsFormCard,
	WorkingHoursFormCard,
} from "./contact-form-cards";
import { SocialMediaFormCard } from "./social-media/social-media-form-card";

export const metadata: Metadata = {
	title: "Contact Management - Admin - Nghiệp Hưng",
	description: "Update contact information in the admin panel",
};

/**
 * Contact management page
 * @returns Contact admin page
 */
export default async function ContactPage() {
	await connection();

	const contactInfo = await getContactInfo();

	return (
		<ContactProvider contactInfo={contactInfo}>
			<div className="w-full">
				<AdminPageHeader
					title="Liên hệ"
					eyebrow="Quản trị nội dung"
					description="Quản lý thông tin liên hệ hiển thị trên website."
					icon={Phone}
				/>

				<Form action={updateContactInformation}>
					<div className="grid w-full grid-cols-1 gap-6">
						<ContactDetailsFormCard />

						<WorkingHoursFormCard />

						<SocialMediaFormCard />
					</div>

					<FormErrorDisplay />

					<AdminStickyActions note="Sau khi lưu, thông tin liên hệ sẽ được cập nhật trên website.">
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
		</ContactProvider>
	);
}