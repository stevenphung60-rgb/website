"use client";

import Image from "next/image";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "src/components/ui/dialog";

interface GalleryImage {
	url: string;
	alt?: string;
}

interface ServiceGalleryMarqueeProps {
	images: GalleryImage[];
	serviceName: string;
}

export default function ServiceGalleryMarquee({
	images,
	serviceName,
}: ServiceGalleryMarqueeProps) {
	const displayImages = [...images, ...images];

	if (images.length === 0) return null;

	return (
		<section className="relative left-1/2 right-1/2 mt-0 mb-10 w-screen -translate-x-1/2 overflow-hidden bg-[#342312] py-6 sm:mb-12 sm:py-8 lg:mb-14 lg:py-10">
			<div className="service-gallery-marquee flex w-max gap-3 sm:gap-4">
				{displayImages.map((image, index) => (
					<Dialog key={`${image.url}-${index}`}>
						<DialogTrigger asChild>
							<button
								type="button"
								className="group relative h-[220px] w-[82vw] shrink-0 overflow-hidden bg-black sm:h-[320px] sm:w-[520px] lg:h-[420px] lg:w-[620px]"
							>
								<Image
									src={image.url || "/placeholder.svg"}
									alt={image.alt || serviceName}
									fill
									className="object-cover transition duration-700 group-hover:scale-105"
								/>

								<div className="absolute inset-0 bg-black/10 transition duration-500 group-hover:bg-black/0" />
							</button>
						</DialogTrigger>

						<DialogContent className="max-w-[94vw] border-0 bg-black p-0 sm:max-w-[92vw] [&>button]:right-4 [&>button]:top-4 [&>button]:z-50 [&>button]:text-white sm:[&>button]:right-6 sm:[&>button]:top-6">
							<div className="relative h-[72vh] w-full overflow-hidden sm:h-[85vh]">
								<Image
									src={image.url || "/placeholder.svg"}
									alt={image.alt || serviceName}
									fill
									className="object-contain"
								/>
							</div>
						</DialogContent>
					</Dialog>
				))}
			</div>
		</section>
	);
}