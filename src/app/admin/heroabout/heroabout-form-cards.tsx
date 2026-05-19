"use client";

import { Upload } from "lucide-react";
import {
	FormField,
	FormHelpText,
	FormInput,
	FormLabel,
} from "src/components/form-field";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "src/components/ui/card";
import { Textarea } from "src/components/ui/textarea";
import { uploadHeroAboutGalleryImage } from "./heroabout.actions";
import {
	useGallery,
	useHeroAboutActions,
	useHeroAboutInfo,
} from "./heroabout-context";
import type { HeroAboutInfo } from "./heroabout.type";

type LocalizedHeroAboutField = Exclude<keyof HeroAboutInfo, "gallery">;

export function HeroAboutDetailsFormCard() {
	const heroAboutInfo = useHeroAboutInfo();
	const { setHeroAboutInfo } = useHeroAboutActions();
	const { gallery, addGalleryImage, removeGalleryImage } = useGallery();

	const updateField = (
		field: LocalizedHeroAboutField,
		lang: "en" | "vi",
		value: string,
	) => {
		setHeroAboutInfo({
			...heroAboutInfo,
			[field]: {
				...heroAboutInfo[field],
				[lang]: value,
			},
		});
	};

	const renderLocalizedField = (
		field: LocalizedHeroAboutField,
		label: string,
		rows = 3,
	) => {
		return (
			<div key={field} className="grid gap-6 md:grid-cols-2">
				<FormField
					fieldId={`${field}En`}
					label={`${label} (English)`}
					value={heroAboutInfo[field].en}
				>
					<FormLabel>{label} (EN)</FormLabel>

					<FormInput asChild>
						<Textarea
							name={`${field}En`}
							rows={rows}
							value={heroAboutInfo[field].en}
							onChange={(e) => updateField(field, "en", e.target.value)}
						/>
					</FormInput>

					<FormHelpText />
				</FormField>

				<FormField
					fieldId={`${field}Vi`}
					label={`${label} (Vietnamese)`}
					value={heroAboutInfo[field].vi}
				>
					<FormLabel>{label} (VI)</FormLabel>

					<FormInput asChild>
						<Textarea
							name={`${field}Vi`}
							rows={rows}
							value={heroAboutInfo[field].vi}
							onChange={(e) => updateField(field, "vi", e.target.value)}
						/>
					</FormInput>

					<FormHelpText />
				</FormField>
			</div>
		);
	};

	async function handleUpload(files: FileList | File[]) {
		const fileArray = Array.from(files);

		for (const [index, file] of fileArray.entries()) {
			const formData = new FormData();
			formData.append("image", file);

			const result = await uploadHeroAboutGalleryImage(formData);

			if (!result.success) {
				alert(result.error);
				continue;
			}

			addGalleryImage({
				url: result.data,
				order: gallery.length + index,
			});
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>HeroAbout Details</CardTitle>

				<CardDescription>
					Title, description and content shown in hero about section
				</CardDescription>
			</CardHeader>

			<CardContent className="grid gap-8">
				{renderLocalizedField("title", "Title", 2)}
				{renderLocalizedField("description", "Description", 3)}
				{renderLocalizedField("factoryaddress", "Factory Address", 3)}
				{renderLocalizedField("officeaddress", "Office Address", 3)}

				<div className="space-y-4">
					<label className="text-sm font-medium">HeroAbout GALLERY</label>

					<label
						className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#342312] bg-white p-8 text-center hover:bg-[#faf7f3]"
						onDragOver={(e) => {
							e.preventDefault();
						}}
						onDrop={(e) => {
							e.preventDefault();

							const files = e.dataTransfer.files;
							if (!files || files.length === 0) return;

							handleUpload(files);
						}}
					>
						<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5efe8]">
							<Upload className="h-8 w-8 text-[#342312]" />
						</div>

						<p className="text-lg font-semibold text-[#342312]">
							Upload Images
						</p>

						<p className="text-sm text-muted-foreground">
							Click here or drag and drop your images
						</p>

						<input
							type="file"
							accept="image/*"
							multiple
							className="hidden"
							onChange={(e) => {
								const files = e.target.files;
								if (!files || files.length === 0) return;

								handleUpload(files);
								e.target.value = "";
							}}
						/>
					</label>

					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
						{gallery.map((img) => (
							<div
								key={img.url}
								className="relative h-28 overflow-hidden rounded-lg border-2 border-[#342312]"
							>
								<img
									src={img.url}
									alt="HeroAbout gallery"
									className="h-full w-full object-cover"
								/>

								<button
									type="button"
									onClick={() => removeGalleryImage(img.url)}
									className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#342312] text-sm text-white"
								>
									×
								</button>
							</div>
						))}
					</div>

					<input type="hidden" name="gallery" value={JSON.stringify(gallery)} />
				</div>

				<div className="grid gap-6 border-t pt-6">
					<h3 className="text-lg font-semibold">
						Contact & Video Information
					</h3>

					{renderLocalizedField("youtubelink", "Youtube Link", 2)}
					{renderLocalizedField("videotitle", "Video Title", 2)}
					{renderLocalizedField("videodescription", "Video Description", 4)}
				</div>

				<div className="grid gap-6 border-t pt-6">
					<h3 className="text-lg font-semibold">History Information</h3>

					{renderLocalizedField("historytitle", "History Section Title", 2)}
					{renderLocalizedField("historydescription", "History Description", 4)}
					{renderLocalizedField("historytime1", "History Time 1", 2)}
					{renderLocalizedField("historytitle1", "History Title 1", 2)}
					{renderLocalizedField("historydetail1", "History Detail 1", 4)}
					{renderLocalizedField("historytime2", "History Time 2", 2)}
					{renderLocalizedField("historytitle2", "History Title 2", 2)}
					{renderLocalizedField("historydetail2", "History Detail 2", 4)}
					{renderLocalizedField("historytime3", "History Time 3", 2)}
					{renderLocalizedField("historytitle3", "History Title 3", 2)}
					{renderLocalizedField("historydetail3", "History Detail 3", 4)}
				</div>

				<div className="grid gap-6 border-t pt-6">
					<h3 className="text-lg font-semibold">Value Statement</h3>

					{renderLocalizedField(
						"valuestatementtitle",
						"Value Statement Section Title",
						2,
					)}
					{renderLocalizedField(
						"valuestatementtitle1",
						"Value Statement Title 1",
						2,
					)}
					{renderLocalizedField(
						"valuestatementdetail1",
						"Value Statement Detail 1",
						4,
					)}
					{renderLocalizedField(
						"valuestatementtitle2",
						"Value Statement Title 2",
						2,
					)}
					{renderLocalizedField(
						"valuestatementdetail2",
						"Value Statement Detail 2",
						4,
					)}
					{renderLocalizedField(
						"valuestatementtitle3",
						"Value Statement Title 3",
						2,
					)}
					{renderLocalizedField(
						"valuestatementdetail3",
						"Value Statement Detail 3",
						4,
					)}
				</div>

				<div className="grid gap-6 border-t pt-6">
					<h3 className="text-lg font-semibold">Capacity Information</h3>

					{renderLocalizedField("capacitytitle", "Capacity Section Title", 2)}
					{renderLocalizedField("capacitydescription", "Capacity Description", 4)}
					{renderLocalizedField("capacitytitle1", "Capacity Title 1", 2)}
					{renderLocalizedField("capacitydetail1", "Capacity Detail 1", 4)}
					{renderLocalizedField("capacitytitle2", "Capacity Title 2", 2)}
					{renderLocalizedField("capacitydetail2", "Capacity Detail 2", 4)}
					{renderLocalizedField("capacitytitle3", "Capacity Title 3", 2)}
					{renderLocalizedField("capacitydetail3", "Capacity Detail 3", 4)}
					{renderLocalizedField("capacitytitle4", "Capacity Title 4", 2)}
					{renderLocalizedField("capacitydetail4", "Capacity Detail 4", 4)}
				</div>
			</CardContent>
		</Card>
	);
}