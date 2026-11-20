import { Mail, Phone } from "lucide-react";
import { cacheTag } from "next/cache";
import LocaleLink from "src/components/behaviors/LocaleLink";
import { LanguageSwitcher } from "src/components/language-toggle";
import { CACHE_TAGS } from "src/lib/cache-tags";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import { getContactInfo } from "src/server/contact";
import { getHeroBrandInfo } from "src/server/herobrand";
import { getActiveProductIds, getProductById } from "src/server/products";
import { getProductCategoryById } from "src/server/productcategories/get-productcategory-by-id.query";
import { getActiveProductCategoryIds } from "src/server/productcategories/get-productcategory-ids.query";
import { getProjectCategoryById } from "src/server/projectcategories/get-projectcategory-by-id.query";
import { getActiveProjectCategoryIds } from "src/server/projectcategories/get-projectcategory-ids.query";
import { getActiveProjectIds, getProjectById } from "src/server/projects";
import { getActiveServiceIds, getServiceById } from "src/server/services";
import { HeaderNavClient } from "./header-nav-client";
import { HeaderScrollShell } from "./header-scroll-shell";
import { HeaderSearch } from "./header-search";
import { MobileHeader } from "./mobile-header";

export default async function Header({ locale }: { locale: Locale }) {
	"use cache";

	cacheTag(CACHE_TAGS.CONTACT);
	cacheTag(CACHE_TAGS.HEROBRAND);

	const contactInfo = await getContactInfo();
	const heroBrandInfo = await getHeroBrandInfo();
	const dictionary = getDictionary(locale);

	const brandLogo = heroBrandInfo.logo?.url?.trim() || "";
	const brandCompanyName = heroBrandInfo.companyName?.[locale]?.trim() || "";

	const productCategoryIds = await getActiveProductCategoryIds();

	const productCategories = (
		await Promise.all(
			productCategoryIds.map((id) => getProductCategoryById(id)),
		)
	).filter(
		(category): category is NonNullable<typeof category> => category !== null,
	);

	const productIds = await getActiveProductIds();

	const products = (
		await Promise.all(productIds.map((id) => getProductById(id)))
	).filter((product): product is NonNullable<typeof product> => product !== null);

	const productMenu = productCategories.map((category) => {
		const categoryName = category.name?.[locale] ?? "";
		const categoryFilterId = category.id;

		const productsInCategory = products
			.filter((product) => product.categoryId === category.id)
			.sort((a, b) => {
				const dateA = new Date(a.createdAt).getTime();
				const dateB = new Date(b.createdAt).getTime();

				return dateA - dateB;
			})
			.slice(0, 2)
			.map((product) => {
				const mainImage =
					product.gallery?.find((img) => img.isMain) || product.gallery?.[0];

				return {
					id: product.id,
					name: product.name?.[locale] ?? "",
					href: `/products/${product.id}`,
					image: mainImage?.url || "/placeholder.svg",
				};
			});

		return {
			name: categoryName,
			href: `/products?category=${encodeURIComponent(categoryFilterId)}`,
			image: "/placeholder.svg",
			products: productsInCategory,
		};
	});

	const serviceIds = await getActiveServiceIds();

	const services = (
		await Promise.all(serviceIds.map((id) => getServiceById(id)))
	).filter((service): service is NonNullable<typeof service> => service !== null);

	const serviceMenu = services.map((service) => {
		const mainImage =
			service.gallery?.find((img) => img.isMain) || service.gallery?.[0];

		return {
			name: service.name?.[locale] || "",
			href: `/services/${service.id}`,
			image: mainImage?.url || "/placeholder.svg",
		};
	});

	const projectCategoryIds = await getActiveProjectCategoryIds();

	const projectCategories = (
		await Promise.all(
			projectCategoryIds.map((id) => getProjectCategoryById(id)),
		)
	).filter(
		(category): category is NonNullable<typeof category> => category !== null,
	);

	const projectIds = await getActiveProjectIds();

	const projects = (
		await Promise.all(projectIds.map((id) => getProjectById(id)))
	).filter((project): project is NonNullable<typeof project> => project !== null);

	const projectMenu = projectCategories.map((category) => {
		const categoryName = category.name?.[locale] ?? "";
		const categoryFilterId = category.id;

		const projectsInCategory = projects
			.filter((project) => project.categoryId === category.id)
			.sort((a, b) => {
				const dateA = new Date(a.createdAt).getTime();
				const dateB = new Date(b.createdAt).getTime();

				return dateA - dateB;
			})
			.slice(0, 2)
			.map((project) => {
				const mainImage =
					project.gallery?.find((img) => img.isMain) || project.gallery?.[0];

				return {
					id: project.id,
					name: project.name?.[locale] ?? "",
					href: `/projects/${project.id}`,
					image: mainImage?.url || "/placeholder.svg",
				};
			});

		return {
			name: categoryName,
			href: `/projects?category=${encodeURIComponent(categoryFilterId)}`,
			image: "/placeholder.svg",
			products: projectsInCategory,
		};
	});

	const navigation = [
		{ name: dictionary.nav.home, href: "/" },
		{ name: dictionary.nav.about, href: "/about" },
		{
			name: dictionary.nav.products,
			href: "/products",
			children: productMenu,
		},
		{
			name: dictionary.nav.services,
			href: "/services",
			children: serviceMenu,
		},
		{
			name: dictionary.nav.projects,
			href: "/projects",
			children: projectMenu,
		},
		{ name: "BLOG", href: "/blog" },
		{ name: dictionary.nav.contact, href: "/contact" },
	];

	return (
		<HeaderScrollShell>
			<header
				className="border-b border-[#e5e7eb] bg-[#F7F1E6] text-[#342312] shadow-sm"
				style={{ ["--header-h" as any]: "160px" }}
			>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="border-b border-[#e5e7eb]">
						<div className="flex items-center justify-between gap-4 py-3.5 md:gap-6 md:py-4">
							<LocaleLink
								href="/"
								className="group flex min-w-0 flex-1 items-center gap-3 sm:gap-4 md:flex-none md:shrink-0"
							>
								{brandLogo ? (
									<img
										src={brandLogo}
										alt={brandCompanyName || "Logo"}
										className="h-12 w-auto shrink-0 object-contain sm:h-14 lg:h-16"
									/>
								) : null}

								{brandCompanyName ? (
									<span className="relative min-w-0 overflow-visible pb-1.5 sm:pb-2">
										<span className="block max-w-[172px] truncate font-heading text-[18px] font-black uppercase leading-[1.18] tracking-[0.1em] text-[#2F2114] drop-shadow-[0_1px_0_rgba(168,126,60,0.24)] sm:max-w-none sm:text-[21px] sm:tracking-[0.11em] lg:text-[22px] xl:text-[24px]">
											{brandCompanyName}
										</span>

										<span className="pointer-events-none absolute bottom-0 left-0 hidden h-[2px] w-16 bg-[#A87E3C]/75 transition-all duration-300 group-hover:w-24 sm:block" />
									</span>
								) : null}
							</LocaleLink>

							<div className="hidden max-w-xl flex-1 md:flex">
								<HeaderSearch
									locale={locale}
									placeholder={dictionary.header.searchPlaceholder}
								/>
							</div>

							{/* Phone from lg, email from xl (room for search); the language switch from md up (tablets have no mobile menu) */}
							<div className="hidden shrink-0 items-center gap-2 md:flex">
								{contactInfo.phone1 ? (
									<a
										href={`tel:${contactInfo.phone1.replace(/[^\d+]/g, "")}`}
										className="hidden min-h-9 items-center gap-1.5 rounded-full px-2.5 font-heading text-[15px] font-medium text-[#342312] transition-colors hover:bg-[#E7D0AF]/55 lg:inline-flex"
									>
										<Phone className="h-4 w-4 text-[#A87E3C]" />
										<span>{contactInfo.phone1}</span>
									</a>
								) : null}

								{contactInfo.email1 ? (
									<a
										href={`mailto:${contactInfo.email1}`}
										className="hidden min-h-9 items-center gap-1.5 rounded-full px-2.5 font-heading text-[15px] font-medium text-[#342312] transition-colors hover:bg-[#E7D0AF]/55 xl:inline-flex"
									>
										<Mail className="h-4 w-4 text-[#A87E3C]" />
										<span>{contactInfo.email1}</span>
									</a>
								) : null}

								<div className="ml-1 shrink-0 font-heading">
									<LanguageSwitcher currentLang={locale} />
								</div>
							</div>

							<MobileHeader
								navigation={navigation}
								locale={locale}
								brandLogo={brandLogo}
								brandCompanyName={brandCompanyName}
								phone={contactInfo.phone1}
								email={contactInfo.email1}
								searchPlaceholder={dictionary.header.searchPlaceholder}
								viewAllText={dictionary.header.viewAll}
							/>
						</div>
					</div>

					<div className="hidden h-16 items-center justify-between md:flex">
						<HeaderNavClient
							navigation={navigation}
							dictionary={dictionary}
							locale={locale}
						/>
					</div>
				</div>
			</header>
		</HeaderScrollShell>
	);
}
