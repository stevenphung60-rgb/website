import { Edit, Eye, MoreHorizontal, Tags, Trash2 } from "lucide-react";
import {
	CancelButton,
	ConfirmButton,
	ConfirmDialog,
	Form,
	FormErrorDisplay,
	FormPendingMessage,
	FormSubmitMessage,
	SubmitButton,
} from "src/components/form-state";
import { Button } from "src/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "src/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import { getProjectCategoryById } from "src/server/projectcategories";
import { deleteProjectCategoryAction } from "./delete-projectcategory.actions";
import {
	ProjectCategoryEditTrigger,
	ProjectCategoryPreviewTrigger,
} from "./projectcategory-dialog-triggers";
import { ProjectCategoryEditDialogContent } from "./projectcategory-edit-dialog-content";
import { ProjectCategoryPreviewDialogContent } from "./projectcategory-preview-dialog-content";
import { ProjectCategoryRowDialog } from "./projectcategory-row-context.ui";

interface ProjectCategoryRowProps {
	projectCategoryId: string;
}

export async function ProjectCategoryRow({ projectCategoryId }: ProjectCategoryRowProps) {
	const projectCategory = await getProjectCategoryById(projectCategoryId);

	if (!projectCategory) {
		throw new Error(`Project category with id ${projectCategoryId} not found`);
	}

	return (
		<div className="group relative bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-primary/20">
			<div className="flex items-start justify-between">
				<div className="flex items-start space-x-4 flex-1 min-w-0">
					<div className="relative size-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
						<div className="size-full flex items-center justify-center">
							<Tags className="size-8 text-muted-foreground" />
						</div>
					</div>

					<div className="flex-1 min-w-0">
						<div className="mb-2">
							<h3 className="text-lg font-semibold text-foreground truncate">
								{projectCategory.name.en}
							</h3>
							<p className="text-sm text-muted-foreground truncate">
								{projectCategory.name.vi}
							</p>
						</div>

						<div className="flex items-center gap-4 text-xs text-muted-foreground">
							<span className="flex items-center gap-1">
								<span className="size-2 rounded-full bg-primary"></span>
								Created{" "}
								{new Date(projectCategory.createdAt).toLocaleString("en-US", {
									timeZone: "UTC",
									year: "numeric",
									month: "short",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
							<span className="flex items-center gap-1">
								<span className="size-2 rounded-full bg-secondary"></span>
								Updated{" "}
								{new Date(projectCategory.updatedAt).toLocaleString("en-US", {
									timeZone: "UTC",
									year: "numeric",
									month: "short",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-3 ml-4">
					<Form action={deleteProjectCategoryAction} confirmBeforeSubmit>
						<input type="hidden" name="projectCategoryId" value={projectCategory.id} />

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm">
									<MoreHorizontal className="size-4" />
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align="end" className="w-48">
								<ProjectCategoryPreviewTrigger className="flex items-center gap-2 w-full">
									<Eye className="size-4" />
									View Details
								</ProjectCategoryPreviewTrigger>

								<ProjectCategoryEditTrigger className="flex items-center gap-2 w-full">
									<Edit className="size-4" />
									Edit Category
								</ProjectCategoryEditTrigger>

								<SubmitButton asChild className="flex items-center gap-2 w-full">
									<DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
										<Trash2 className="size-4" />
										Delete Category
									</DropdownMenuItem>
								</SubmitButton>
							</DropdownMenuContent>
						</DropdownMenu>

						<ConfirmDialog>
							<DialogContent className="sm:max-w-2xl bg-white">
								<DialogHeader className="space-y-3">
									<div className="flex items-start gap-3">
										<div className="p-2 rounded-full bg-destructive/10 flex-shrink-0">
											<Trash2 className="size-5 text-destructive" />
										</div>
										<div className="space-y-1">
											<DialogTitle>Delete Project Category</DialogTitle>
											<DialogDescription>
												This action cannot be undone. The project category will be permanently
												removed.
											</DialogDescription>
										</div>
									</div>
								</DialogHeader>

								<div className="space-y-3">
									<div className="p-4 bg-muted/50 rounded-lg border">
										<div className="mb-2">
											<p className="font-medium text-foreground">{projectCategory.name.en}</p>
											<p className="text-sm text-muted-foreground">
												{projectCategory.name.vi}
											</p>
										</div>
									</div>
									<FormErrorDisplay />
								</div>

								<DialogFooter className="gap-2">
									<CancelButton>Cancel</CancelButton>
									<ConfirmButton variant="destructive">
										<FormSubmitMessage>Delete Category</FormSubmitMessage>
										<FormPendingMessage>Deleting...</FormPendingMessage>
									</ConfirmButton>
								</DialogFooter>
							</DialogContent>
						</ConfirmDialog>
					</Form>
				</div>
			</div>

			<ProjectCategoryRowDialog type="preview">
				<ProjectCategoryPreviewDialogContent projectCategoryId={projectCategory.id} />
			</ProjectCategoryRowDialog>

			<ProjectCategoryRowDialog type="edit">
				<ProjectCategoryEditDialogContent projectCategory={projectCategory} />
			</ProjectCategoryRowDialog>
		</div>
	);
}