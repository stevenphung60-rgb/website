/**
 * Server component that fetches contact information from database and renders the contact section
 * Has the same structure as the static contact-section.tsx but uses database data
 */

import type { LucideIcon } from "lucide-react";
import { Clock3, Facebook, Factory, Mail, MapPin, Phone } from "lucide-react";
import { cacheTag } from "next/cache";
import { getSocialMediaPlatform } from "src/app/admin/contact/social-media.config";
import { CACHE_TAGS } from "src/lib/cache-tags";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import { getContactInfo } from "src/server/contact";
import { getHeroAboutInfo } from "src/server/heroabout";
import { ContactForm } from "./contact-form";
import FadeInWrapper from "./fade-in-wrapper";

interface ContactSectionDatabaseProps {
	locale: Locale;
	heroContactTitle: string;
	heroContactDescription: string;
}

const uiText = {
	vi: {
		sendMessage: "Gửi thông tin",
		information: "Thông tin",
		officeAddress: "Văn phòng",
		factoryAddress: "Nhà máy",
		socialDescription:
			"Theo dõi Nghiệp Hưng trên các nền tảng mạng xã hội.",
	},
	en: {
		sendMessage: "Send message",
		information: "Information",
		officeAddress: "Office",
		factoryAddress: "Factory",
		socialDescription: "Follow Nghiep Hung on our social channels.",
	},
};

export default async function ContactSectionDatabase({
	locale,
	heroContactTitle,
	heroContactDescription,
}: ContactSectionDatabaseProps) {
	"use cache";
	cacheTag(CACHE_TAGS.CONTACT);
	cacheTag(CACHE_TAGS.HEROABOUT);

	const contactInfo = await getContactInfo();
	const heroAboutInfo = await getHeroAboutInfo();
	const dictionary = getDictionary(locale);

	const lang = locale === "en" ? "en" : "vi";
	const text = uiText[lang];

	const officeAddress = heroAboutInfo.officeaddress?.[lang]?.trim() || "";
	const factoryAddress = heroAboutInfo.factoryaddress?.[lang]?.trim() || "";
	const workingHours = contactInfo.workingHours?.[lang]?.trim() || "";
	const socialMedia = contactInfo.socialMedia ?? [];

	return (
		<section
			id="contact"
			className="relative overflow-hidden bg-[#FAF7F0] py-12 sm:py-16 lg:py-24"
		>
			<div className="absolute left-[-120px] top-[-120px] size-[260px] rounded-full bg-[#A87E3C]/10 blur-3xl sm:size-[320px]" />
			<div className="absolute bottom-[-140px] right-[-120px] size-[280px] rounded-full bg-[#342312]/10 blur-3xl sm:size-[360px]" />

			<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<FadeInWrapper>
					<div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
						<div className="min-w-0 lg:col-span-7">
							<div className="relative overflow-hidden rounded-sm bg-white p-5 shadow-[0_24px_80px_rgba(52,35,18,0.12)] sm:p-8 lg:p-10">
								<div className="relative min-w-0">
									<p className="mb-3 break-words text-[12px] font-semibold uppercase leading-relaxed tracking-[0.22em] text-[#A87E3C] sm:text-sm sm:tracking-[0.25em]">
										{text.sendMessage}
									</p>

									<h3 className="mb-6 break-words text-[26px] font-semibold leading-tight text-[#342312] sm:mb-8 sm:text-[34px]">
										{dictionary.contact.form.title}
									</h3>

									<ContactForm locale={locale} />
								</div>
							</div>
						</div>

						<div className="min-w-0 space-y-6 lg:col-span-5">
							<div className="rounded-sm border border-[#342312]/10 bg-white/80 p-5 shadow-[0_20px_60px_rgba(52,35,18,0.08)] backdrop-blur sm:p-8">
								<p className="mb-3 break-words text-[12px] font-semibold uppercase leading-relaxed tracking-[0.22em] text-[#A87E3C] sm:text-sm sm:tracking-[0.25em]">
									{text.information}
								</p>

								<h3 className="mb-6 break-words text-[24px] font-semibold leading-tight text-[#342312] sm:mb-8">
									{dictionary.contact.contactInfo.title}
								</h3>

								<div className="space-y-4 sm:space-y-5">
									<ContactInfoItem
										icon={Phone}
										label={dictionary.contact.contactInfo.phone}
										values={[contactInfo.phone1, contactInfo.phone2]}
									/>

									<ContactInfoItem
										icon={Mail}
										label={dictionary.contact.contactInfo.email}
										values={[contactInfo.email1, contactInfo.email2]}
									/>

									<ContactInfoItem
										icon={MapPin}
										label={text.officeAddress}
										values={[officeAddress]}
									/>

									<ContactInfoItem
										icon={Factory}
										label={text.factoryAddress}
										values={[factoryAddress]}
									/>

									<ContactInfoItem
										icon={Clock3}
										label={dictionary.contact.contactInfo.workingHours}
										values={[workingHours]}
									/>
								</div>
							</div>

							{socialMedia.length > 0 ? (
								<div className="rounded-sm border border-[#342312]/10 bg-[#342312] p-5 text-white shadow-[0_20px_60px_rgba(52,35,18,0.18)] sm:p-8">
									<h3 className="mb-2 break-words text-[22px] font-semibold leading-tight">
										{dictionary.contact.socialMedia.title}
									</h3>

									<p className="mb-6 break-words text-sm leading-6 text-white/65">
										{text.socialDescription}
									</p>

									<div className="flex flex-wrap gap-3">
										{socialMedia.map((link) => {
											const platform = getSocialMediaPlatform(link.platformId);

											if (!platform) {
												return null;
											}

											const Icon =
												link.platformId === "facebook"
													? Facebook
													: platform.icon;

											return (
												<a
													key={link.id}
													href={link.url}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex size-11 items-center justify-center rounded-sm border border-white/15 bg-white/10 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#A87E3C] hover:shadow-lg"
													aria-label={`Visit our ${platform.name} page`}
												>
													<Icon className="size-4" />
												</a>
											);
										})}
									</div>
								</div>
							) : null}
						</div>
					</div>
				</FadeInWrapper>
			</div>
		</section>
	);
}

function ContactInfoItem({
	icon: Icon,
	label,
	values,
}: {
	icon: LucideIcon;
	label: string;
	values: (string | undefined)[];
}) {
	const validValues = values.filter(Boolean) as string[];

	if (validValues.length === 0) {
		return null;
	}

	return (
		<div className="group flex min-w-0 gap-3 rounded-2xl border border-[#342312]/10 bg-[#FAF7F0]/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#A87E3C]/30 hover:bg-[#F7F1E6] hover:shadow-md sm:gap-4">
			<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#342312] text-[#E7D0AF] transition-colors duration-300 group-hover:bg-[#A87E3C] group-hover:text-white sm:size-11">
				<Icon className="size-5" />
			</div>

			<div className="min-w-0 flex-1">
				<p className="mb-1 break-words text-[11px] font-semibold uppercase leading-relaxed tracking-[0.14em] text-[#A87E3C] sm:text-xs sm:tracking-[0.16em]">
					{label}
				</p>

				{validValues.map((value) => (
					<p
						key={`${label}-${value}`}
						className="whitespace-pre-line break-words text-[14px] leading-7 text-[#342312]/80 sm:text-[15px]"
					>
						{value}
					</p>
				))}
			</div>
		</div>
	);
}