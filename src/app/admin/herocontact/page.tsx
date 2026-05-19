import { Save } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
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

export default async function HeroContactPage() {
	await connection();
	const heroContactInfo = await getHeroContactInfo();

	return (
		<HeroContactProvider heroContactInfo={heroContactInfo}>
			<div className="container mx-auto px-4 py-8">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center space-x-4">
						<div className="p-2 rounded-lg bg-primary/10">
							<Save className="size-6 text-primary" />
						</div>
						<div>
							<h1 className="text-2xl font-serif font-bold text-foreground">HeroContact</h1>
							<p className="text-muted-foreground">Update hero contact information</p>
						</div>
					</div>
				</div>

				<Form action={updateHeroContactInformation}>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<HeroContactDetailsFormCard />
					</div>

					<FormErrorDisplay />

					<div className="flex justify-end pt-4">
						<Button type="submit">
							<FormSubmitMessage>
								<Save className="mr-2 size-4" />
								Save Changes
							</FormSubmitMessage>
							<FormPendingMessage>
								<Save className="mr-2 size-4" />
								Saving...
							</FormPendingMessage>
						</Button>
					</div>
				</Form>
			</div>
		</HeroContactProvider>
	);
}