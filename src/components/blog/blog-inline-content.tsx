import type { ReactNode } from "react";

const tokenPattern = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

function safeHref(value: string): string {
	const trimmedValue = value.trim();

	if (
		trimmedValue.startsWith("/") ||
		trimmedValue.startsWith("http://") ||
		trimmedValue.startsWith("https://") ||
		trimmedValue.startsWith("mailto:") ||
		trimmedValue.startsWith("tel:")
	) {
		return trimmedValue;
	}

	return "#";
}

/**
 * Render controlled inline marks from lightweight markdown syntax.
 * Supported: **bold**, *italic*, __underline__, [text](url)
 * @param text - Inline text
 * @returns React nodes
 */
export function renderBlogInlineContent(text: string): ReactNode[] {
	const parts = text.split(tokenPattern).filter((part) => part.length > 0);

	return parts.map((part, index) => {
		if (part.startsWith("**") && part.endsWith("**")) {
			return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
		}

		if (part.startsWith("__") && part.endsWith("__")) {
			return <u key={`${part}-${index}`}>{part.slice(2, -2)}</u>;
		}

		if (part.startsWith("*") && part.endsWith("*")) {
			return <em key={`${part}-${index}`}>{part.slice(1, -1)}</em>;
		}

		const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

		if (linkMatch) {
			const [, label, href] = linkMatch;

			return (
				<a
					key={`${part}-${index}`}
					href={safeHref(href)}
					className="font-semibold text-[#A87E3C] underline underline-offset-4 transition hover:text-[#342312]"
					target={href.startsWith("http") ? "_blank" : undefined}
					rel={href.startsWith("http") ? "noreferrer" : undefined}
				>
					{label}
				</a>
			);
		}

		return part;
	});
}
