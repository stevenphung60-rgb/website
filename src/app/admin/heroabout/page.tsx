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
import { getHeroAboutInfo } from "src/server/heroabout";
import { updateHeroAboutInformation } from "./heroabout.actions";
import { HeroAboutProvider } from "./heroabout-context";
import { HeroAboutDetailsFormCard } from "./heroabout-form-cards";

export const metadata: Metadata = {
	title: "HeroAbout Management - Admin - Nghiệp Hưng",
	description: "Update hero about information in the admin panel",
};

export default async function HeroAboutPage() {
	await connection();

	const heroAboutInfo = await getHeroAboutInfo();

	return (
		<HeroAboutProvider heroAboutInfo={heroAboutInfo}>
			<div className="w-full max-w-none px-6 py-8">
				<div className="mb-6 flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className="rounded-lg bg-primary/10 p-2">
							<Save className="size-6 text-primary" />
						</div>

						<div>
							<h1 className="font-serif text-2xl font-bold text-foreground">
								HeroAbout
							</h1>
							<p className="text-muted-foreground">Update hero about information</p>
						</div>
					</div>
				</div>

				<Form action={updateHeroAboutInformation}>
					<div className="w-full">
						<HeroAboutDetailsFormCard />
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
		</HeroAboutProvider>
	);
}