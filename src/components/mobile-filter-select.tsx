"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "src/components/ui/select";
import { cn } from "src/lib/utils";

const ALL_OPTION_VALUE = "__all__";

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
	return (
		<div
			className={cn("rounded-none border border-[#E7D0AF] bg-white px-4 py-4 shadow-sm", className)}
		>
			<span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#A87E3C]">
				{label}
			</span>

			<Select
				value={value || ALL_OPTION_VALUE}
				onValueChange={(nextValue) => {
					onValueChange(nextValue === ALL_OPTION_VALUE ? null : nextValue);
				}}
			>
				<SelectTrigger
					aria-label={label}
					className="h-11 w-full rounded-none border-[#E7D0AF] bg-[#FAF7F1] px-3 text-sm font-normal text-[#342312] shadow-none focus-visible:border-[#A87E3C] focus-visible:ring-0 [&_svg]:!text-[#A87E3C]"
				>
					<SelectValue />
				</SelectTrigger>

				<SelectContent className="w-[var(--radix-select-trigger-width)] rounded-none border-[#E7D0AF] bg-[#FAF7F1] text-[#342312] shadow-md">
					<SelectItem
						value={ALL_OPTION_VALUE}
						className="rounded-none px-3 py-2 font-normal text-[#342312] focus:bg-[#F1E5D2] focus:text-[#342312] data-[state=checked]:bg-[#F1E5D2] [&_svg]:text-[#A87E3C]"
					>
						{allLabel}
					</SelectItem>

					{options.map((option) => (
						<SelectItem
							key={option.value}
							value={option.value}
							className="rounded-none px-3 py-2 font-normal text-[#342312] focus:bg-[#F1E5D2] focus:text-[#342312] data-[state=checked]:bg-[#F1E5D2] [&_svg]:text-[#A87E3C]"
						>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
