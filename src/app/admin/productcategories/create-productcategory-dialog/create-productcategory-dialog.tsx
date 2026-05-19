import { Plus } from "lucide-react";
import { FormBoundaryProvider } from "src/components/form-state";
import { Button } from "src/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "src/components/ui/dialog";
import { CreateProductCategoryForm } from "./create-productcategory-form";

/**
 * Create product category dialog server component
 */
export default function CreateProductCategoryDialog() {
	return (
		<FormBoundaryProvider>
			<Dialog>
				<DialogTrigger asChild>
					<Button type="button">
						<Plus className="mr-2 size-4" />
						Add New Category
					</Button>
				</DialogTrigger>

				<DialogContent className="max-w-2xl w-[95vw] max-h-[95vh] overflow-y-auto p-0 bg-white">
					<DialogHeader className="p-6 pb-0 sticky top-0 bg-background z-10">
						<DialogTitle className="text-2xl font-serif font-bold text-foreground pr-8">
							Create New Product Category
						</DialogTitle>
						<DialogDescription className="text-muted-foreground">
							Add a new category to organize your products
						</DialogDescription>
					</DialogHeader>

					<div className="px-6 pb-6">
						<CreateProductCategoryForm />
					</div>
				</DialogContent>
			</Dialog>
		</FormBoundaryProvider>
	);
}