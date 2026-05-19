import type { HeroInfo } from "src/app/admin/hero/hero.type";
import { cacheTag } from "next/cache";
import { CACHE_TAGS } from "src/lib/cache-tags";
import type { Locale } from "src/lib/i18n/config";
import { getActiveServiceIds, getServiceById } from "src/server/services";

import HomeServicesShowcase, {
	type HomeServiceShowcaseItem,
} from "./home-services-showcase";

interface HomeServicesSectionProps {
	locale: Locale;
	heroInfo?: HeroInfo;
}

export default async function HomeServicesSection({
	locale,
	heroInfo,
}: HomeServicesSectionProps) {
	"use cache";
	cacheTag(CACHE_TAGS.SERVICES);

	const serviceIds = await getActiveServiceIds();

	const serviceList = await Promise.all(
		serviceIds.map((serviceId) => getServiceById(serviceId)),
	);

	const lang = locale === "en" ? "en" : "vi";

	const services: HomeServiceShowcaseItem[] = serviceList
		.filter((service): service is NonNullable<(typeof serviceList)[number]> =>
			Boolean(service),
		)
		.map((service) => {
			const mainImage =
				service.gallery.find((image) => image.isMain) || service.gallery[0];

			return {
				id: service.id,
				name: service.name[lang] || service.name.vi || service.name.en,
				imageUrl: mainImage?.url || "",
			};
		});

	return (
		<HomeServicesShowcase
			locale={locale}
			services={services}
			title={heroInfo?.servicetitle?.[lang] || ""}
			description={heroInfo?.servicedesription?.[lang] || ""}
		/>
	);
}