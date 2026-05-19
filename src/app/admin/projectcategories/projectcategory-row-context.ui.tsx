"use client";

import { Dialog } from "src/components/ui/dialog";
import {
	useOpenEditDialog,
	useOpenPreviewDialog,
	useProjectCategoryRowActions,
} from "./projectcategory-row-context.state";

interface ProjectCategoryRowDialogProps {
	children: React.ReactNode;
	type: "preview" | "edit";
}

/**
 * Client component that renders children inside a controlled Dialog
 * Manages dialog open/close state using context
 */
export function ProjectCategoryRowDialog({ children, type }: ProjectCategoryRowDialogProps) {
	const isPreviewDialogOpen = useOpenPreviewDialog();
	const isEditDialogOpen = useOpenEditDialog();
	const { openPreviewDialog, closePreviewDialog, openEditDialog, closeEditDialog } =
		useProjectCategoryRowActions();

	const isOpen = type === "preview" ? isPreviewDialogOpen : isEditDialogOpen;

	const handleOpenChange = (open: boolean) => {
		if (type === "preview") {
			if (open) {
				openPreviewDialog();
			} else {
				closePreviewDialog();
			}
		} else {
			if (open) {
				openEditDialog();
			} else {
				closeEditDialog();
			}
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			{children}
		</Dialog>
	);
}