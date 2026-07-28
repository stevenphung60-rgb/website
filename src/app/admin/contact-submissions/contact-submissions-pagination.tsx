import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ContactSubmissionsPaginationProps {
	currentPage: number;
	totalPages: number;
}

type PageItem = { type: "page"; page: number } | { type: "ellipsis"; key: string };

function createPageItems(currentPage: number, totalPages: number): PageItem[] {
	const visiblePages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
	const pages = [...visiblePages]
		.filter((page) => page >= 1 && page <= totalPages)
		.sort((left, right) => left - right);
	const items: PageItem[] = [];

	for (const page of pages) {
		const previousItem = items.at(-1);
		const previousPage = previousItem?.type === "page" ? previousItem.page : undefined;

		if (typeof previousPage === "number" && page - previousPage > 1) {
			items.push({
				type: "ellipsis",
				key: `ellipsis-${previousPage}-${page}`,
			});
		}

		items.push({ type: "page", page });
	}

	return items;
}

function createPageHref(page: number): string {
	const params = new URLSearchParams();

	if (page > 1) {
		params.set("page", String(page));
	}

	const query = params.toString();
	return `/admin/contact-submissions${query ? `?${query}` : ""}`;
}

/**
 * URL-based pagination for the contact submission inbox.
 */
export function ContactSubmissionsPagination({
	currentPage,
	totalPages,
}: ContactSubmissionsPaginationProps) {
	if (totalPages <= 1) {
		return null;
	}

	const pageItems = createPageItems(currentPage, totalPages);

	return (
		<nav
			aria-label="Phân trang khách hàng liên hệ"
			className="mt-6 flex flex-wrap items-center justify-center gap-2"
		>
			<PaginationLink
				disabled={currentPage <= 1}
				href={createPageHref(currentPage - 1)}
				label="Trang trước"
			>
				<ChevronLeft className="size-4" />
				<span className="hidden sm:inline">Trước</span>
			</PaginationLink>

			{pageItems.map((item) =>
				item.type === "ellipsis" ? (
					<span
						key={item.key}
						className="flex size-10 items-center justify-center text-sm text-[#342312]/55"
						aria-hidden="true"
					>
						…
					</span>
				) : (
					<PaginationLink
						key={item.page}
						active={item.page === currentPage}
						href={createPageHref(item.page)}
						label={`Trang ${item.page}`}
					>
						{item.page}
					</PaginationLink>
				),
			)}

			<PaginationLink
				disabled={currentPage >= totalPages}
				href={createPageHref(currentPage + 1)}
				label="Trang sau"
			>
				<span className="hidden sm:inline">Sau</span>
				<ChevronRight className="size-4" />
			</PaginationLink>
		</nav>
	);
}

function PaginationLink({
	active,
	children,
	disabled,
	href,
	label,
}: {
	active?: boolean;
	children: React.ReactNode;
	disabled?: boolean;
	href: string;
	label: string;
}) {
	return (
		<Link
			href={href}
			aria-current={active ? "page" : undefined}
			aria-disabled={disabled || undefined}
			aria-label={label}
			tabIndex={disabled ? -1 : undefined}
			className={[
				"inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-lg border px-3 text-sm font-semibold transition",
				active
					? "border-[#342312] bg-[#342312] text-[#E7D0AF]"
					: "border-[#E7D0AF] bg-white text-[#342312] hover:border-[#A87E3C] hover:text-[#A87E3C]",
				disabled ? "pointer-events-none opacity-40" : "",
			]
				.filter(Boolean)
				.join(" ")}
		>
			{children}
		</Link>
	);
}
