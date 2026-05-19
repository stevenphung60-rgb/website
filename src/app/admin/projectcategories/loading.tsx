import { Skeleton } from "src/components/ui/skeleton";

/**
 * Loading component for the admin project categories page
 */
export default function Loading() {
	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<Skeleton className="h-8 w-40" />
					<Skeleton className="h-4 w-64" />
				</div>
				<Skeleton className="h-10 w-40" />
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-1 gap-6">
				<Skeleton className="h-24 w-full rounded-lg" />
			</div>

			{/* Categories list */}
			<div className="space-y-4">
				{[1, 2, 3, 4, 5].map((item) => (
					<div
						key={`category-skeleton-${item}`}
						className="flex items-center justify-between p-6 border rounded-xl"
					>
						<div className="flex items-center gap-4">
							<Skeleton className="size-16 rounded-lg" />

							<div className="space-y-2">
								<Skeleton className="h-5 w-40" />
								<Skeleton className="h-4 w-32" />
							</div>
						</div>

						<div className="flex gap-2">
							<Skeleton className="h-8 w-8 rounded" />
							<Skeleton className="h-8 w-8 rounded" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}