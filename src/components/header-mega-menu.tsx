"use client";

import { ChevronsRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import LocaleLink from "src/components/behaviors/LocaleLink";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";

type MegaProduct = {
	id?: string;
	name: string;
	href: string;
	image?: string;
};

type MegaChild = {
	name: string;
	href: string;
	image?: string;
	products?: MegaProduct[];
};

export function HeaderMegaMenu({
	title,
	href,
	childrenItems,
	viewAllText,
	locale,
	onClose,
}: {
	title: string;
	href: string;
	childrenItems: MegaChild[];
	viewAllText: string;
	locale: Locale;
	onClose?: () => void;
}) {
	const [activeItem, setActiveItem] = useState<MegaChild | null>(
		childrenItems[0] ?? null,
	);

	const dictionary = getDictionary(locale);

	useEffect(() => {
		setActiveItem(childrenItems[0] ?? null);
	}, [childrenItems]);

	const normalizedTitle = title.toLowerCase();
	const isServiceMenu =
		normalizedTitle.includes("dịch") || normalizedTitle.includes("service");

	const relatedContent =
		dictionary.header.relatedcontent ||
		(locale === "en" ? "Related content" : "Nội dung liên quan");

	const activeProducts = activeItem?.products?.filter(Boolean) ?? [];
	const visibleProducts = activeProducts.slice(0, 2);
	const activeImage = activeItem?.image || "/placeholder.svg";
	const activeName = activeItem?.name || title;

	return (
		<div className="bg-[#FAF7F0] shadow-[0_28px_80px_rgba(52,35,18,0.12)]">
			<div className="mx-auto grid max-w-7xl grid-cols-12 overflow-hidden">
				<div className="col-span-4 bg-[#F7F1E6]/70 px-10 py-8">
					<div className="mb-6 flex items-center gap-3 text-[#A87E3C]">
						<span className="inline-block h-px w-10 bg-[#A87E3C]" />

						<span className="text-[13px] font-bold uppercase tracking-[0.16em]">
							{title}
						</span>
					</div>

					<div className="flex flex-col gap-1">
						{childrenItems.map((child, childIndex) => {
							const isActive = activeItem?.href === child.href;

							return (
								<div
									key={`${title}-${child.href}-${childIndex}`}
									onMouseEnter={() => setActiveItem(child)}
								>
									<LocaleLink
										href={child.href}
										prefetch={true}
										onClick={onClose}
										className={`group/child relative flex items-center rounded-[4px] px-4 py-3.5 text-[15px] font-bold uppercase tracking-[0.06em] transition-all duration-300 ${
											isActive
												? "bg-[#E7D0AF]/26 text-[#A87E3C]"
												: "text-[#342312] hover:bg-[#E7D0AF]/18 hover:text-[#A87E3C]"
										}`}
									>
										<span
											className={`absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 bg-[#A87E3C] transition-opacity duration-300 ${
												isActive
													? "opacity-100"
													: "opacity-0 group-hover/child:opacity-100"
											}`}
										/>

										<span className="block pr-8">{child.name}</span>

										<ChevronsRight
											className={`absolute right-3 top-1/2 size-4 -translate-y-1/2 transition-all duration-300 ${
												isActive
													? "translate-x-0 opacity-100"
													: "-translate-x-1 opacity-0 group-hover/child:translate-x-0 group-hover/child:opacity-100"
											}`}
											strokeWidth={2.2}
										/>
									</LocaleLink>
								</div>
							);
						})}
					</div>

					<div className="pt-8">
						<LocaleLink
							href={href}
							onClick={onClose}
							className="group/viewall relative isolate inline-flex min-h-11 items-center gap-2 overflow-hidden rounded-full bg-[#342312] px-6 text-[13px] font-bold uppercase tracking-[0.12em] text-[#F7F1E6] shadow-[0_14px_30px_rgba(52,35,18,0.14)] transition-transform duration-300 hover:-translate-y-0.5"
						>
							<span className="absolute inset-y-0 left-0 z-0 w-full origin-left scale-x-0 bg-[#A87E3C] transition-transform duration-500 ease-out group-hover/viewall:scale-x-100" />

							<span className="relative z-10 whitespace-nowrap">
								{viewAllText}
							</span>

							<ChevronsRight className="relative z-10 size-4 transition-transform duration-500 group-hover/viewall:translate-x-1" />
						</LocaleLink>
					</div>
				</div>

				<div className="col-span-8 flex min-h-[500px] flex-col px-10 py-8">
					<div className="mb-6">
						<p className="text-[14px] font-bold uppercase tracking-[0.12em] text-[#A87E3C]">
							{activeName}
						</p>
					</div>

					{isServiceMenu ? (
						<div className="grid grid-cols-2 gap-5">
							<LocaleLink
								href={activeItem?.href ?? href}
								onClick={onClose}
								className="group/service block overflow-hidden rounded-[4px] bg-[#F7F1E6]/78 transition-all duration-300 hover:-translate-y-1 hover:bg-[#F7F1E6] hover:shadow-[0_18px_44px_rgba(52,35,18,0.1)]"
							>
								<div className="relative h-[300px] w-full overflow-hidden bg-[#F7F1E6]">
									<Image
										src={activeImage}
										alt={activeName}
										fill
										sizes="420px"
										className="object-cover transition-transform duration-500 group-hover/service:scale-105"
									/>
								</div>

								<div className="flex min-h-[76px] items-center justify-center bg-[#F7F1E6]/80 px-5 py-4">
									<h4 className="line-clamp-2 text-center text-[16px] font-bold uppercase leading-6 tracking-[0.045em] text-[#342312] transition-colors duration-300 group-hover/service:text-[#A87E3C]">
										{activeName}
									</h4>
								</div>
							</LocaleLink>
						</div>
					) : visibleProducts.length > 0 ? (
						<div className="grid grid-cols-2 gap-5">
							{visibleProducts.map((product, index) => (
								<LocaleLink
									key={
										product.id ??
										`${activeItem?.href}-${product.name}-${index}`
									}
									href={product.href}
									onClick={onClose}
									className="group/product block overflow-hidden rounded-[4px] bg-[#F7F1E6]/78 transition-all duration-300 hover:-translate-y-1 hover:bg-[#F7F1E6] hover:shadow-[0_18px_44px_rgba(52,35,18,0.1)]"
								>
									<div className="relative h-[230px] w-full overflow-hidden bg-[#F7F1E6]">
										<Image
											src={product.image || "/placeholder.svg"}
											alt={product.name}
											fill
											sizes="420px"
											className="object-cover transition-transform duration-500 group-hover/product:scale-105"
										/>
									</div>

									<div className="flex min-h-[74px] items-center justify-center bg-[#F7F1E6]/80 px-5 py-4">
										<h4 className="line-clamp-2 text-center text-[16px] font-bold uppercase leading-6 tracking-[0.045em] text-[#342312] transition-colors duration-300 group-hover/product:text-[#A87E3C]">
											{product.name}
										</h4>
									</div>
								</LocaleLink>
							))}
						</div>
					) : (
						<div className="grid grid-cols-2 gap-5">
							<LocaleLink
								href={activeItem?.href ?? href}
								onClick={onClose}
								className="group/feature block overflow-hidden rounded-[4px] bg-[#F7F1E6]/78 transition-all duration-300 hover:-translate-y-1 hover:bg-[#F7F1E6] hover:shadow-[0_18px_44px_rgba(52,35,18,0.1)]"
							>
								<div className="relative h-[230px] w-full overflow-hidden bg-[#F7F1E6]">
									<Image
										src={activeImage}
										alt={activeName}
										fill
										sizes="420px"
										className="object-cover transition-transform duration-500 group-hover/feature:scale-105"
									/>
								</div>

								<div className="flex min-h-[74px] items-center justify-center bg-[#F7F1E6]/80 px-5 py-4">
									<h4 className="line-clamp-2 text-center text-[16px] font-bold uppercase leading-6 tracking-[0.045em] text-[#342312] transition-colors duration-300 group-hover/feature:text-[#A87E3C]">
										{activeName}
									</h4>
								</div>
							</LocaleLink>
						</div>
					)}

					<div className="mt-auto flex justify-end pt-6">
						<LocaleLink
							href={activeItem?.href ?? href}
							onClick={onClose}
							className="group/allrelated inline-flex items-center gap-2 text-right text-[13px] font-semibold italic tracking-wide text-[#342312] transition-colors duration-300 hover:text-[#A87E3C]"
						>
							<span>{relatedContent}</span>

							<ChevronsRight
								className="size-4 transition-transform duration-300 group-hover/allrelated:translate-x-1"
								strokeWidth={2.2}
							/>
						</LocaleLink>
					</div>
				</div>
			</div>
		</div>
	);
}