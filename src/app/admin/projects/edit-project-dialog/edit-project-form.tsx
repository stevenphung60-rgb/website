import { FieldError, FormField, FormInput, FormLabel } from "src/components/form-field";
import {
	Form,
	FormErrorDisplay,
	FormPendingMessage,
	FormSubmitMessage,
} from "src/components/form-state";
import { Button } from "src/components/ui/button";
import { DialogClose } from "src/components/ui/dialog";
import { Textarea } from "src/components/ui/textarea";
import {
	VisualTabs,
	VisualTabsContent,
	VisualTabsList,
	VisualTabsTrigger,
} from "src/components/ui/visual-tabs";
import type { Project } from "src/server/projects";
import { ProjectCompletionStatus, ProjectVisibilityStatus } from "src/server/projects";
import {
	getActiveProjectCategoryIds,
	getProjectCategoryById,
} from "src/server/projectcategories";
import { updateProject } from "./edit-project-dialog.actions";
import { EditProjectSpecsWithState } from "./edit-project-specs-with-state";

interface EditProjectFormProps {
	project: Project;
}

export async function EditProjectForm({ project }: EditProjectFormProps) {
	const projectCategoryIds = await getActiveProjectCategoryIds();

	const projectCategories = (
		await Promise.all(
			projectCategoryIds.map((categoryId) => getProjectCategoryById(categoryId)),
		)
	).filter(
		(category): category is NonNullable<typeof category> => category !== null,
	);

	return (
		<Form action={updateProject}>
			<input type="hidden" name="projectId" value={project.id} />

			<div className="space-y-6">
				<div className="space-y-4">
					<FormField>
						<FormLabel>Project Name</FormLabel>

						<VisualTabs defaultValue="en" className="w-full">
							<VisualTabsList className="grid w-full grid-cols-2">
								<VisualTabsTrigger value="en">English</VisualTabsTrigger>
								<VisualTabsTrigger value="vi">Tiếng Việt</VisualTabsTrigger>
							</VisualTabsList>

							<VisualTabsContent value="en">
								<FormField
									fieldId="projectNameEn"
									name="projectNameEn"
									placeholder="Enter project name in English"
								>
									<FormInput defaultValue={project.name.en} />
									<FieldError />
								</FormField>
							</VisualTabsContent>

							<VisualTabsContent value="vi">
								<FormField
									fieldId="projectNameVi"
									name="projectNameVi"
									placeholder="Nhập tên dự án bằng tiếng Việt"
								>
									<FormInput defaultValue={project.name.vi} />
									<FieldError />
								</FormField>
							</VisualTabsContent>
						</VisualTabs>
					</FormField>
				</div>

				<FormField fieldId="projectCategoryId" name="projectCategoryId">
					<FormLabel>Project Category</FormLabel>

					<FormInput asChild>
						<select
							name="projectCategoryId"
							defaultValue={project.categoryId ?? ""}
							className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<option value="">No category</option>

							{projectCategories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name.en} - {category.name.vi}
								</option>
							))}
						</select>
					</FormInput>

					<FieldError />
				</FormField>

				<div className="grid grid-cols-2 gap-4">
					<FormField>
						<FormLabel>Location</FormLabel>

						<VisualTabs defaultValue="en" className="w-full">
							<VisualTabsList className="grid w-full grid-cols-2">
								<VisualTabsTrigger value="en">English</VisualTabsTrigger>
								<VisualTabsTrigger value="vi">Tiếng Việt</VisualTabsTrigger>
							</VisualTabsList>

							<VisualTabsContent value="en">
								<FormField
									fieldId="projectLocationEn"
									name="projectLocationEn"
									placeholder="Enter project location in English"
									required
								>
									<FormInput defaultValue={project.location.en} />
									<FieldError />
								</FormField>
							</VisualTabsContent>

							<VisualTabsContent value="vi">
								<FormField
									fieldId="projectLocationVi"
									name="projectLocationVi"
									placeholder="Nhập địa điểm dự án bằng tiếng Việt"
									required
								>
									<FormInput defaultValue={project.location.vi} />
									<FieldError />
								</FormField>
							</VisualTabsContent>
						</VisualTabs>
					</FormField>

					<FormField>
						<FormLabel>Year</FormLabel>

						<VisualTabs defaultValue="en" className="w-full">
							<VisualTabsList className="grid w-full grid-cols-2">
								<VisualTabsTrigger value="en">English</VisualTabsTrigger>
								<VisualTabsTrigger value="vi">Tiếng Việt</VisualTabsTrigger>
							</VisualTabsList>

							<VisualTabsContent value="en">
								<FormField
									fieldId="projectYearEn"
									name="projectYearEn"
									placeholder="Enter project year in English"
									required
								>
									<FormInput defaultValue={project.year.en} />
									<FieldError />
								</FormField>
							</VisualTabsContent>

							<VisualTabsContent value="vi">
								<FormField
									fieldId="projectYearVi"
									name="projectYearVi"
									placeholder="Nhập năm dự án bằng tiếng Việt"
									required
								>
									<FormInput defaultValue={project.year.vi} />
									<FieldError />
								</FormField>
							</VisualTabsContent>
						</VisualTabs>
					</FormField>
				</div>

				<div className="space-y-4">
					<FormField>
						<FormLabel>Project Description</FormLabel>

						<VisualTabs defaultValue="en" className="w-full">
							<VisualTabsList className="grid w-full grid-cols-2">
								<VisualTabsTrigger value="en">English</VisualTabsTrigger>
								<VisualTabsTrigger value="vi">Tiếng Việt</VisualTabsTrigger>
							</VisualTabsList>

							<VisualTabsContent value="en">
								<FormField
									fieldId="projectDescriptionEn"
									name="projectDescriptionEn"
									placeholder="Enter project description in English"
								>
									<Textarea
										name="projectDescriptionEn"
										placeholder="Enter project description in English"
										defaultValue={project.description.en}
										className="min-h-[100px]"
									/>

									<FieldError />
								</FormField>
							</VisualTabsContent>

							<VisualTabsContent value="vi">
								<FormField
									fieldId="projectDescriptionVi"
									name="projectDescriptionVi"
									placeholder="Nhập mô tả dự án bằng tiếng Việt"
								>
									<Textarea
										name="projectDescriptionVi"
										placeholder="Nhập mô tả dự án bằng tiếng Việt"
										defaultValue={project.description.vi}
										className="min-h-[100px]"
									/>

									<FieldError />
								</FormField>
							</VisualTabsContent>
						</VisualTabs>
					</FormField>
				</div>

				<div className="space-y-4">
					<div className="text-sm font-medium text-foreground">
						Project Specifications
					</div>

					<EditProjectSpecsWithState initialSpecs={project.specs} />
				</div>

				<div className="grid grid-cols-2 gap-4">
					<FormField
						fieldId="projectVisibilityStatus"
						name="projectVisibilityStatus"
						required
					>
						<FormLabel>Visibility Status</FormLabel>

						<FormInput asChild>
							<select
								name="projectVisibilityStatus"
								defaultValue={project.visibilityStatus}
								className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<option value={ProjectVisibilityStatus.Active}>Active</option>
								<option value={ProjectVisibilityStatus.Draft}>Draft</option>
							</select>
						</FormInput>

						<FieldError />
					</FormField>

					<FormField
						fieldId="projectCompletionStatus"
						name="projectCompletionStatus"
						required
					>
						<FormLabel>Completion Status</FormLabel>

						<FormInput asChild>
							<select
								name="projectCompletionStatus"
								defaultValue={project.completionStatus}
								className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<option value={ProjectCompletionStatus.Completed}>
									Completed
								</option>

								<option value={ProjectCompletionStatus.InProgress}>
									In Progress
								</option>

								<option value={ProjectCompletionStatus.Planning}>
									Planning
								</option>
							</select>
						</FormInput>

						<FieldError />
					</FormField>
				</div>
			</div>

			<FormErrorDisplay />

			<div className="flex items-center justify-end space-x-2 pt-4">
				<DialogClose asChild>
					<Button type="button" variant="outline">
						Cancel
					</Button>
				</DialogClose>

				<Button type="submit">
					<FormSubmitMessage>Update Project</FormSubmitMessage>
					<FormPendingMessage>Updating project…</FormPendingMessage>
				</Button>
			</div>
		</Form>
	);
}