import { FormBoundaryProvider } from "src/components/form-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { ProjectCategoryRow } from "./projectcategory-row";
import { ProjectCategoryRowProvider } from "./projectcategory-row-context.state";

interface ProjectCategoriesListProps {
	projectCategoryIds: string[];
}

/**
 * Component that displays the list of project categories
 */
export function ProjectCategoriesList({ projectCategoryIds }: ProjectCategoriesListProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{"All Project Categories"}</CardTitle>
				<CardDescription>{"Manage your project categories"}</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="space-y-4">
					{projectCategoryIds.map((projectCategoryId) => (
						<FormBoundaryProvider key={projectCategoryId}>
							<ProjectCategoryRowProvider>
								<ProjectCategoryRow projectCategoryId={projectCategoryId} />
							</ProjectCategoryRowProvider>
						</FormBoundaryProvider>
					))}
				</div>
			</CardContent>
		</Card>
	);
}