"use client";

import { MapPin } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "src/components/ui/card";
import { useHeroAboutInfo } from "./heroabout-context";
import type { LocalizedText } from "./heroabout.type";

function LocalizedPreviewItem({
	label,
	value,
}: {
	label: string;
	value: LocalizedText;
}) {
	return (
		<div className="space-y-2 rounded-lg border p-3">
			<p className="font-medium">{label}</p>

			<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
				<div>
					<p className="text-xs font-medium text-muted-foreground">English</p>
					<p className="whitespace-pre-line text-sm text-muted-foreground">
						{value.en || "-"}
					</p>
				</div>

				<div>
					<p className="text-xs font-medium text-muted-foreground">Vietnamese</p>
					<p className="whitespace-pre-line text-sm text-muted-foreground">
						{value.vi || "-"}
					</p>
				</div>
			</div>
		</div>
	);
}

export function HeroAboutSectionPreview() {
	const heroAboutInfo = useHeroAboutInfo();

	return (
		<div className="space-y-4 rounded-lg bg-muted/50 p-6">
			<h4 className="text-lg font-semibold">Hero About Section Preview</h4>

			<div className="grid grid-cols-1 gap-4">
				<LocalizedPreviewItem label="Title" value={heroAboutInfo.title} />
				<LocalizedPreviewItem
					label="Description"
					value={heroAboutInfo.description}
				/>
			</div>
		</div>
	);
}

export function AboutContentPreview() {
	const heroAboutInfo = useHeroAboutInfo();

	return (
		<div className="space-y-6 rounded-lg bg-primary p-6 text-primary-foreground">
			<h4 className="text-lg font-semibold">Hero About Preview</h4>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div className="space-y-4">
					<div className="flex items-start">
						<MapPin className="mr-3 mt-1 size-5 flex-shrink-0" />

						<div>
							<p className="font-medium">English</p>
							<p className="whitespace-pre-line text-sm text-primary-foreground/80">
								{heroAboutInfo.title.en}
							</p>
							<p className="whitespace-pre-line text-sm text-primary-foreground/80">
								{heroAboutInfo.description.en}
							</p>
						</div>
					</div>

					<div className="flex items-start">
						<MapPin className="mr-3 mt-1 size-5 flex-shrink-0" />

						<div>
							<p className="font-medium">Vietnamese</p>
							<p className="whitespace-pre-line text-sm text-primary-foreground/80">
								{heroAboutInfo.title.vi}
							</p>
							<p className="whitespace-pre-line text-sm text-primary-foreground/80">
								{heroAboutInfo.description.vi}
							</p>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<p className="font-medium">Hero About Gallery</p>

					<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
						{heroAboutInfo.gallery.length > 0 ? (
							[...heroAboutInfo.gallery]
								.sort((a, b) => a.order - b.order)
								.map((image) => (
									<img
										key={image.url}
										src={image.url}
										alt="HeroAbout gallery"
										className="h-24 w-full rounded object-cover"
									/>
								))
						) : (
							<p className="text-sm text-primary-foreground/70">
								No gallery images
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export function ExtraHeroAboutPreview() {
	const heroAboutInfo = useHeroAboutInfo();

	return (
		<div className="space-y-8 rounded-lg border p-6">
			<h4 className="text-lg font-semibold">
				Additional Hero About Content Preview
			</h4>

			<div className="space-y-4">
				<h5 className="font-semibold">Contact & Video Information</h5>

				<div className="grid grid-cols-1 gap-4">
					<LocalizedPreviewItem
						label="Factory Address"
						value={heroAboutInfo.factoryaddress}
					/>
					<LocalizedPreviewItem
						label="Office Address"
						value={heroAboutInfo.officeaddress}
					/>
					<LocalizedPreviewItem
						label="Youtube Link"
						value={heroAboutInfo.youtubelink}
					/>
					<LocalizedPreviewItem
						label="Video Title"
						value={heroAboutInfo.videotitle}
					/>
					<LocalizedPreviewItem
						label="Video Description"
						value={heroAboutInfo.videodescription}
					/>
				</div>
			</div>

			<div className="space-y-4">
				<h5 className="font-semibold">History Information</h5>

				<div className="grid grid-cols-1 gap-4">
					<LocalizedPreviewItem
						label="History Section Title"
						value={heroAboutInfo.historytitle}
					/>
					<LocalizedPreviewItem
						label="History Description"
						value={heroAboutInfo.historydescription}
					/>
					<LocalizedPreviewItem
						label="History Time 1"
						value={heroAboutInfo.historytime1}
					/>
					<LocalizedPreviewItem
						label="History Title 1"
						value={heroAboutInfo.historytitle1}
					/>
					<LocalizedPreviewItem
						label="History Detail 1"
						value={heroAboutInfo.historydetail1}
					/>
					<LocalizedPreviewItem
						label="History Time 2"
						value={heroAboutInfo.historytime2}
					/>
					<LocalizedPreviewItem
						label="History Title 2"
						value={heroAboutInfo.historytitle2}
					/>
					<LocalizedPreviewItem
						label="History Detail 2"
						value={heroAboutInfo.historydetail2}
					/>
					<LocalizedPreviewItem
						label="History Time 3"
						value={heroAboutInfo.historytime3}
					/>
					<LocalizedPreviewItem
						label="History Title 3"
						value={heroAboutInfo.historytitle3}
					/>
					<LocalizedPreviewItem
						label="History Detail 3"
						value={heroAboutInfo.historydetail3}
					/>
				</div>
			</div>

			<div className="space-y-4">
				<h5 className="font-semibold">Value Statement</h5>

				<div className="grid grid-cols-1 gap-4">
					<LocalizedPreviewItem
						label="Value Statement Section Title"
						value={heroAboutInfo.valuestatementtitle}
					/>
					<LocalizedPreviewItem
						label="Value Statement Title 1"
						value={heroAboutInfo.valuestatementtitle1}
					/>
					<LocalizedPreviewItem
						label="Value Statement Detail 1"
						value={heroAboutInfo.valuestatementdetail1}
					/>
					<LocalizedPreviewItem
						label="Value Statement Title 2"
						value={heroAboutInfo.valuestatementtitle2}
					/>
					<LocalizedPreviewItem
						label="Value Statement Detail 2"
						value={heroAboutInfo.valuestatementdetail2}
					/>
					<LocalizedPreviewItem
						label="Value Statement Title 3"
						value={heroAboutInfo.valuestatementtitle3}
					/>
					<LocalizedPreviewItem
						label="Value Statement Detail 3"
						value={heroAboutInfo.valuestatementdetail3}
					/>
				</div>
			</div>

			<div className="space-y-4">
				<h5 className="font-semibold">Capacity Information</h5>

				<div className="grid grid-cols-1 gap-4">
					<LocalizedPreviewItem
						label="Capacity Section Title"
						value={heroAboutInfo.capacitytitle}
					/>
					<LocalizedPreviewItem
						label="Capacity Description"
						value={heroAboutInfo.capacitydescription}
					/>
					<LocalizedPreviewItem
						label="Capacity Title 1"
						value={heroAboutInfo.capacitytitle1}
					/>
					<LocalizedPreviewItem
						label="Capacity Detail 1"
						value={heroAboutInfo.capacitydetail1}
					/>
					<LocalizedPreviewItem
						label="Capacity Title 2"
						value={heroAboutInfo.capacitytitle2}
					/>
					<LocalizedPreviewItem
						label="Capacity Detail 2"
						value={heroAboutInfo.capacitydetail2}
					/>
					<LocalizedPreviewItem
						label="Capacity Title 3"
						value={heroAboutInfo.capacitytitle3}
					/>
					<LocalizedPreviewItem
						label="Capacity Detail 3"
						value={heroAboutInfo.capacitydetail3}
					/>
					<LocalizedPreviewItem
						label="Capacity Title 4"
						value={heroAboutInfo.capacitytitle4}
					/>
					<LocalizedPreviewItem
						label="Capacity Detail 4"
						value={heroAboutInfo.capacitydetail4}
					/>
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
					How your hero about information will appear in the hero about section
				</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="space-y-8">
					<HeroAboutSectionPreview />
					<AboutContentPreview />
					<ExtraHeroAboutPreview />
				</div>
			</CardContent>
		</Card>
	);
}