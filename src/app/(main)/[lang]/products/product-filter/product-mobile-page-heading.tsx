interface ProductMobilePageHeadingProps {
	title: string;
}

export function ProductMobilePageHeading({ title }: ProductMobilePageHeadingProps) {
	return (
		<header className="mb-5 flex w-full items-center gap-3 lg:hidden">
			<span
				aria-hidden="true"
				data-testid="product-heading-line"
				className="h-px w-8 shrink-0 bg-[#A87E3C]"
			/>

			<h1 className="shrink-0 font-heading text-[24px] font-semibold uppercase leading-none tracking-[0.08em] text-[#342312] sm:text-[26px]">
				{title}
			</h1>

			<span
				aria-hidden="true"
				data-testid="product-heading-line"
				className="h-px min-w-0 flex-1 bg-gradient-to-r from-[#A87E3C] to-[#E7D0AF]/20"
			/>
		</header>
	);
}
