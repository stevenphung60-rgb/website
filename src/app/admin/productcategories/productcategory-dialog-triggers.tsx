"use client";

import { Slot } from "@radix-ui/react-slot";
import { DropdownMenuItem } from "src/components/ui/dropdown-menu";
import { useProductCategoryRowActions } from "./productcategory-row-context.state";

interface ProductCategoryDialogTriggerProps extends React.ComponentProps<typeof DropdownMenuItem> {
	asChild?: boolean;
}

export function ProductCategoryPreviewTrigger({
	children,
	asChild = false,
	className,
}: ProductCategoryDialogTriggerProps) {
	const { openPreviewDialog } = useProductCategoryRowActions();

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

export function ProductCategoryEditTrigger({
	children,
	asChild = false,
	className,
}: ProductCategoryDialogTriggerProps) {
	const { openEditDialog } = useProductCategoryRowActions();

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