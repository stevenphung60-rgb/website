import { Skeleton } from "src/components/ui/skeleton";

const loadingServiceIds = [
	"installation",
	"design",
	"maintenance",
	"consultation",
	"soundproofing",
	"cleaning",
];

/**
 * Loading skeleton aligned with the responsive public services list.
 */
export default function ServicesPageLoading() {
	return (
		<section className="w-full bg-muted/30 py-12 sm:py-16 lg:py-20">
			<div className="w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
				<div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
					<div className="hidden w-full md:block lg:w-[300px] lg:shrink-0">
						<div className="mb-4 flex items-end justify-between gap-4 border-b border-[#E7D0AF] pb-3 lg:mb-5 lg:block lg:border-b-0 lg:pb-0">
							<Skeleton className="h-8 w-32" />
							<Skeleton className="h-4 w-16 lg:hidden" />
						</div>

						<div className="grid grid-cols-2 gap-2 lg:flex lg:flex-col lg:gap-0">
							{loadingServiceIds.map((serviceId) => (
								<Skeleton
									key={`navigation-${serviceId}`}
									className="h-[52px] w-full rounded-none lg:h-[58px] lg:border-b"
								/>
							))}
						</div>
					</div>

					<div className="min-w-0 flex-1">
						<div className="grid grid-cols-1 gap-6 md:block md:space-y-8 lg:space-y-10">
							{loadingServiceIds.map((serviceId, index) => (
								<ServiceCardSkeleton key={`service-${serviceId}`} reversed={index % 2 === 1} />
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function ServiceCardSkeleton({ reversed }: { reversed: boolean }) {
	return (
		<div className="grid h-full min-w-0 overflow-hidden border border-[#342312]/10 bg-[#FAF7F0] shadow-[0_12px_36px_rgba(52,35,18,0.08)] md:h-auto md:border-[#342312]/15 md:bg-[#F7F1E6] md:shadow-sm lg:h-[420px] lg:grid-cols-2 xl:h-[460px]">
			<Skeleton
				className={[
					"aspect-[16/10] h-auto w-full rounded-none sm:aspect-[16/9] md:aspect-[16/8] lg:h-full lg:aspect-auto",
					reversed ? "lg:order-2" : "lg:order-1",
				].join(" ")}
			/>

			<div
				className={[
					"flex min-h-[200px] min-w-0 flex-col p-5 sm:min-h-[210px] sm:p-6 md:min-h-[280px] md:justify-between md:p-8 lg:h-full lg:min-h-0 lg:p-10 xl:p-12",
					reversed ? "lg:order-1" : "lg:order-2",
				].join(" ")}
			>
				<div className="flex items-center gap-2 md:gap-4">
					<Skeleton className="h-px w-5 rounded-none md:w-12" />
					<Skeleton className="h-3 w-16 md:h-4 md:w-24" />
				</div>

				<div className="flex items-stretch gap-4 py-5 md:block md:space-y-3 md:py-10 lg:py-0">
					<Skeleton className="w-[3px] shrink-0 rounded-none md:hidden" />
					<div className="min-w-0 flex-1 space-y-2">
						<Skeleton className="h-7 w-full md:h-10" />
						<Skeleton className="h-7 w-4/5 md:h-10" />
					</div>
				</div>

				<div className="mt-auto flex items-center justify-between border-t border-[#342312]/10 pt-4 md:border-0 md:pt-0">
					<Skeleton className="h-3 w-24 md:h-4 md:w-32" />
					<Skeleton className="size-9 rounded-full md:hidden" />
				</div>
			</div>
		</div>
	);
}
