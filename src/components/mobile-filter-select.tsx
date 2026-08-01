"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Check, ChevronRight, ListFilter, X } from "lucide-react";
import { useState } from "react";
import { cn } from "src/lib/utils";

interface MobileFilterOption {
	value: string;
	label: string;
}

interface MobileFilterSelectProps {
	allLabel: string;
	className?: string;
	label: string;
	onValueChange: (value: string | null) => void;
	options: MobileFilterOption[];
	value: string | null;
}

export function MobileFilterSelect({
	allLabel,
	className,
	label,
	onValueChange,
	options,
	value,
}: MobileFilterSelectProps) {
	const [open, setOpen] = useState(false);
	const selectedLabel = options.find((option) => option.value === value)?.label ?? allLabel;

	const handleSelect = (nextValue: string | null) => {
		setOpen(false);
		onValueChange(nextValue);
	};

	const renderOption = (optionValue: string | null, optionLabel: string) => {
		const active = value === optionValue;

		return (
			<button
				key={optionValue ?? "__all__"}
				type="button"
				aria-pressed={active}
				className={cn(
					"group relative flex w-full items-center gap-3 border-b px-4 py-4 text-left text-[15px] font-medium leading-6 transition-colors duration-200",
					active
						? "border-[#A87E3C]/35 bg-[#F1E5D2] text-[#342312]"
						: "border-[#E7D0AF]/85 bg-transparent text-[#342312]/85 hover:bg-[#F7F1E6] hover:text-[#342312]",
				)}
				onClick={() => handleSelect(optionValue)}
			>
				<span
					className={cn(
						"h-8 w-[3px] shrink-0 bg-[#A87E3C] transition-opacity",
						active ? "opacity-100" : "opacity-0 group-hover:opacity-45",
					)}
				/>

				<span className="min-w-0 flex-1 break-words">{optionLabel}</span>

				<span
					className={cn(
						"flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors",
						active
							? "border-[#A87E3C] bg-[#A87E3C] text-[#FAF7F0]"
							: "border-[#E7D0AF] text-[#A87E3C] group-hover:border-[#A87E3C]",
					)}
				>
					{active ? <Check className="size-4" /> : <ChevronRight className="size-4" />}
				</span>
			</button>
		);
	};

	return (
		<div
			className={cn("rounded-none border border-[#E7D0AF] bg-white px-4 py-4 shadow-sm", className)}
		>
			<span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#A87E3C]">
				{label}
			</span>

			<DialogPrimitive.Root open={open} onOpenChange={setOpen}>
				<DialogPrimitive.Trigger asChild>
					<button
						type="button"
						aria-label={label}
						className="flex min-h-12 w-full items-center gap-3 border border-[#E7D0AF] bg-[#FAF7F1] px-3 py-2 text-left text-[#342312] transition-colors hover:border-[#A87E3C] focus-visible:border-[#A87E3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A87E3C]/25"
					>
						<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F1E5D2] text-[#A87E3C]">
							<ListFilter className="size-[18px]" />
						</span>

						<span className="min-w-0 flex-1 break-words text-[15px] font-normal leading-6">
							{selectedLabel}
						</span>

						<ChevronRight className="size-5 shrink-0 text-[#A87E3C]" />
					</button>
				</DialogPrimitive.Trigger>

				<DialogPrimitive.Portal>
					<DialogPrimitive.Overlay
						className={cn(
							"fixed inset-0 z-[80] bg-[#1C1209]/55 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
							className,
						)}
					/>

					<DialogPrimitive.Content
						className={cn(
							"fixed inset-y-0 left-0 z-[81] flex h-[100dvh] w-[min(88vw,380px)] flex-col overflow-hidden border-r border-[#A87E3C]/45 bg-[#FAF7F0] text-[#342312] shadow-[18px_0_60px_rgba(28,18,9,0.28)] outline-none duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left-full data-[state=open]:animate-in data-[state=open]:slide-in-from-left-full",
							className,
						)}
					>
						<div className="relative shrink-0 border-b border-[#E7D0AF] bg-[#F7F1E6] px-5 py-5">
							<div className="mb-3 h-[2px] w-14 bg-[#A87E3C]" />

							<DialogPrimitive.Title className="pr-12 font-serif text-[26px] font-bold leading-tight text-[#342312]">
								{label}
							</DialogPrimitive.Title>

							<DialogPrimitive.Description className="sr-only">{label}</DialogPrimitive.Description>

							<DialogPrimitive.Close asChild>
								<button
									type="button"
									aria-label="Close"
									className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full border border-[#E7D0AF] bg-[#FAF7F0] text-[#342312] transition-colors hover:border-[#A87E3C] hover:text-[#A87E3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A87E3C]/30"
								>
									<X className="size-5" />
								</button>
							</DialogPrimitive.Close>
						</div>

						<nav
							aria-label={label}
							className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3"
						>
							{renderOption(null, allLabel)}
							{options.map((option) => renderOption(option.value, option.label))}
						</nav>

						<div className="shrink-0 border-t border-[#E7D0AF] bg-[#F7F1E6] px-5 py-3">
							<div className="h-[3px] w-14 bg-[#A87E3C]" />
						</div>
					</DialogPrimitive.Content>
				</DialogPrimitive.Portal>
			</DialogPrimitive.Root>
		</div>
	);
}
