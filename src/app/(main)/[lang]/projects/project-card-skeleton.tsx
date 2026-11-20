/**
 * Placeholder with the shape of the shared project card (image, category, title, two detail rows)
 */
export function ProjectCardSkeleton() {
	return (
		<div
			aria-hidden="true"
			className="flex h-full w-full flex-col overflow-hidden rounded-md border border-[#E7D0AF]/70 bg-white"
		>
			<div className="aspect-[4/3] w-full animate-pulse bg-[#E7D0AF]/40" />
			<div className="space-y-2.5 px-5 py-5">
				<div className="h-3 w-1/3 animate-pulse rounded bg-[#E7D0AF]/50" />
				<div className="h-5 w-4/5 animate-pulse rounded bg-[#E7D0AF]/50" />
				<div className="h-4 w-3/5 animate-pulse rounded bg-[#E7D0AF]/40" />
				<div className="h-4 w-2/5 animate-pulse rounded bg-[#E7D0AF]/40" />
			</div>
		</div>
	);
}
