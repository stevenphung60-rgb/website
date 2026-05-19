import { Tags } from "lucide-react";
import { Card, CardContent } from "src/components/ui/card";
import CreateProjectCategoryDialog from "./create-projectcategory-dialog/create-projectcategory-dialog";

/**
 * Empty state for project categories
 */
export function EmptyStateWithDialog() {
	return (
		<Card className="border-dashed">
			<CardContent className="flex flex-col items-center justify-center py-16">
				<div className="text-center space-y-4">
					<div className="mx-auto size-16 rounded-full bg-muted flex items-center justify-center">
						<Tags className="size-8 text-muted-foreground" />
					</div>

					<div className="space-y-2">
						<h3 className="text-lg font-semibold">No project categories yet</h3>
						<p className="text-muted-foreground max-w-sm">
							Get started by creating your first project category. Organize your projects to make
							management easier.
						</p>
					</div>

					<CreateProjectCategoryDialog />
				</div>
			</CardContent>
		</Card>
	);
}