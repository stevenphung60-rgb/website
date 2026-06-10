import { Building2, Factory, Mail, Phone } from "lucide-react";
import { cacheTag } from "next/cache";
import Image from "next/image";
import { getSocialMediaPlatform } from "src/app/admin/contact/social-media.config";
import LocaleLink from "src/components/behaviors/LocaleLink";
import { CACHE_TAGS } from "src/lib/cache-tags";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import { getContactInfo } from "src/server/contact";
import { getHeroAboutInfo } from "src/server/heroabout";

type LocalizedTextValue =
	| {
			en?: string;
			vi?: string;
	  }
	| null
	| undefined;

export default async function Footer({ locale }: { locale: Locale }) {
	"use cache";
	cacheTag(CACHE_TAGS.CONTACT);
	cacheTag(CACHE_TAGS.HEROABOUT);

	const contactInfo = await getContactInfo();
	const heroAboutInfo = await getHeroAboutInfo();

	const dictionary = getDictionary(locale);
	const socialMedia = contactInfo.socialMedia ?? [];
	const lang = locale === "en" ? "en" : "vi";

	const getLocalizedValue = (
		value: LocalizedTextValue,
		fallback: string,
	): string => {
		const localizedValue = lang === "en" ? value?.en : value?.vi;

		return localizedValue?.trim() || fallback;
	};

	const officeAddress = getLocalizedValue(heroAboutInfo.officeaddress, "");
	const factoryAddress = getLocalizedValue(heroAboutInfo.factoryaddress, "");

	const uiText = {
		vi: {
			ctaEyebrow: "Nhận tư vấn",
			ctaTitle: "Tư vấn giải pháp phù hợp",
			ctaDescription:
				"Tìm hiểu giải pháp sản phẩm phù hợp cho công trình và nhu cầu của bạn.",
			ctaButton: "Tư vấn ngay",
			contactInfo: "Thông tin liên hệ",
			officeAddress: "Văn phòng",
			factoryAddress: "Nhà xưởng",
			quickLinks: "Liên kết nhanh",
			productGroup: "Sản phẩm & dịch vụ",
			companyName: "Công ty TNHH Nghiệp Hưng",
		},
		en: {
			ctaEyebrow: "Consultation",
			ctaTitle: "Find the right solution",
			ctaDescription:
				"Explore suitable product solutions for your project and business needs.",
			ctaButton: "Get consultation",
			contactInfo: "Contact information",
			officeAddress: "Office",
			factoryAddress: "Factory",
			quickLinks: "Quick links",
			productGroup: "Products & services",
			companyName: "Nghiep Hung Co., Ltd.",
		},
	};

	const text = uiText[lang];

	const consultantEyebrow = getLocalizedValue(
		contactInfo.consultantsubtitle,
		text.ctaEyebrow,
	);

	const consultantTitle = getLocalizedValue(
		contactInfo.consultanttitle,
		text.ctaTitle,
	);

	const consultantDescription = getLocalizedValue(
		contactInfo.consultantdescription,
		text.ctaDescription,
	);

	const consultantImage =
		contactInfo.consultantimage?.url?.trim() || "/footer-cta.jpg";

	const footerLogo =
		contactInfo.footerlogo?.url?.trim() || "/nghiep_hung_logo_full.svg";

	const footerCompanyName = getLocalizedValue(
		contactInfo.footercompanyname,
		text.companyName,
	);

	const footerCompanyDescription = getLocalizedValue(
		contactInfo.footercompanydescription,
		dictionary.footer.description,
	);

	const quickLinks = [
		{ href: "/about", label: dictionary.nav.about },
		{ href: "/projects", label: dictionary.nav.projects },
		{ href: "/contact", label: dictionary.nav.contact },
		{ href: "/privacy-policy", label: dictionary.nav.privacyPolicy },
	];

	const productLinks = [
		{ href: "/products", label: dictionary.nav.products },
		{ href: "/services", label: dictionary.nav.services },
	];

	const phones = [contactInfo.phone1, contactInfo.phone2].filter(
		Boolean,
	) as string[];

	const emails = [contactInfo.email1, contactInfo.email2].filter(
		Boolean,
	) as string[];

	const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

	return (
		<footer className="w-full overflow-hidden bg-[#342312] text-[#F7F1E6]">
			<section className="grid min-h-[190px] bg-[#E7D0AF] lg:grid-cols-[42%_58%]">
				<div className="relative min-h-[150px] lg:min-h-[220px]">
					<Image
						src={consultantImage}
						alt={consultantTitle}
						fill
						unoptimized
						sizes="(max-width: 1024px) 100vw, 42vw"
						className="object-cover"
					/>

					<div className="absolute inset-0 bg-[#342312]/15" />
				</div>

				<div className="relative flex items-center justify-start overflow-hidden bg-[#F7F1E6] px-5 py-8 text-left sm:px-8 sm:py-9 lg:px-20 lg:py-10 xl:px-24">
					<div className="relative w-full max-w-3xl">
						<p className="mb-3 text-[16px] font-bold uppercase tracking-[0.03em] text-[#A87E3C]">
							{consultantEyebrow}
						</p>

						<h2 className="max-w-[760px] font-serif text-[24px] font-bold leading-[1.18] tracking-[-0.01em] text-[#342312] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px]">
							{consultantTitle}
						</h2>

						<p className="mt-4 max-w-2xl text-[16px] leading-8 text-[#342312]/82">
							{consultantDescription}
						</p>

					<div className="mt-6 flex flex-wrap items-center justify-start gap-3">
						<LocaleLink
							href="/contact"
							className="group relative isolate inline-flex min-h-12 items-center justify-center overflow-hidden rounded-full bg-[#342312] px-8 text-[16px] font-semibold text-[#F7F1E6]"
						>
							<span className="absolute inset-y-0 left-0 z-0 w-full origin-left scale-x-0 bg-[#A87E3C] transition-transform duration-500 ease-out group-hover:scale-x-100" />

							<span className="relative z-10 whitespace-nowrap">
								{text.ctaButton}
							</span>
						</LocaleLink>

						{phones[0] ? (
							<a
								href={phoneHref(phones[0])}
								className="group relative isolate inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-full border border-[#342312]/20 bg-transparent px-8 text-[16px] font-semibold text-[#342312] transition-colors duration-500 hover:border-[#A87E3C] hover:text-[#F7F1E6]"
							>
								<span className="absolute inset-y-0 left-0 z-0 w-full origin-left scale-x-0 bg-[#A87E3C] transition-transform duration-500 ease-out group-hover:scale-x-100" />

								<Phone className="relative z-10 size-4" />

								<span className="relative z-10 whitespace-nowrap">{phones[0]}</span>
							</a>
						) : null}
					</div>
					</div>
				</div>
			</section>

			<div className="relative w-full bg-[#342312] px-6 py-12 sm:px-10 lg:px-20 xl:px-28 2xl:px-36">
				<div className="mx-auto grid max-w-none gap-9 md:grid-cols-2 lg:grid-cols-[1.08fr_0.68fr_0.92fr_1.05fr] lg:items-start lg:gap-8 xl:gap-9">
					<div>
						<div className="mb-7 flex items-start gap-5">
							<img
								src={footerLogo}
								alt={footerCompanyName}
								className="h-16 w-auto shrink-0"
							/>

							<div>
								<p className="text-[17px] font-extrabold uppercase leading-7 tracking-[0.08em] text-[#F7F1E6]">
									{footerCompanyName}
								</p>

								<div className="mt-3 h-px w-20 bg-[#E7D0AF]" />
							</div>
						</div>

						<p className="max-w-[520px] text-[16px] leading-8 text-[#F7F1E6]">
							{footerCompanyDescription}
						</p>

						{socialMedia.length > 0 ? (
							<div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
								{socialMedia.map((link) => {
									const platform = getSocialMediaPlatform(link.platformId);

									if (!platform) return null;

									const Icon = platform.icon;

									return (
										<a
											key={link.id}
											href={link.url}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-3 text-[16px] font-normal text-[#F7F1E6] transition-colors hover:text-[#A87E3C]"
											aria-label={`Visit our ${platform.name} page`}
										>
											<Icon className="size-5" />

											<span>{platform.name}</span>
										</a>
									);
								})}
							</div>
						) : null}
					</div>

					<div>
						<h4 className="mb-4 whitespace-nowrap text-[14px] font-bold uppercase leading-6 tracking-[0.08em] text-[#E7D0AF]">
							{text.quickLinks}
						</h4>

						<ul className="space-y-3">
							{quickLinks.map((link) => (
								<li key={link.href}>
									<LocaleLink
										href={link.href}
										className="text-[16px] font-normal uppercase tracking-[0.04em] text-[#F7F1E6] transition-colors hover:text-[#A87E3C]"
									>
										{link.label}
									</LocaleLink>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="mb-4 whitespace-nowrap text-[14px] font-bold uppercase leading-6 tracking-[0.08em] text-[#E7D0AF]">
							{text.productGroup}
						</h4>

						<ul className="space-y-3">
							{productLinks.map((link) => (
								<li key={link.href}>
									<LocaleLink
										href={link.href}
										className="text-[16px] font-normal uppercase tracking-[0.04em] text-[#F7F1E6] transition-colors hover:text-[#A87E3C]"
									>
										{link.label}
									</LocaleLink>
								</li>
							))}
						</ul>
					</div>

					<div className="lg:ml-auto lg:w-full lg:max-w-[410px]">
						<h4 className="mb-4 whitespace-nowrap text-[14px] font-bold uppercase leading-6 tracking-[0.08em] text-[#E7D0AF]">
							{text.contactInfo}
						</h4>

						<div className="space-y-4">
							{officeAddress ? (
								<div className="flex gap-4">
									<Building2 className="mt-1 size-5 shrink-0 text-[#F7F1E6]" />

									<div>
										<p className="mb-1.5 text-[12px] font-normal uppercase tracking-[0.18em] text-[#E7D0AF]">
											{text.officeAddress}
										</p>

										<p className="whitespace-pre-line text-[16px] leading-7 text-[#F7F1E6]">
											{officeAddress}
										</p>
									</div>
								</div>
							) : null}

							{factoryAddress ? (
								<div className="flex gap-4">
									<Factory className="mt-1 size-5 shrink-0 text-[#F7F1E6]" />

									<div>
										<p className="mb-1.5 text-[12px] font-normal uppercase tracking-[0.18em] text-[#E7D0AF]">
											{text.factoryAddress}
										</p>

										<p className="whitespace-pre-line text-[16px] leading-7 text-[#F7F1E6]">
											{factoryAddress}
										</p>
									</div>
								</div>
							) : null}

							<div className="space-y-3 pt-1">
								{phones.map((phone) => (
									<a
										key={phone}
										href={phoneHref(phone)}
										className="flex gap-4 text-[16px] font-normal text-[#F7F1E6] transition-colors hover:text-[#A87E3C]"
									>
										<Phone className="mt-0.5 size-5 shrink-0 text-[#F7F1E6]" />

										<span>{phone}</span>
									</a>
								))}

								{emails.map((email) => (
									<a
										key={email}
										href={`mailto:${email}`}
										className="flex gap-4 text-[16px] font-normal text-[#F7F1E6] transition-colors hover:text-[#A87E3C]"
									>
										<Mail className="mt-0.5 size-5 shrink-0 text-[#F7F1E6]" />

										<span className="break-all">{email}</span>
									</a>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="mx-auto mt-10 max-w-none border-t border-[#E7D0AF]/18 pt-6">
					<p className="text-[16px] leading-7 text-[#F7F1E6]/72">
						{dictionary.footer.copyright}
					</p>
				</div>
			</div>
		</footer>
	);
}