"use client";

import { Plus, Share2, Trash2 } from "lucide-react";
import {
	FieldError,
	FormField,
	FormHelpText,
	FormInput,
	FormLabel,
} from "src/components/form-field";
import { Button } from "src/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "src/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "src/components/ui/select";
import { useSocialMediaLinks } from "../contact-context";
import {
	getSocialMediaPlatform,
	SOCIAL_MEDIA_PLATFORMS,
} from "../social-media.config";
import type {
	SocialMediaLinkInput,
	SocialMediaPlatformId,
} from "./social-media.type";

/**
 * Social media form card
 * @returns Social media management form card
 */
export function SocialMediaFormCard() {
	const {
		socialMediaLinks,
		addSocialMediaLink,
		removeSocialMediaLink,
		updateSocialMediaPlatform,
		updateSocialMediaUrl,
	} = useSocialMediaLinks();

	const socialMedia = socialMediaLinks ?? [];

	/**
	 * Convert social media links to input format for form submission
	 * @returns Social media link input array
	 */
	const getSocialMediaLinksForSubmission = (): SocialMediaLinkInput[] => {
		return socialMedia.map((link) => ({
			platformId: link.platformId,
			url: link.url,
		}));
	};

	/**
	 * Get platforms that are not selected by other links
	 * @param currentLinkId - Current link ID
	 * @returns Available social media platforms
	 */
	const getAvailablePlatforms = (currentLinkId: string) => {
		const selectedPlatforms = socialMedia
			.filter((link) => link.id !== currentLinkId)
			.map((link) => link.platformId);

		return SOCIAL_MEDIA_PLATFORMS.filter(
			(platform) =>
				!selectedPlatforms.includes(platform.id as SocialMediaPlatformId),
		);
	};

	/**
	 * Add a new social media link
	 */
	const addLink = () => {
		const availablePlatforms = getAvailablePlatforms("new");

		if (availablePlatforms.length === 0) {
			return;
		}

		addSocialMediaLink(availablePlatforms[0].id as SocialMediaPlatformId);
	};

	return (
		<Card className="w-full border-[#E7D0AF] bg-white shadow-sm">
			<CardHeader className="border-b border-[#E7D0AF]/70">
				<CardTitle className="flex items-center gap-2 font-serif text-xl text-[#342312]">
					<Share2 className="size-5" />
					<span>Mạng xã hội</span>
				</CardTitle>

				<CardDescription className="text-[#342312]/65">
					Quản lý các đường dẫn mạng xã hội hiển thị trên website.
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-5 px-5 py-6">
				<input
					type="hidden"
					name="socialMediaLinks"
					value={JSON.stringify(getSocialMediaLinksForSubmission())}
				/>

				<Button
					type="button"
					variant="outline"
					onClick={addLink}
					className="w-full border-[#E7D0AF] bg-[#FAF7F1] text-[#342312] hover:bg-white"
					disabled={getAvailablePlatforms("new").length === 0}
				>
					<Plus className="mr-2 size-4" />
					Thêm mạng xã hội
				</Button>

				{socialMedia.length > 0 ? (
					<div className="space-y-3">
						{socialMedia.map((link) => {
							const platform = getSocialMediaPlatform(link.platformId);
							const availablePlatforms = getAvailablePlatforms(link.id);

							return (
								<div
									key={link.id}
									className="grid w-full gap-4 rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] p-4 sm:grid-cols-[220px_minmax(0,1fr)_auto] sm:items-start"
								>
									<div className="min-w-0">
										<FormField
											fieldId={`socialMedia-${link.id}-platformId`}
											name={`socialMedia-${link.id}-platformId`}
											required
										>
											<FormLabel>Nền tảng</FormLabel>

											<Select
												value={link.platformId}
												onValueChange={(value: string) =>
													updateSocialMediaPlatform(
														link.id,
														value as SocialMediaPlatformId,
													)
												}
											>
												<SelectTrigger className="w-full border-[#E7D0AF] bg-white text-[#342312]">
													<SelectValue />
												</SelectTrigger>

												<SelectContent className="bg-white">
													{availablePlatforms.map((availablePlatform) => {
														const Icon = availablePlatform.icon;

														return (
															<SelectItem
																key={availablePlatform.id}
																value={availablePlatform.id}
															>
																<div className="flex items-center gap-2">
																	<Icon className="size-4" />
																	<span>{availablePlatform.name}</span>
																</div>
															</SelectItem>
														);
													})}
												</SelectContent>
											</Select>

											<FieldError />
										</FormField>
									</div>

									<div className="min-w-0">
										<FormField
											fieldId={`socialMedia-${link.id}-url`}
											name={`socialMedia-${link.id}-url`}
											placeholder={platform?.placeholder || "https://..."}
											helpText={`Nhập đường dẫn ${platform?.name || "mạng xã hội"}${
												platform?.placeholder
													? `, ví dụ: ${platform.placeholder}`
													: ""
											}`}
										>
											<FormLabel>Đường dẫn</FormLabel>

											<FormInput
												value={link.url}
												onChange={(event) =>
													updateSocialMediaUrl(link.id, event.target.value)
												}
											/>

											<FormHelpText />
											<FieldError />
										</FormField>
									</div>

									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => removeSocialMediaLink(link.id)}
										className="shrink-0 text-destructive hover:text-destructive"
										aria-label="Xóa mạng xã hội"
									>
										<Trash2 className="size-4" />
									</Button>
								</div>
							);
						})}
					</div>
				) : (
					<div className="rounded-xl border border-dashed border-[#E7D0AF] bg-[#FAF7F1] px-4 py-8 text-center">
						<p className="text-sm font-medium text-[#342312]">
							Chưa có mạng xã hội nào
						</p>

						<p className="mt-1 text-xs leading-5 text-[#342312]/65">
							Bấm “Thêm mạng xã hội” để thêm Facebook, Zalo, YouTube hoặc các nền tảng khác.
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}