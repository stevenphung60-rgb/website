import { Card, CardContent } from "src/components/ui/card";
import { Skeleton } from "src/components/ui/skeleton";

/**
 * Skeleton placeholder for ProjectCard while loading
 */
export function ProjectCardSkeleton() {
	return (
		<Card className="relative h-full min-h-0 gap-0 overflow-hidden !rounded-none border-[#A87E3C]/20 bg-[#F7F1E6] py-0 md:h-[520px] md:border-[#342312]/20 lg:h-[440px]">
			<Skeleton className="aspect-[16/10] w-full shrink-0 rounded-none md:absolute md:inset-0 md:h-full md:aspect-auto" />

			<CardContent className="space-y-3 p-5 md:hidden">
				<Skeleton className="h-2.5 w-2/3" />
				<Skeleton className="h-6 w-full" />
				<Skeleton className="h-6 w-4/5" />
				<div className="space-y-2 border-y border-[#A87E3C]/15 py-3">
					<Skeleton className="h-4 w-4/5" />
					<Skeleton className="h-4 w-1/2" />
				</div>
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-5/6" />
			</CardContent>
		</Card>
	);
}
