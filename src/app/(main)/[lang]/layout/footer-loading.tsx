import { Skeleton } from "src/components/ui/skeleton";

export default function FooterLoading() {
	return (
		<footer className="relative w-full overflow-hidden bg-[#342312] text-[#E7D0AF]">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(168,126,60,0.24),transparent_30%),radial-gradient(circle_at_86%_72%,rgba(231,208,175,0.12),transparent_34%)]" />
			<div className="pointer-events-none absolute -right-8 top-10 hidden select-none font-serif text-[13vw] font-bold leading-none text-[#E7D0AF]/[0.035] lg:block">
				NH
			</div>

			<div className="relative w-full px-5 py-14 sm:px-8 lg:px-14 xl:px-20 2xl:px-28">
				<div className="grid gap-10 lg:grid-cols-12 lg:items-end">
					<div className="lg:col-span-4">
						<Skeleton className="h-16 w-56 bg-[#E7D0AF]/18" />
					</div>

					<div className="lg:col-span-8">
						<Skeleton className="mb-4 h-4 w-52 bg-[#A87E3C]/30" />
						<Skeleton className="h-12 w-full max-w-4xl bg-[#E7D0AF]/18" />
					</div>
				</div>

				<div className="mt-14 grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
					<div className="lg:col-span-4">
						<Skeleton className="mb-5 h-7 w-56 bg-[#E7D0AF]/18" />
						<div className="space-y-3">
							<Skeleton className="h-4 w-full bg-[#E7D0AF]/18" />
							<Skeleton className="h-4 w-11/12 bg-[#E7D0AF]/18" />
							<Skeleton className="h-4 w-4/5 bg-[#E7D0AF]/18" />
						</div>
					</div>

					<div className="lg:col-span-3">
						<Skeleton className="mb-6 h-4 w-40 bg-[#E7D0AF]/18" />
						<div className="space-y-5">
							{["address", "phone1", "phone2", "email1", "email2"].map((item) => (
								<div key={item} className="flex gap-3">
									<Skeleton className="size-4 shrink-0 bg-[#A87E3C]/30" />
									<Skeleton className="h-4 w-44 bg-[#E7D0AF]/18" />
								</div>
							))}
						</div>
					</div>

					<div className="lg:col-span-2">
						<Skeleton className="mb-6 h-4 w-32 bg-[#E7D0AF]/18" />
						<div className="space-y-4">
							{["about", "projects", "contact", "privacy"].map((item) => (
								<Skeleton key={item} className="h-4 w-28 bg-[#E7D0AF]/18" />
							))}
						</div>
					</div>

					<div className="lg:col-span-2">
						<Skeleton className="mb-6 h-4 w-36 bg-[#E7D0AF]/18" />
						<div className="space-y-4">
							{["products", "services"].map((item) => (
								<Skeleton key={item} className="h-4 w-28 bg-[#E7D0AF]/18" />
							))}
						</div>
					</div>

					<div className="lg:col-span-1">
						<Skeleton className="mb-6 h-4 w-24 bg-[#E7D0AF]/18" />
						<div className="space-y-4">
							{["facebook", "youtube", "linkedin"].map((item) => (
								<Skeleton key={item} className="h-4 w-20 bg-[#E7D0AF]/18" />
							))}
						</div>
					</div>
				</div>

				<div className="mt-14 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<Skeleton className="h-3 w-60 bg-[#E7D0AF]/18" />
					<Skeleton className="h-3 w-24 bg-[#E7D0AF]/18" />
				</div>
			</div>
		</footer>
	);
}