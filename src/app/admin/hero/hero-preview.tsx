"use client";

import { MapPin } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "src/components/ui/card";
import { useHeroInfo } from "./hero-context";
import type { HeroImage } from "./hero.type";

function ImageGalleryPreview({
	title,
	gallery,
}: {
	title: string;
	gallery: HeroImage[];
}) {
	const sortedGallery = [...gallery].sort((a, b) => a.order - b.order);

	return (
		<div className="space-y-3">
			<p className="font-medium">{title}</p>

			{sortedGallery.length > 0 ? (
				<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
					{sortedGallery.map((image) => (
						<img
							key={image.url}
							src={image.url}
							alt={title}
							className="h-24 w-full rounded object-cover"
						/>
					))}
				</div>
			) : (
				<p className="text-sm text-muted-foreground">No images</p>
			)}
		</div>
	);
}

function SingleImagePreview({
	title,
	imageUrl,
}: {
	title: string;
	imageUrl: string;
}) {
	return (
		<div className="space-y-3">
			<p className="font-medium">{title}</p>

			{imageUrl ? (
				<img
					src={imageUrl}
					alt={title}
					className="h-32 w-full rounded object-cover"
				/>
			) : (
				<p className="text-sm text-muted-foreground">No image</p>
			)}
		</div>
	);
}

function LocalizedTextPreview({
	title,
	en,
	vi,
}: {
	title: string;
	en: string;
	vi: string;
}) {
	return (
		<div className="space-y-3 rounded-lg border bg-muted/30 p-4">
			<p className="font-semibold">{title}</p>

			<div>
				<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
					English
				</p>

				<p className="whitespace-pre-line text-sm text-muted-foreground">
					{en || "—"}
				</p>
			</div>

			<div>
				<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
					Vietnamese
				</p>

				<p className="whitespace-pre-line text-sm text-muted-foreground">
					{vi || "—"}
				</p>
			</div>
		</div>
	);
}

export function HeroSectionPreview() {
	const heroInfo = useHeroInfo();

	return (
		<div className="space-y-5 rounded-lg bg-muted/50 p-6">
			<h4 className="text-lg font-semibold">Hero Section Preview</h4>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<LocalizedTextPreview
					title="Hero Title"
					en={heroInfo.title.en}
					vi={heroInfo.title.vi}
				/>

				<LocalizedTextPreview
					title="Hero Description"
					en={heroInfo.description.en}
					vi={heroInfo.description.vi}
				/>
			</div>

			<ImageGalleryPreview title="Hero Gallery" gallery={heroInfo.gallery} />
		</div>
	);
}

export function HomeContentPreview() {
	const heroInfo = useHeroInfo();

	return (
		<div className="space-y-6 rounded-lg bg-muted/50 p-6">
			<h4 className="text-lg font-semibold">Home Content Preview</h4>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<LocalizedTextPreview
					title="Product Title"
					en={heroInfo.productitle.en}
					vi={heroInfo.productitle.vi}
				/>

				<LocalizedTextPreview
					title="Product Description"
					en={heroInfo.productdescription.en}
					vi={heroInfo.productdescription.vi}
				/>

				<LocalizedTextPreview
					title="Service Title"
					en={heroInfo.servicetitle.en}
					vi={heroInfo.servicetitle.vi}
				/>

				<LocalizedTextPreview
					title="Service Description"
					en={heroInfo.servicedesription.en}
					vi={heroInfo.servicedesription.vi}
				/>

				<LocalizedTextPreview
					title="Machine Section Title"
					en={heroInfo.machinetitle.en}
					vi={heroInfo.machinetitle.vi}
				/>

				<LocalizedTextPreview
					title="Machine Section Description"
					en={heroInfo.machinedescription.en}
					vi={heroInfo.machinedescription.vi}
				/>

				<SingleImagePreview
					title="Machine Background Image"
					imageUrl={heroInfo.machinebackgroundimage.url}
				/>

				<LocalizedTextPreview
					title="Client Title"
					en={heroInfo.clienttitle.en}
					vi={heroInfo.clienttitle.vi}
				/>

				<LocalizedTextPreview
					title="Client Description"
					en={heroInfo.clientdescription.en}
					vi={heroInfo.clientdescription.vi}
				/>

				<LocalizedTextPreview
					title="Project Title"
					en={heroInfo.projecttitle.en}
					vi={heroInfo.projecttitle.vi}
				/>
			</div>
		</div>
	);
}

export function MachineryPreview() {
	const heroInfo = useHeroInfo();

	const machines = [
		{
			number: "01",
			title: heroInfo.machine1title,
			subtitle: heroInfo.machine1subtitle,
			description: heroInfo.machine1description,
			image: heroInfo.machine1image,
		},
		{
			number: "02",
			title: heroInfo.machine2title,
			subtitle: heroInfo.machine2subtitle,
			description: heroInfo.machine2description,
			image: heroInfo.machine2image,
		},
		{
			number: "03",
			title: heroInfo.machine3title,
			subtitle: heroInfo.machine3subtitle,
			description: heroInfo.machine3description,
			image: heroInfo.machine3image,
		},
	];

	return (
		<div className="space-y-5 rounded-lg bg-muted/50 p-6">
			<h4 className="text-lg font-semibold">Machinery Preview</h4>

			<div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
				{machines.map((machine) => (
					<div key={machine.number} className="space-y-4 rounded-lg border p-4">
						<p className="text-sm font-bold text-primary">
							Machine {machine.number}
						</p>

						<SingleImagePreview
							title={`Machine ${machine.number} Image`}
							imageUrl={machine.image.url}
						/>

						<LocalizedTextPreview
							title="Title"
							en={machine.title.en}
							vi={machine.title.vi}
						/>

						<LocalizedTextPreview
							title="Subtitle"
							en={machine.subtitle.en}
							vi={machine.subtitle.vi}
						/>

						<LocalizedTextPreview
							title="Description"
							en={machine.description.en}
							vi={machine.description.vi}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

export function FooterPreview() {
	const heroInfo = useHeroInfo();

	return (
		<div className="space-y-5 rounded-lg bg-primary p-6 text-primary-foreground">
			<h4 className="text-lg font-semibold">Simple Hero Preview</h4>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div className="space-y-4">
					<div className="flex items-start">
						<MapPin className="mr-3 mt-1 size-5 flex-shrink-0" />

						<div>
							<p className="font-medium">English</p>

							<p className="whitespace-pre-line text-sm text-primary-foreground/80">
								{heroInfo.title.en}
							</p>

							<p className="whitespace-pre-line text-sm text-primary-foreground/80">
								{heroInfo.description.en}
							</p>
						</div>
					</div>

					<div className="flex items-start">
						<MapPin className="mr-3 mt-1 size-5 flex-shrink-0" />

						<div>
							<p className="font-medium">Vietnamese</p>

							<p className="whitespace-pre-line text-sm text-primary-foreground/80">
								{heroInfo.title.vi}
							</p>

							<p className="whitespace-pre-line text-sm text-primary-foreground/80">
								{heroInfo.description.vi}
							</p>
						</div>
					</div>
				</div>

				<ImageGalleryPreview title="Hero Gallery" gallery={heroInfo.gallery} />
			</div>
		</div>
	);
}

export function PreviewSection() {
	const heroInfo = useHeroInfo();

	return (
		<Card className="mt-8">
			<CardHeader>
				<CardTitle>Preview</CardTitle>

				<CardDescription>
					How your hero and home information will appear on the website
				</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="space-y-8">
					<HeroSectionPreview />
					<HomeContentPreview />
					<MachineryPreview />

					<div className="rounded-lg bg-muted/50 p-6">
						<ImageGalleryPreview
							title="Client Image Gallery"
							gallery={heroInfo.clientimagegallery}
						/>
					</div>

					<FooterPreview />
				</div>
			</CardContent>
		</Card>
	);
}