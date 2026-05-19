import { Skeleton } from "src/components/ui/skeleton";

/**
 * Loading skeleton for the contact page component
 * Matches the responsive structure of contact page
 */
export default function ContactPageLoading() {
	return (
		<main className="w-full overflow-x-hidden bg-[#FAF7F0]">
			<section className="relative flex min-h-[420px] w-full items-center overflow-hidden bg-[#342312] py-16 sm:min-h-[480px] sm:py-20 lg:min-h-[520px] lg:py-0">
				<div className="relative z-10 w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
					<div className="max-w-3xl">
						<Skeleton className="mb-4 h-4 w-32 bg-[#E7D0AF]/25" />
						<Skeleton className="mb-4 h-10 w-full max-w-[560px] bg-[#E7D0AF]/20 sm:h-14" />
						<Skeleton className="h-5 w-full max-w-[640px] bg-[#E7D0AF]/15" />
						<Skeleton className="mt-3 h-5 w-4/5 max-w-[520px] bg-[#E7D0AF]/15" />
					</div>
				</div>
			</section>

			<section className="relative w-full overflow-hidden bg-[#FAF7F0] py-12 sm:py-16 lg:py-20">
				<div className="relative w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
					<div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:items-start lg:gap-8 xl:gap-10">
						<div className="min-w-0">
							<div className="border border-[#E7D0AF] bg-[#F7F1E6] p-5 shadow-[0_20px_60px_rgba(52,35,18,0.10)] sm:p-7 lg:p-10">
								<Skeleton className="mb-3 h-4 w-32 bg-[#E7D0AF]/45" />
								<Skeleton className="mb-6 h-8 w-full max-w-[360px] bg-[#E7D0AF]/45 sm:mb-8 sm:h-10" />

								<div className="space-y-5 sm:space-y-6">
									<div className="grid gap-5 sm:gap-6 md:grid-cols-2">
										<FormFieldSkeleton />
										<FormFieldSkeleton />
									</div>

									<FormFieldSkeleton />
									<FormFieldSkeleton />

									<div>
										<Skeleton className="mb-2 h-4 w-28 bg-[#E7D0AF]/45" />
										<Skeleton className="h-[130px] w-full bg-[#E7D0AF]/35 sm:h-[150px]" />
									</div>

									<Skeleton className="h-12 w-full bg-[#342312]/25 sm:h-14" />
								</div>
							</div>
						</div>

						<div className="min-w-0 space-y-5 sm:space-y-6">
							<div className="border border-[#E7D0AF] bg-[#F7F1E6] p-5 shadow-[0_18px_50px_rgba(52,35,18,0.08)] sm:p-7 lg:p-8">
								<Skeleton className="mb-3 h-4 w-28 bg-[#E7D0AF]/45" />
								<Skeleton className="mb-6 h-8 w-full max-w-[280px] bg-[#E7D0AF]/45 sm:mb-8" />

								<div className="space-y-4 sm:space-y-5">
									{["phone", "email", "address", "working-hours"].map(
										(item) => (
											<div
												key={item}
												className="flex min-w-0 gap-3 border border-[#E7D0AF] bg-[#FAF7F0] p-4 sm:gap-4"
											>
												<Skeleton className="size-10 shrink-0 bg-[#342312]/25 sm:size-11" />

												<div className="min-w-0 flex-1">
													<Skeleton className="mb-2 h-3 w-24 bg-[#E7D0AF]/45" />
													<Skeleton className="h-4 w-full bg-[#E7D0AF]/35" />
													<Skeleton className="mt-2 h-4 w-3/4 bg-[#E7D0AF]/35" />
												</div>
											</div>
										),
									)}
								</div>
							</div>

							<div className="border border-[#342312] bg-[#342312] p-5 shadow-[0_18px_50px_rgba(52,35,18,0.16)] sm:p-7 lg:p-8">
								<Skeleton className="mb-5 h-7 w-44 bg-[#E7D0AF]/25 sm:mb-6" />

								<div className="flex flex-wrap gap-3">
									{["social-1", "social-2", "social-3"].map((item) => (
										<Skeleton
											key={item}
											className="size-11 bg-[#E7D0AF]/20"
										/>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

function FormFieldSkeleton() {
	return (
		<div>
			<Skeleton className="mb-2 h-4 w-24 bg-[#E7D0AF]/45" />
			<Skeleton className="h-11 w-full bg-[#E7D0AF]/35 sm:h-12" />
		</div>
	);
}