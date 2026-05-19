import { FieldError, FormField, FormInput, FormLabel } from "src/components/form-field";
import {
	Form,
	FormErrorDisplay,
	FormPendingMessage,
	FormResetButton,
	FormSubmitMessage,
} from "src/components/form-state";
import { Button } from "src/components/ui/button";
import { DialogClose } from "src/components/ui/dialog";
import {
	VisualTabs,
	VisualTabsContent,
	VisualTabsList,
	VisualTabsTrigger,
} from "src/components/ui/visual-tabs";
import type { ProjectCategory } from "src/server/projectcategories";
import { updateProjectCategory } from "./edit-projectcategory-dialog.actions";

interface EditProjectCategoryFormProps {
	projectCategory: ProjectCategory;
}

export function EditProjectCategoryForm({ projectCategory }: EditProjectCategoryFormProps) {
	return (
		<Form action={updateProjectCategory}>
			<input type="hidden" name="projectCategoryId" value={projectCategory.id} />

			<div className="space-y-6">
				<div className="space-y-4">
					<FormField>
						<FormLabel>Project Category Name</FormLabel>

						<VisualTabs defaultValue="en" className="w-full">
							<VisualTabsList className="grid w-full grid-cols-2">
								<VisualTabsTrigger value="en">English</VisualTabsTrigger>
								<VisualTabsTrigger value="vi">Tiếng Việt</VisualTabsTrigger>
							</VisualTabsList>

							<VisualTabsContent value="en">
								<FormField
									fieldId="projectCategoryNameEn"
									name="projectCategoryNameEn"
									placeholder="Enter project category name in English"
									required
								>
									<FormInput defaultValue={projectCategory.name.en} />
									<FieldError />
								</FormField>
							</VisualTabsContent>

							<VisualTabsContent value="vi">
								<FormField
									fieldId="projectCategoryNameVi"
									name="projectCategoryNameVi"
									placeholder="Nhập tên danh mục sản phẩm bằng tiếng Việt"
									required
								>
									<FormInput defaultValue={projectCategory.name.vi} />
									<FieldError />
								</FormField>
							</VisualTabsContent>
						</VisualTabs>
					</FormField>
				</div>
			</div>

			<FormErrorDisplay />

			<div className="flex justify-end space-x-2 pt-4">
				<DialogClose asChild>
					<FormResetButton>Close</FormResetButton>
				</DialogClose>

				<Button type="submit">
					<FormSubmitMessage>Update Project Category</FormSubmitMessage>
					<FormPendingMessage>Updating...</FormPendingMessage>
				</Button>
			</div>
		</Form>
	);
}