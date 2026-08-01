import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import type { Service } from "src/server/services";
import { getServiceById } from "src/server/services";

interface RelatedServiceCardProps {
	serviceId: string;
	locale: Locale;
}

export default async function RelatedServiceCard({ serviceId, locale }: RelatedServiceCardProps) {
	const service: Service | null = await getServiceById(serviceId);

	if (!service) return null;

	const dictionary = getDictionary(locale);

	const serviceName = service.name[locale];
	const mobileServiceLabel = locale === "vi" ? "Giải pháp kỹ thuật" : "Technical solution";
	const mobileViewLabel = locale === "vi" ? "Xem giải pháp" : "View solution";
	const mainImage = service.gallery?.find((img) => img.isMain) || service.gallery?.[0];

	return (
		<Link
			href={`/${locale}/services/${serviceId}`}
			className="group block h-full min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A87E3C] focus-visible:ring-offset-2"
		>
			<article className="relative h-full min-w-0 overflow-hidden border border-[#342312]/10 bg-[#FAF7F0] shadow-[0_12px_36px_rgba(52,35,18,0.08)] md:h-[360px] md:border-0 md:bg-[#342312] md:shadow-none lg:h-[390px]">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(to_right,#342312_1px,transparent_1px),linear-gradient(to_bottom,#342312_1px,transparent_1px)] [background-size:24px_24px] md:hidden"
				/>

				<div className="relative z-10 aspect-[16/10] w-full overflow-hidden sm:aspect-[16/9] md:absolute md:inset-0 md:aspect-auto">
					<Image
						src={mainImage?.url || "/placeholder.svg"}
						alt={serviceName}
						fill
						sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1023px) 50vw, 33vw"
						className="object-cover transition duration-700 ease-out motion-reduce:transition-none md:group-hover:scale-[1.045] md:motion-reduce:group-hover:scale-100"
					/>

					<div className="absolute inset-0 bg-gradient-to-t from-[#342312]/10 via-transparent to-transparent md:from-[#160E06]/92 md:via-[#160E06]/36 md:to-transparent md:transition md:duration-500 md:group-hover:from-[#160E06]/96 md:group-hover:via-[#160E06]/48" />
				</div>

				<div className="pointer-events-none absolute inset-0 hidden border border-white/10 transition duration-500 motion-reduce:transition-none md:block md:group-hover:border-[#E7D0AF]/55" />

				<div className="relative z-10 flex min-h-[200px] flex-col p-5 sm:min-h-[210px] sm:p-6 md:absolute md:inset-0 md:block md:min-h-0 md:p-0">
					<div className="flex min-w-0 items-center gap-2 md:absolute md:left-6 md:top-6 md:gap-3">
						<span className="h-px w-8 shrink-0 bg-[#342312]/20 md:bg-[#E7D0AF]/85" />

						<p className="min-w-0 truncate text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B5137] md:tracking-[0.24em] md:text-[#E7D0AF]">
							<span className="md:hidden">{mobileServiceLabel}</span>
							<span className="hidden md:inline">{dictionary.services.service}</span>
						</p>
					</div>

					<div className="relative flex flex-1 flex-col md:absolute md:inset-x-0 md:bottom-0 md:block md:p-6 lg:p-7">
						<div className="flex min-w-0 items-stretch gap-4 py-5 md:block md:py-0">
							<span aria-hidden="true" className="w-[2px] shrink-0 bg-[#B99354] md:hidden" />

							<h3 className="min-w-0 max-w-2xl break-words text-[24px] font-black uppercase leading-[1.16] tracking-[0.01em] text-[#342312] md:line-clamp-none md:text-[34px] md:leading-[1.12] md:tracking-[0.03em] md:text-white lg:text-[38px]">
								{serviceName}
							</h3>
						</div>

						<div className="mt-auto flex items-center justify-between gap-3 border-t border-[#342312]/10 pt-4 md:mt-6 md:gap-4 md:border-white/20 md:px-0 md:pt-4">
							<span className="min-w-0 truncate text-[12px] font-bold uppercase tracking-[0.14em] text-[#342312] md:tracking-[0.16em] md:text-[#E7D0AF]">
								<span className="md:hidden">{mobileViewLabel}</span>
								<span className="hidden md:inline">{dictionary.services.viewDetail}</span>
							</span>

							<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F1E5D2]/75 text-[#8F672E] transition duration-500 motion-reduce:transition-none md:size-10 md:border md:border-[#E7D0AF]/55 md:bg-transparent md:text-[#E7D0AF] md:group-hover:border-[#E7D0AF] md:group-hover:bg-[#E7D0AF] md:group-hover:text-[#342312]">
								<ArrowRight className="size-4 transition-transform duration-500 motion-reduce:transition-none md:group-hover:translate-x-2" />
							</span>
						</div>
					</div>
				</div>
			</article>
		</Link>
	);
}
