import { Card, CardContent } from "src/components/ui/card";
import { Skeleton } from "src/components/ui/skeleton";

/**
 * Skeleton placeholder for ProjectCard while loading
 */
export function ProjectCardSkeleton() {
	return (
		<Card className="h-[310px] overflow-hidden py-0 md:h-auto">
			<Skeleton className="h-full rounded-none md:aspect-video md:h-auto md:rounded-t-lg" />
			<CardContent className="hidden pb-6 md:block">
				<Skeleton className="h-6 w-3/4" />
			</CardContent>
		</Card>
	);
}
