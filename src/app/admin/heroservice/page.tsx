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
import { getHeroServiceInfo } from "src/server/heroservice";
import { updateHeroServiceInformation } from "./heroservice.actions";
import { HeroServiceProvider } from "./heroservice-context";
import { HeroServiceDetailsFormCard } from "./heroservice-form-cards";

export const metadata: Metadata = {
	title: "HeroService Management - Admin - Nghiệp Hưng",
	description: "Update hero service information links in the admin panel",
};

export default async function HeroServicePage() {
	await connection();
	const heroServiceInfo = await getHeroServiceInfo();

	return (
		<HeroServiceProvider heroServiceInfo={heroServiceInfo}>
			<div className="container mx-auto px-4 py-8">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center space-x-4">
						<div className="p-2 rounded-lg bg-primary/10">
							<Save className="size-6 text-primary" />
						</div>
						<div>
							<h1 className="text-2xl font-serif font-bold text-foreground">HeroService</h1>
							<p className="text-muted-foreground">Update hero service information</p>
						</div>
					</div>
				</div>

				<Form action={updateHeroServiceInformation}>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<HeroServiceDetailsFormCard />
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
		</HeroServiceProvider>
	);
}