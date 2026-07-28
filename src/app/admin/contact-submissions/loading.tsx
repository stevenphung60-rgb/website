import { Skeleton } from "src/components/ui/skeleton";

export default function ContactSubmissionsLoading() {
	return (
		<div className="w-full space-y-6">
			<div className="rounded-2xl border border-[#E7D0AF] bg-white px-6 py-5">
				<div className="flex items-center gap-4">
					<Skeleton className="size-11 rounded-xl" />
					<div className="space-y-2">
						<Skeleton className="h-3 w-28" />
						<Skeleton className="h-7 w-48" />
						<Skeleton className="h-4 w-72 max-w-full" />
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{["total", "new", "contacted", "resolved"].map((item) => (
					<div key={item} className="rounded-xl border border-[#E7D0AF] bg-white p-5">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="mt-3 h-8 w-14" />
					</div>
				))}
			</div>

			<div className="rounded-2xl border border-[#E7D0AF] bg-white p-5">
				<Skeleton className="h-10 w-full" />
			</div>

			<div className="overflow-hidden rounded-xl border border-[#E7D0AF] bg-white">
				{["one", "two", "three", "four", "five"].map((item) => (
					<div
						key={item}
						className="flex items-center gap-4 border-b border-[#E7D0AF]/70 p-5 last:border-b-0"
					>
						<Skeleton className="size-11 shrink-0 rounded-xl" />
						<div className="min-w-0 flex-1 space-y-2">
							<Skeleton className="h-4 w-44 max-w-full" />
							<Skeleton className="h-3 w-64 max-w-full" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
