export default function BlogLoading() {
	return (
		<main className="bg-[#FAF7F1] px-4 py-10 text-[#342312] sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
			<div className="mx-auto max-w-[1560px] animate-pulse space-y-8">
				<div className="h-5 w-40 rounded bg-[#E7D0AF]/60" />
				<div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
					<div className="space-y-10">
						<div className="h-[360px] border border-[#E7D0AF] bg-white" />
						<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
							{Array.from({ length: 6 }).map((_, index) => (
								<div key={index} className="h-[380px] border border-[#E7D0AF] bg-white" />
							))}
						</div>
					</div>
					<div className="hidden space-y-6 lg:block">
						<div className="h-72 border border-[#E7D0AF] bg-white" />
						<div className="h-72 border border-[#E7D0AF] bg-white" />
						<div className="h-40 border border-[#E7D0AF] bg-white" />
					</div>
				</div>
			</div>
		</main>
	);
}
