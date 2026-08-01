"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "src/lib/i18n/config";

interface ServiceMobileNavigationItem {
	id: string;
	imageUrl?: string;
	name: string;
}

interface ServiceMobileNavigationProps {
	items: ServiceMobileNavigationItem[];
	locale: Locale;
}

const labels = {
	vi: {
		close: "Đóng danh sách dịch vụ",
		description: "Chọn một dịch vụ để mở trang thông tin chi tiết.",
		title: "Dịch vụ Nghiệp Hưng",
	},
	en: {
		close: "Close service list",
		description: "Choose a service to open its detail page.",
		title: "Nghiep Hung Services",
	},
} as const;

export function ServiceMobileNavigation({ items, locale }: ServiceMobileNavigationProps) {
	if (items.length === 0) return null;

	const copy = labels[locale];

	return (
		<div className="mb-8 md:hidden">
			<DialogPrimitive.Root>
				<DialogPrimitive.Trigger asChild>
					<button
						type="button"
						aria-label={copy.title}
						className="group flex min-h-[64px] w-full items-center gap-4 border-l-2 border-[#A87E3C] bg-[#FAF7F0]/80 px-4 text-left text-[#342312] shadow-[0_8px_24px_rgba(52,35,18,0.06)] transition-colors hover:bg-[#F4EBDD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A87E3C]/25"
					>
						<span className="min-w-0 flex-1 font-serif text-[20px] font-semibold leading-tight">
							{copy.title}
						</span>

						<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F1E5D2]/75 text-[#6B5137] transition-transform duration-200 group-hover:translate-x-0.5">
							<ChevronRight className="size-4" />
						</span>
					</button>
				</DialogPrimitive.Trigger>

				<DialogPrimitive.Portal>
					<DialogPrimitive.Overlay className="fixed inset-0 z-[80] bg-[#1C1209]/55 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 md:hidden" />

					<DialogPrimitive.Content className="fixed inset-y-0 left-0 z-[81] flex h-[100dvh] w-[min(86vw,360px)] flex-col overflow-hidden border-r border-[#342312]/10 bg-[#F7F1E6] text-[#342312] shadow-[18px_0_60px_rgba(28,18,9,0.24)] outline-none duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left-full data-[state=open]:animate-in data-[state=open]:slide-in-from-left-full md:hidden">
						<div className="relative shrink-0 border-b border-[#342312]/10 bg-[#FAF7F0] px-5 py-5">
							<div className="mb-3 h-[2px] w-12 bg-[#A87E3C]" />

							<DialogPrimitive.Title className="pr-11 font-serif text-[22px] font-semibold leading-tight text-[#342312]">
								{copy.title}
							</DialogPrimitive.Title>

							<DialogPrimitive.Description className="sr-only">
								{copy.description}
							</DialogPrimitive.Description>

							<DialogPrimitive.Close asChild>
								<button
									type="button"
									aria-label={copy.close}
									className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-[#342312]/10 bg-[#FAF7F0]/90 text-[#342312] transition-colors hover:border-[#A87E3C] hover:text-[#A87E3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A87E3C]/30"
								>
									<X className="size-5" />
								</button>
							</DialogPrimitive.Close>
						</div>

						<nav
							aria-label={copy.title}
							className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#FAF7F0] px-5 py-2"
						>
							{items.map((item) => (
								<DialogPrimitive.Close key={item.id} asChild>
									<Link
										href={`/${locale}/services/${item.id}`}
										className="group grid min-h-[72px] w-full grid-cols-[72px_minmax(0,1fr)_24px] items-center gap-3 border-b border-[#342312]/10 py-3 text-left text-[14px] font-medium leading-5 text-[#342312] transition-colors duration-200 hover:bg-[#F1E5D2]/45 focus-visible:bg-[#F1E5D2]/45 focus-visible:outline-none"
									>
										<span
											aria-hidden="true"
											className="relative flex h-12 w-[72px] shrink-0 items-center justify-center overflow-hidden border border-[#342312]/10 bg-[#F1E5D2] font-serif text-[12px] font-bold tracking-[0.12em] text-[#6B5137]"
										>
											{item.imageUrl ? (
												<Image
													src={item.imageUrl}
													alt=""
													fill
													sizes="72px"
													className="object-cover transition-transform duration-300 group-hover:scale-105"
												/>
											) : (
												"NH"
											)}
										</span>

										<span className="min-w-0 flex-1 break-words">{item.name}</span>

										<span className="flex size-6 shrink-0 items-center justify-center text-[#6B5137] transition-transform duration-200 group-hover:translate-x-0.5">
											<ChevronRight className="size-4" />
										</span>
									</Link>
								</DialogPrimitive.Close>
							))}
						</nav>
					</DialogPrimitive.Content>
				</DialogPrimitive.Portal>
			</DialogPrimitive.Root>
		</div>
	);
}
