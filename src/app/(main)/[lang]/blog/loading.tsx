/**
 * Blog page loading skeleton.
 * @returns Blog page skeleton while server data is loading
 */
export default function BlogLoading() {
	return (
		<main className="min-h-screen bg-[#FAF7F1] text-[#342312]">
			<section className="border-b border-[#E7D0AF] px-4 pb-10 pt-14 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
				<div className="mx-auto max-w-[1480px] animate-pulse">
					<div className="h-4 w-28 rounded bg-[#E7D0AF]" />
					<div className="mt-10 h-4 w-20 rounded bg-[#E7D0AF]" />
					<div className="mt-4 h-20 w-64 rounded bg-[#E7D0AF]/70 sm:w-96" />
				</div>
			</section>

			<section className="px-4 py-10 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
				<div className="mx-auto grid max-w-[1480px] gap-9 lg:grid-cols-[minmax(0,1fr)_340px]">
					<div className="space-y-12">
						<div className="animate-pulse">
							<div className="mb-5 h-5 w-40 rounded bg-[#E7D0AF]" />
							<div className="grid overflow-hidden border border-[#E7D0AF] bg-white lg:grid-cols-2">
								<div className="min-h-[360px] bg-[#E7D0AF]/55" />
								<div className="space-y-5 p-8">
									<div className="h-4 w-32 rounded bg-[#E7D0AF]" />
									<div className="h-16 w-full rounded bg-[#E7D0AF]/70" />
									<div className="h-24 w-full rounded bg-[#E7D0AF]/45" />
								</div>
							</div>
						</div>

						<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
							{Array.from({ length: 6 }).map((_, index) => (
								<div key={index} className="animate-pulse border border-[#E7D0AF] bg-white">
									<div className="aspect-[16/10] bg-[#E7D0AF]/55" />
									<div className="space-y-4 p-5">
										<div className="h-4 w-24 rounded bg-[#E7D0AF]" />
										<div className="h-12 rounded bg-[#E7D0AF]/70" />
										<div className="h-16 rounded bg-[#E7D0AF]/40" />
									</div>
								</div>
							))}
						</div>
					</div>

					<aside className="hidden space-y-5 lg:block">
						{Array.from({ length: 3 }).map((_, index) => (
							<div key={index} className="animate-pulse border border-[#E7D0AF] bg-white p-6">
								<div className="h-6 w-40 rounded bg-[#E7D0AF]" />
								<div className="mt-5 space-y-3">
									{Array.from({ length: 5 }).map((__, itemIndex) => (
										<div key={itemIndex} className="h-9 rounded bg-[#E7D0AF]/45" />
									))}
								</div>
							</div>
						))}
					</aside>
				</div>
			</section>
		</main>
	);
}
