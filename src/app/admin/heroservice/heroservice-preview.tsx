"use client";

import { MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { useHeroServiceInfo } from "./heroservice-context";

export function HeroServiceSectionPreview() {
	const heroServiceInfo = useHeroServiceInfo();

	return (
		<div className="bg-muted/50 p-6 rounded-lg space-y-4">
			<h4 className="text-lg font-semibold">Hero Service Section Preview</h4>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-4">
					<p className="font-medium">Title English</p>
					<p className="text-muted-foreground whitespace-pre-line">{heroServiceInfo.title.en}</p>

					<p className="font-medium">Title Vietnamese</p>
					<p className="text-muted-foreground whitespace-pre-line">{heroServiceInfo.title.vi}</p>

					<p className="font-medium">Description English</p>
					<p className="text-muted-foreground whitespace-pre-line">
						{heroServiceInfo.description.en}
					</p>

					<p className="font-medium">Description Vietnamese</p>
					<p className="text-muted-foreground whitespace-pre-line">
						{heroServiceInfo.description.vi}
					</p>
				</div>
			</div>
		</div>
	);
}

export function FooterPreview() {
	const heroServiceInfo = useHeroServiceInfo();

	return (
		<div className="bg-primary text-primary-foreground p-6 rounded-lg space-y-4">
			<h4 className="text-lg font-semibold">Hero Service Preview</h4>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-4">
					<div className="flex items-start">
						<MapPin className="size-5 mt-1 mr-3 flex-shrink-0" />
						<div>
							<p className="font-medium">English</p>
							<p className="text-primary-foreground/80 text-sm whitespace-pre-line">
								{heroServiceInfo.title.en}
							</p>
							<p className="text-primary-foreground/80 text-sm whitespace-pre-line">
								{heroServiceInfo.description.en}
							</p>
						</div>
					</div>

					<div className="flex items-start">
						<MapPin className="size-5 mt-1 mr-3 flex-shrink-0" />
						<div>
							<p className="font-medium">Vietnamese</p>
							<p className="text-primary-foreground/80 text-sm whitespace-pre-line">
								{heroServiceInfo.title.vi}
							</p>
							<p className="text-primary-foreground/80 text-sm whitespace-pre-line">
								{heroServiceInfo.description.vi}
							</p>
						</div>
					</div>
					
					<p className="font-medium">Hero Service Gallery</p>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
						{heroServiceInfo.gallery.length > 0 ? (
							heroServiceInfo.gallery
								.sort((a, b) => a.order - b.order)
								.map((image) => (
									<img
										key={image.url}
										src={image.url}
										alt="HeroService gallery"
										className="h-24 w-full rounded object-cover"
									/>
								))
						) : (
							<p className="text-muted-foreground text-sm">No gallery images</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export function PreviewSection() {
	return (
		<Card className="mt-8">
			<CardHeader>
				<CardTitle>Preview</CardTitle>
				<CardDescription>
					How your hero service information will appear in the hero section
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-8">
					<HeroServiceSectionPreview />
					<FooterPreview />
				</div>
			</CardContent>
		</Card>
	);
}