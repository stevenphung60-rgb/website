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
import { getHeroBrandInfo } from "src/server/herobrand";
import { updateHeroBrandInformation } from "./herobrand.actions";
import { HeroBrandProvider } from "./herobrand-context";
import { HeroBrandDetailsFormCard } from "./herobrand-form-cards";

export const metadata: Metadata = {
	title: "Hero Brand Management - Admin - Nghiệp Hưng",
	description: "Update header logo and company name in the admin panel",
};

export default async function HeroBrandPage() {
	await connection();

	const heroBrandInfo = await getHeroBrandInfo();

	return (
		<HeroBrandProvider heroBrandInfo={heroBrandInfo}>
			<div className="w-full max-w-none px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex min-w-0 items-center space-x-4">
						<div className="shrink-0 rounded-lg bg-primary/10 p-2">
							<Save className="size-6 text-primary" />
						</div>

						<div className="min-w-0">
							<h1 className="break-words font-serif text-2xl font-bold text-foreground">
								Hero Brand
							</h1>

							<p className="break-words text-muted-foreground">
								Update header logo and company name
							</p>
						</div>
					</div>
				</div>

				<Form action={updateHeroBrandInformation}>
					<div className="grid w-full grid-cols-1 gap-8">
						<HeroBrandDetailsFormCard />
					</div>

					<FormErrorDisplay />

					<div className="flex justify-end pt-6">
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
		</HeroBrandProvider>
	);
}