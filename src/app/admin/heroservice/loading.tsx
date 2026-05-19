import { Skeleton } from "../../../components/ui/skeleton";

/**
 * Loading component for the admin hero service page.
 * Displays skeleton placeholders while the hero service data is being fetched.
 */
export default function Loading() {
	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Header skeleton */}
			<div className="space-y-2">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-4 w-96" />
			</div>

			{/* HeroService form cards skeleton */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* HeroService Information Card */}
				<div className="space-y-4">
					<Skeleton className="h-6 w-40" />
					<div className="space-y-3">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-1/2" />
					</div>
				</div>
			</div>

			{/* Preview section skeleton */}
			<div className="space-y-4">
				<Skeleton className="h-6 w-32" />
				<div className="border rounded-lg p-4 space-y-3">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-4 w-1/2" />
				</div>
			</div>
		</div>
	);
}
