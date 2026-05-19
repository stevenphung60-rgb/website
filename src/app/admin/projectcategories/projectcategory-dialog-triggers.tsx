"use client";

import { Slot } from "@radix-ui/react-slot";
import { DropdownMenuItem } from "src/components/ui/dropdown-menu";
import { useProjectCategoryRowActions } from "./projectcategory-row-context.state";

interface ProjectCategoryDialogTriggerProps extends React.ComponentProps<typeof DropdownMenuItem> {
	asChild?: boolean;
}

export function ProjectCategoryPreviewTrigger({
	children,
	asChild = false,
	className,
}: ProjectCategoryDialogTriggerProps) {
	const { openPreviewDialog } = useProjectCategoryRowActions();

	if (asChild) {
		return (
			<Slot className={className} onClick={openPreviewDialog}>
				{children}
			</Slot>
		);
	}

	return (
		<DropdownMenuItem
			onSelect={() => {
				setTimeout(() => {
					openPreviewDialog();
				}, 0);
			}}
			className={className}
		>
			{children}
		</DropdownMenuItem>
	);
}

export function ProjectCategoryEditTrigger({
	children,
	asChild = false,
	className,
}: ProjectCategoryDialogTriggerProps) {
	const { openEditDialog } = useProjectCategoryRowActions();

	if (asChild) {
		return (
			<Slot className={className} onClick={openEditDialog}>
				{children}
			</Slot>
		);
	}

	return (
		<DropdownMenuItem
			onSelect={() => {
				setTimeout(() => {
					openEditDialog();
				}, 0);
			}}
			className={className}
		>
			{children}
		</DropdownMenuItem>
	);
}