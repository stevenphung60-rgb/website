import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

export default async function ServiceDialog({
	serviceId,
	locale,
	index = 0,
}: ServiceDialogProps) {
	const service: Service | null = await getServiceById(serviceId);

	if (!service) {
		return <NotFoundServiceDialog locale={locale} />;
	}

	const dictionary = getDictionary(locale);
	const serviceName = service.name[locale];

	const mainImage =
		service.gallery?.find((img) => img.isMain) || service.gallery?.[0];

	const isReversed = index % 2 === 1;

	return (
		<Link href={`/${locale}/services/${serviceId}`} className="group block">
			<Card className="relative grid h-auto overflow-hidden rounded-none border border-[#342312]/15 bg-[#F7F1E6] py-0 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#342312]/35 hover:shadow-[0_24px_70px_rgba(0,0,0,0.16)] lg:h-[420px] lg:grid-cols-2 xl:h-[460px]">
				<div className="pointer-events-none absolute left-0 top-0 z-20 h-[3px] w-full origin-left scale-x-0 bg-[#342312] transition-transform duration-500 group-hover:scale-x-100" />

				<div
					className={`relative aspect-[4/3] overflow-hidden sm:aspect-[16/8] lg:aspect-auto lg:h-full ${
						isReversed ? "lg:order-2" : "lg:order-1"
					}`}
				>
					<Image
						src={mainImage?.url || "/placeholder.svg"}
						alt={serviceName}
						width={1200}
						height={850}
						className="h-full w-full object-cover grayscale-[12%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
					/>

					<div className="absolute inset-0 bg-[#342312]/10 transition-colors duration-500 group-hover:bg-transparent" />
				</div>

				<CardContent
					className={`flex min-h-[240px] flex-col justify-between overflow-hidden p-5 sm:min-h-[280px] sm:p-8 lg:h-full lg:min-h-0 lg:p-10 xl:p-12 ${
						isReversed ? "lg:order-1" : "lg:order-2"
					}`}
				>
					<div className="flex items-center gap-3 sm:gap-4">
						<span className="h-px w-8 bg-[#A87E3C] sm:w-12" />

						<p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#A87E3C] sm:text-[14px] sm:tracking-[0.3em]">
							{dictionary.services.service}
						</p>
					</div>

					<div className="py-8 sm:py-10 lg:py-0">
						<CardTitle className="max-w-2xl text-[30px] font-black uppercase leading-[1.02] tracking-[0.03em] text-[#342312] transition-colors duration-300 group-hover:text-[#A87E3C] sm:text-[42px] lg:text-[48px] xl:text-[56px]">
							{serviceName}
						</CardTitle>
					</div>

					<div className="inline-flex w-fit items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-[#342312] sm:text-sm sm:tracking-[0.18em]">
						<span>{dictionary.services.viewDetail}</span>

						<ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-2" />
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}

function NotFoundServiceDialog({ locale }: { locale: Locale }) {
	const dictionary = getDictionary(locale);

	return (
		<Card className="rounded-none border border-[#342312]/15 py-0">
			<div className="flex aspect-video items-center justify-center bg-muted">
				<p className="text-muted-foreground">
					{dictionary.services.notFound.title}
				</p>
			</div>

			<CardContent className="p-6">
				<CardTitle className="text-xl font-bold text-foreground">
					{dictionary.services.notFound.title}
				</CardTitle>
			</CardContent>
		</Card>
	);
}