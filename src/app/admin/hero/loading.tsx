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
import { getHeroInfo } from "src/server/hero";
import { updateHeroInformation } from "./hero.actions";
import { HeroProvider } from "./hero-context";
import { HeroDetailsFormCard } from "./hero-form-cards";

export const metadata: Metadata = {
	title: "Hero Management - Admin - Nghiệp Hưng",
	description: "Update hero information links in the admin panel",
};

export default async function HeroPage() {
	await connection();
	const heroInfo = await getHeroInfo();

	return (
		<HeroProvider heroInfo={heroInfo}>
			<div className="container mx-auto px-4 py-8">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center space-x-4">
						<div className="p-2 rounded-lg bg-primary/10">
							<Save className="size-6 text-primary" />
						</div>
						<div>
							<h1 className="text-2xl font-serif font-bold text-foreground">Hero</h1>
							<p className="text-muted-foreground">Update hero information</p>
						</div>
					</div>
				</div>

				<Form action={updateHeroInformation}>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<HeroDetailsFormCard />
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
		</HeroProvider>
	);
}