import { ArrowUpRight } from "lucide-react";
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
	const mainImage = service.gallery?.find((img) => img.isMain) || service.gallery?.[0];

	return (
		<Link href={`/${locale}/services/${serviceId}`} className="group block h-full">
			<article className="relative h-[270px] overflow-hidden bg-[#342312] sm:h-[360px] lg:h-[390px]">
				<Image
					src={mainImage?.url || "/placeholder.svg"}
					alt={serviceName}
					fill
					className="object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
				/>

				<div className="absolute inset-0 bg-gradient-to-t from-[#160E06]/92 via-[#160E06]/36 to-transparent transition duration-500 group-hover:from-[#160E06]/96 group-hover:via-[#160E06]/48" />
				<div className="absolute inset-0 border border-white/10 transition duration-500 group-hover:border-[#E7D0AF]/55" />

				<div className="absolute left-3 top-3 flex items-center gap-2 sm:left-6 sm:top-6 sm:gap-3">
					<span className="h-px w-5 bg-[#E7D0AF]/85 sm:w-8" />

					<p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#E7D0AF] sm:text-[11px] sm:tracking-[0.24em]">
						{dictionary.services.service}
					</p>
				</div>

				<div className="absolute inset-x-0 bottom-0 p-3 sm:p-6 lg:p-7">
					<h3 className="line-clamp-3 max-w-[92%] text-[16px] font-black uppercase leading-[1.18] tracking-[0.01em] text-white sm:line-clamp-none sm:text-[34px] sm:leading-[1.12] sm:tracking-[0.03em] lg:text-[38px]">
						{serviceName}
					</h3>

					<div className="mt-3 flex items-center justify-between gap-2 border-t border-white/16 pt-3 sm:mt-6 sm:gap-4 sm:pt-4">
						<span className="line-clamp-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#E7D0AF] opacity-90 sm:line-clamp-none sm:text-xs sm:tracking-[0.16em]">
							{dictionary.services.viewDetail}
						</span>

						<span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[#E7D0AF]/45 text-[#E7D0AF] transition duration-500 group-hover:border-[#E7D0AF] group-hover:bg-[#E7D0AF] group-hover:text-[#342312] sm:size-10">
							<ArrowUpRight className="size-3.5 transition duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-4" />
						</span>
					</div>
				</div>
			</article>
		</Link>
	);
}
