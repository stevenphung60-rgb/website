import { Edit } from "lucide-react";
import { DialogContent, DialogHeader, DialogTitle } from "src/components/ui/dialog";
import type { ProjectCategory } from "src/server/projectcategories";
import { EditProjectCategoryForm } from "./edit-projectcategory-dialog/edit-projectcategory-form";

interface ProjectCategoryEditDialogContentProps {
	projectCategory: ProjectCategory;
}

export function ProjectCategoryEditDialogContent({
	projectCategory,
}: ProjectCategoryEditDialogContentProps) {
	return (
		<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
			<DialogHeader>
				<DialogTitle className="flex items-center gap-2">
					<Edit className="size-5" />
					Edit Project Category: {projectCategory.name.en}
				</DialogTitle>
			</DialogHeader>

			<EditProjectCategoryForm projectCategory={projectCategory} />
		</DialogContent>
	);
}