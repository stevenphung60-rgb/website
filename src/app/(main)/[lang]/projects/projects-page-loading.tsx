import { Skeleton } from "src/components/ui/skeleton";
import { ProjectCardSkeleton } from "./project-card-skeleton";

/**
 * Loading skeleton for the projects page component
 * Matches the structure of projects section and contact button
 */
export default function ProjectsPageLoading() {
	return (
		<>
			{/* Projects Section Loading */}
			<section className="py-20 bg-muted/30">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Projects Header */}
					<div className="text-center mb-16">
						<Skeleton className="h-12 w-80 mx-auto mb-6" />
						<Skeleton className="h-6 w-full max-w-3xl mx-auto" />
					</div>

					{/* Projects Grid */}
					<div className="grid grid-cols-1 gap-6 md:block md:space-y-10 lg:space-y-12">
						{["mall", "factory", "hospital", "residential", "hotel", "university"].map(
							(project) => <ProjectCardSkeleton key={`project-${project}`} />,
						)}
					</div>
				</div>
			</section>

			{/* Contact Button Loading */}
			<div className="text-center mb-12">
				<Skeleton className="h-12 w-48 mx-auto" />
			</div>
		</>
	);
}
