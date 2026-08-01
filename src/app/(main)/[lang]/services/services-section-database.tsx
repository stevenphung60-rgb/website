/**
 * Server component that fetches services from database and renders the services section
 * Has the same structure as the static services-section.tsx
 */

import { cacheTag } from "next/cache";
import Link from "next/link";
import { type CSSProperties, Fragment } from "react";
import {
	EmptyStateCard,
	EmptyStateDescription,
	EmptyStateIcon,
	EmptyStateTitle,
} from "src/components/empty-state";
import { Button } from "src/components/ui/button";
import {
	ItemWrapper,
	StandardGridVisibilityController,
	ViewAllButton,
} from "src/components/visibility";
import { CACHE_TAGS } from "src/lib/cache-tags";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import { getActiveServiceIds, getServiceById } from "src/server/services";
import ServiceDialog from "./service-dialog";
import { ServiceListNavigation } from "./service-list-navigation";
import { ServiceMobileNavigation } from "./service-mobile-navigation";
import {
	ServiceMobilePageIndicator,
	ServiceMobilePaginationController,
	ServiceMobilePaginationControls,
	ServiceMobilePaginationItem,
} from "./service-mobile-pagination";

interface ServicesSectionDatabaseProps {
	locale: Locale;
	viewAll?: boolean;
}

/**
 * Server component that fetches services from database
 * Supports row limiting with "View All" button on homepage
 * @param locale - The current locale for internationalization
 * @param viewAll - Whether to view all items without row limiting (optional, for dedicated pages)
 */
export default async function ServicesSectionDatabase({
	locale,
	viewAll,
}: ServicesSectionDatabaseProps) {
	"use cache";
	cacheTag(CACHE_TAGS.SERVICES);

	const serviceIds: string[] = await getActiveServiceIds();
	const dictionary = getDictionary(locale);

	const services = await Promise.all(serviceIds.map((serviceId) => getServiceById(serviceId)));

	const availableServices = services.filter(
		(service): service is NonNullable<(typeof services)[number]> => service !== null,
	);
	const availableServiceIds = availableServices.map((service) => service.id);

	const serviceNavigationItems = availableServices
		.map((service) => {
			const mainImage = service.gallery?.find((image) => image.isMain) ?? service.gallery?.[0];

			return {
				id: service.id,
				imageUrl: mainImage?.url,
				name: service.name?.[locale] ?? service.name?.en ?? "",
			};
		})
		.filter((service) => service.name);

	return (
		// biome-ignore lint/correctness/useUniqueElementIds: Fixed ID needed for navigation anchor links
		<section id="services" className="w-full bg-muted/30 py-12 sm:py-16 lg:py-20">
			<div className="w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
				{availableServiceIds.length > 0 ? (
					viewAll ? (
						<ServiceMobilePaginationController serviceIds={availableServiceIds}>
							<ServiceMobileNavigation locale={locale} items={serviceNavigationItems} />

							<div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
								<div
									data-testid="service-list-navigation"
									className="hidden w-full md:block lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:w-[300px] lg:shrink-0 lg:self-start lg:overflow-y-auto lg:pr-2"
								>
									<ServiceListNavigation locale={locale} items={serviceNavigationItems} />
								</div>

								{/* biome-ignore lint/correctness/useUniqueElementIds: Stable target for mobile pagination scroll restoration. */}
								<div id="services-list-start" className="min-w-0 flex-1">
									<ServiceMobilePageIndicator locale={locale} />

									<div
										data-testid="service-list-grid"
										className="grid grid-cols-1 gap-6 md:block md:space-y-8 lg:space-y-10"
									>
										{availableServiceIds.map((serviceId, index) => (
											<ServiceMobilePaginationItem key={serviceId} id={serviceId}>
												<div
													id={`service-card-${serviceId}`}
													data-service-id={serviceId}
													className="service-card-reveal h-full min-w-0 scroll-mt-[120px] [animation-delay:var(--service-mobile-animation-delay)] md:scroll-mt-[140px] md:[animation-delay:var(--service-desktop-animation-delay)] lg:scroll-mt-[180px]"
													style={
														{
															"--service-mobile-animation-delay": `${(index % 12) * 140}ms`,
															"--service-desktop-animation-delay": `${index * 140}ms`,
														} as CSSProperties
													}
												>
													<ServiceDialog serviceId={serviceId} locale={locale} index={index} />
												</div>
											</ServiceMobilePaginationItem>
										))}
									</div>

									<ServiceMobilePaginationControls locale={locale} />
								</div>
							</div>
						</ServiceMobilePaginationController>
					) : (
						<StandardGridVisibilityController itemIds={availableServiceIds} limitRows>
							<Fragment key="service-list-preview">
								<div
									data-testid="service-list-grid"
									className="grid grid-cols-1 gap-6 md:block md:space-y-8 lg:space-y-10"
								>
									{availableServiceIds.map((serviceId, index) => (
										<ItemWrapper key={serviceId} id={serviceId}>
											<div
												className="service-card-reveal h-full min-w-0"
												style={{
													animationDelay: `${index * 140}ms`,
												}}
											>
												<ServiceDialog serviceId={serviceId} locale={locale} index={index} />
											</div>
										</ItemWrapper>
									))}
								</div>

								<ViewAllButton>
									<Button asChild variant="outline" size="lg">
										<Link href={`/${locale}/services`}>{dictionary.services.viewAll}</Link>
									</Button>
								</ViewAllButton>
							</Fragment>
						</StandardGridVisibilityController>
					)
				) : (
					<EmptyStateCard>
						<EmptyStateIcon>🔧</EmptyStateIcon>

						<EmptyStateTitle>{dictionary.services.empty.title}</EmptyStateTitle>

						<EmptyStateDescription>{dictionary.services.empty.description}</EmptyStateDescription>
					</EmptyStateCard>
				)}
			</div>
		</section>
	);
}
