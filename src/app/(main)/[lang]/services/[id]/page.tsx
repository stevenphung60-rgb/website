import { ArrowRight, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScrollToTopHandler from "src/components/scroll-to-top-handler";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import { getContactInfo } from "src/server/contact";
import { getActiveServiceIds, getServiceById } from "src/server/services";
import RelatedServiceCard from "./related-service-card";
import RelatedServicesCarousel from "./related-services-carousel";
import ServiceGalleryMarquee from "./service-gallery-marquee";

interface ServiceDetailPageProps {
	params: Promise<{
		lang: Locale;
		id: string;
	}>;
}

export default async function ServiceDetailPage({
	params,
}: ServiceDetailPageProps) {
	const { lang: locale, id } = await params;

	const service = await getServiceById(id);

	if (!service) {
		notFound();
	}

	const dictionary = getDictionary(locale);
	const contactInfo = await getContactInfo();

	const serviceName = service.name[locale];
	const serviceDescription = service.description[locale];

	const galleryImages = service.gallery || [];
	const mainImage =
		service.gallery?.find((img) => img.isMain) || service.gallery?.[0];

	const serviceIds = await getActiveServiceIds();
	const relatedServiceIds = serviceIds.filter((serviceId) => serviceId !== id);

	return (
		<main className="w-full overflow-x-hidden bg-[#FAF7F0]">
			<ScrollToTopHandler />

			<section className="absolute left-0 top-0 z-20 w-full py-5 sm:py-6">
				<div className="w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
					<div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/70 sm:text-sm">
						<Link
							href={`/${locale}`}
							className="shrink-0 transition-colors hover:text-[#E7D0AF]"
						>
							{dictionary.nav.home}
						</Link>

						<span className="shrink-0">/</span>

						<Link
							href={`/${locale}/services`}
							className="shrink-0 transition-colors hover:text-[#E7D0AF]"
						>
							{dictionary.nav.services}
						</Link>

						<span className="shrink-0">/</span>

						<span className="min-w-0 break-words text-white">
							{serviceName}
						</span>
					</div>
				</div>
			</section>

			<section className="relative min-h-[560px] overflow-hidden bg-[#342312] sm:min-h-[620px] lg:min-h-[620px]">
				<Image
					src={mainImage?.url || "/placeholder.svg"}
					alt={serviceName}
					fill
					priority
					className="animate-hero-image object-cover grayscale-[8%]"
				/>

				<div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/55 to-black/20" />
				<div className="absolute inset-0 bg-gradient-to-t from-black/78 via-transparent to-black/25" />
				<div className="absolute inset-0 bg-[#342312]/15" />

				<div className="relative z-10 grid min-h-[560px] place-items-center sm:min-h-[620px] lg:min-h-[620px]">
					<div className="w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
						<div className="max-w-6xl">
							<div
								className="animate-hero-content mb-5 flex items-center gap-3 sm:mb-6 sm:gap-4"
								style={{ animationDelay: "0.2s" }}
							>
								<span className="h-px w-9 bg-[#E7D0AF] sm:w-12" />

								<p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#E7D0AF] sm:text-xs sm:tracking-[0.36em]">
									{dictionary.nav.services}
								</p>
							</div>

							<h1
								className="animate-hero-content max-w-6xl break-words text-[38px] font-black uppercase leading-[1.1] tracking-[-0.035em] text-white sm:text-[58px] sm:leading-[1.08] lg:text-[72px] lg:leading-[1.06] xl:text-[82px] 2xl:text-[90px]"
								style={{ animationDelay: "0.4s" }}
							>
								{serviceName}
							</h1>
						</div>
					</div>
				</div>
			</section>

			<section
				className="animate-fade-up py-12 sm:py-16 lg:py-20"
				style={{ animationDelay: "0.15s" }}
			>
				<div className="w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
					<div className="grid gap-x-8 gap-y-8 lg:grid-cols-[390px_minmax(0,1fr)] lg:items-start lg:gap-x-14 xl:grid-cols-[460px_minmax(0,1fr)] xl:gap-x-20 2xl:grid-cols-[500px_minmax(0,1fr)]">
						<div className="min-w-0 lg:col-start-1 lg:row-start-1">
							<h2 className="text-[36px] font-black uppercase leading-[1.05] tracking-[-0.04em] text-[#342312] sm:text-[52px] lg:text-[58px] xl:text-[64px]">
								{dictionary.services.serviceOverview}
							</h2>

							<div className="mt-6 h-[3px] w-16 bg-[#A87E3C] sm:mt-8 sm:w-20" />
						</div>

						<div className="min-w-0 lg:col-start-2 lg:row-start-2">
							<div className="whitespace-pre-line text-base leading-8 text-[#342312]/75 sm:text-xl sm:leading-[1.9] lg:text-[20px] lg:leading-[1.9]">
								{serviceDescription}
							</div>
						</div>

						<div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-start-1 lg:row-start-2 lg:items-start">
							{contactInfo.phone1 && (
								<a
									href={`tel:${contactInfo.phone1}`}
									className="group relative inline-flex w-full items-center justify-center gap-3 whitespace-nowrap rounded-full bg-[#342312] px-6 py-3 text-sm font-semibold text-[#E7D0AF] transition hover:-translate-y-0.5 sm:w-auto sm:px-8 sm:text-base lg:w-fit"
								>
									<Phone className="size-5 group-hover:animate-shake" />

									<span className="relative">
										{contactInfo.phone1}
										<span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#E7D0AF] transition-transform duration-500 group-hover:scale-x-100" />
									</span>
								</a>
							)}

							<Link
								href={`/${locale}/contact`}
								className="group inline-flex w-full items-center justify-center gap-3 whitespace-nowrap rounded-full bg-[#E7D0AF] px-6 py-3 text-sm font-semibold text-[#342312] transition hover:-translate-y-0.5 sm:w-auto sm:px-8 sm:text-base lg:w-fit"
							>
								<span className="relative">
									{dictionary.hero.buttons.contactConsultation}
									<span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-[#342312] transition-all duration-500 group-hover:w-full" />
								</span>

								<ArrowRight className="size-5 transition group-hover:translate-x-1" />
							</Link>
						</div>
					</div>
				</div>
			</section>

			{galleryImages.length > 1 && (
				<>
					<section
						className="animate-fade-up pt-0"
						style={{ animationDelay: "0.3s" }}
					>
						<div className="w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
							<div className="mb-4 flex items-center gap-3 sm:mb-5 sm:gap-4 lg:mb-6">
								<span className="h-px w-9 bg-[#A87E3C] sm:w-12" />

								<h2 className="text-[13px] font-black uppercase tracking-[0.24em] text-[#A87E3C] sm:text-[16px] sm:tracking-[0.32em]">
									{dictionary.services.serviceGallery}
								</h2>
							</div>
						</div>
					</section>

					<div
						className="max-w-full overflow-x-hidden animate-fade-up"
						style={{ animationDelay: "0.45s" }}
					>
						<ServiceGalleryMarquee
							images={galleryImages}
							serviceName={serviceName}
						/>
					</div>
				</>
			)}

			{relatedServiceIds.length > 0 && (
				<section
					className="animate-fade-up pb-16 pt-0 sm:pb-24 sm:pt-0 lg:pt-0"
					style={{ animationDelay: "0.6s" }}
				>
					<div className="w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
						<div className="mb-4 flex items-center gap-3 sm:mb-5 sm:gap-4 lg:mb-6">
							<span className="h-px w-9 bg-[#A87E3C] sm:w-12" />

							<h2 className="text-[13px] font-black uppercase tracking-[0.24em] text-[#A87E3C] sm:text-[16px] sm:tracking-[0.32em]">
								{dictionary.services.otherServices}
							</h2>
						</div>

						<RelatedServicesCarousel itemCount={relatedServiceIds.length}>
							{relatedServiceIds.map((serviceId) => (
								<RelatedServiceCard
									key={serviceId}
									serviceId={serviceId}
									locale={locale}
								/>
							))}
						</RelatedServicesCarousel>
					</div>
				</section>
			)}
		</main>
	);
}