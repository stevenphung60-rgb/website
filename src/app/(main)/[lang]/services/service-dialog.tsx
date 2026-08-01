import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "src/components/ui/card";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import type { Service } from "src/server/services";
import { getServiceById } from "src/server/services";

interface ServiceDialogProps {
	serviceId: string;
	locale: Locale;
	index?: number;
}

export default async function ServiceDialog({ serviceId, locale, index = 0 }: ServiceDialogProps) {
	const service: Service | null = await getServiceById(serviceId);

	if (!service) {
		return <NotFoundServiceDialog locale={locale} />;
	}

	const dictionary = getDictionary(locale);
	const serviceName = service.name[locale];
	const mobileServiceLabel = locale === "vi" ? "Giải pháp kỹ thuật" : "Technical solution";
	const mobileViewLabel = locale === "vi" ? "Xem giải pháp" : "View solution";

	const mainImage = service.gallery?.find((img) => img.isMain) || service.gallery?.[0];

	const isReversed = index % 2 === 1;

	return (
		<Link
			href={`/${locale}/services/${serviceId}`}
			className="group block h-full min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A87E3C] focus-visible:ring-offset-2"
			data-testid="service-card"
		>
			<Card className="relative grid h-full min-w-0 gap-0 overflow-hidden rounded-none border border-[#342312]/10 bg-[#FAF7F0] py-0 shadow-[0_12px_36px_rgba(52,35,18,0.08)] transition-all duration-500 motion-reduce:transition-none md:h-auto md:gap-6 md:border-[#342312]/15 md:bg-[#F7F1E6] md:shadow-sm md:hover:-translate-y-1 md:hover:border-[#342312]/35 md:hover:shadow-[0_24px_70px_rgba(0,0,0,0.16)] md:motion-reduce:hover:translate-y-0 lg:h-[420px] lg:grid-cols-2 xl:h-[460px]">
				<div className="pointer-events-none absolute left-0 top-0 z-20 hidden h-[3px] w-full origin-left bg-[#342312] md:block md:scale-x-0 md:transition-transform md:duration-500 md:group-hover:scale-x-100 md:motion-reduce:transition-none" />
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(to_right,#342312_1px,transparent_1px),linear-gradient(to_bottom,#342312_1px,transparent_1px)] [background-size:24px_24px] md:hidden"
				/>

				<div
					className={`relative z-10 aspect-[16/10] w-full overflow-hidden sm:aspect-[16/9] md:aspect-[16/8] lg:aspect-auto lg:h-full ${
						isReversed ? "lg:order-2" : "lg:order-1"
					}`}
				>
					<Image
						src={mainImage?.url || "/placeholder.svg"}
						alt={serviceName}
						width={1200}
						height={850}
						sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1023px) calc(100vw - 3rem), 50vw"
						className="h-full w-full object-cover transition-all duration-700 motion-reduce:transition-none md:grayscale-[12%] md:group-hover:scale-105 md:group-hover:grayscale-0 md:motion-reduce:group-hover:scale-100"
					/>

					<div className="absolute inset-0 bg-gradient-to-t from-[#342312]/10 via-transparent to-transparent md:bg-[#342312]/10 md:transition-colors md:duration-500 md:group-hover:bg-transparent" />
				</div>

				<CardContent
					className={`relative z-10 flex min-h-[200px] min-w-0 flex-col overflow-visible p-5 sm:min-h-[210px] sm:p-6 md:min-h-[280px] md:justify-between md:overflow-hidden md:p-8 lg:h-full lg:min-h-0 lg:p-10 xl:p-12 ${
						isReversed ? "lg:order-1" : "lg:order-2"
					}`}
				>
					<div className="flex min-w-0 items-center gap-2 md:gap-4">
						<span className="h-px w-8 shrink-0 bg-[#342312]/20 md:w-12 md:bg-[#A87E3C]" />

						<p className="min-w-0 truncate text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B5137] md:text-[14px] md:tracking-[0.3em] md:text-[#A87E3C]">
							<span className="md:hidden">{mobileServiceLabel}</span>
							<span className="hidden md:inline">{dictionary.services.service}</span>
						</p>
					</div>

					<div className="flex min-w-0 items-stretch gap-4 py-5 md:block md:py-10 lg:py-0">
						<span className="w-[2px] shrink-0 bg-[#B99354] md:hidden" />

						<h2 className="min-w-0 max-w-2xl break-words text-[24px] font-black uppercase leading-[1.16] tracking-[0.01em] text-[#342312] transition-colors duration-300 md:line-clamp-none md:text-[42px] md:leading-[1.12] md:tracking-[0.03em] md:group-hover:text-[#A87E3C] lg:text-[48px] xl:text-[56px]">
							{serviceName}
						</h2>
					</div>

					<div className="mt-auto flex w-full max-w-full items-center justify-between gap-3 border-t border-[#342312]/10 pt-4 text-[12px] font-bold uppercase tracking-[0.14em] text-[#342312] md:inline-flex md:w-fit md:justify-start md:gap-3 md:border-t-0 md:pt-0 md:text-sm md:tracking-[0.18em]">
						<span className="min-w-0 truncate">
							<span className="md:hidden">{mobileViewLabel}</span>
							<span className="hidden md:inline">{dictionary.services.viewDetail}</span>
						</span>

						<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F1E5D2]/75 text-[#8F672E] md:size-auto md:bg-transparent md:text-[#342312]">
							<ArrowRight className="size-4 transition-transform duration-500 motion-reduce:transition-none md:group-hover:translate-x-2" />
						</span>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}

function NotFoundServiceDialog({ locale }: { locale: Locale }) {
	const dictionary = getDictionary(locale);

	return (
		<Card className="h-full gap-0 rounded-none border border-[#342312]/15 py-0 md:gap-6">
			<div className="flex aspect-video items-center justify-center bg-muted">
				<p className="text-muted-foreground">{dictionary.services.notFound.title}</p>
			</div>

			<CardContent className="p-3 md:p-6">
				<CardTitle className="text-base font-bold text-foreground md:text-xl">
					{dictionary.services.notFound.title}
				</CardTitle>
			</CardContent>
		</Card>
	);
}
