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

export default async function RelatedServiceCard({
	serviceId,
	locale,
}: RelatedServiceCardProps) {
	const service: Service | null = await getServiceById(serviceId);

	if (!service) return null;

	const dictionary = getDictionary(locale);

	const serviceName = service.name[locale];
	const mainImage =
		service.gallery?.find((img) => img.isMain) || service.gallery?.[0];

	return (
		<Link
			href={`/${locale}/services/${serviceId}`}
			className="group block h-full"
		>
			<article className="relative h-[320px] overflow-hidden bg-[#342312] sm:h-[360px] lg:h-[390px]">
				<Image
					src={mainImage?.url || "/placeholder.svg"}
					alt={serviceName}
					fill
					className="object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
				/>

				<div className="absolute inset-0 bg-gradient-to-t from-[#160E06]/92 via-[#160E06]/36 to-transparent transition duration-500 group-hover:from-[#160E06]/96 group-hover:via-[#160E06]/48" />
				<div className="absolute inset-0 border border-white/10 transition duration-500 group-hover:border-[#E7D0AF]/55" />

				<div className="absolute left-5 top-5 flex items-center gap-3 sm:left-6 sm:top-6">
					<span className="h-px w-8 bg-[#E7D0AF]/85" />

					<p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#E7D0AF]">
						{dictionary.services.service}
					</p>
				</div>

				<div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7">
					<h3 className="max-w-[92%] text-[28px] font-black uppercase leading-[1.02] tracking-[-0.04em] text-white sm:text-[34px] lg:text-[38px]">
						{serviceName}
					</h3>

					<div className="mt-6 flex items-center justify-between gap-4 border-t border-white/16 pt-4">
						<span className="text-xs font-bold uppercase tracking-[0.16em] text-[#E7D0AF] opacity-90">
							{dictionary.services.viewDetail}
						</span>

						<span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[#E7D0AF]/45 text-[#E7D0AF] transition duration-500 group-hover:border-[#E7D0AF] group-hover:bg-[#E7D0AF] group-hover:text-[#342312]">
							<ArrowUpRight className="size-4 transition duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
						</span>
					</div>
				</div>
			</article>
		</Link>
	);
}