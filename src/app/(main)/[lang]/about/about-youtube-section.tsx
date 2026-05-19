import type { Locale } from "src/lib/i18n/config";
import { getHeroAboutInfo } from "src/server/heroabout";

interface AboutYoutubeSectionProps {
	locale: Locale;
}

const uiText = {
	vi: {
		eyebrow: "Video giới thiệu",
		iframeTitle: "Video giới thiệu Nghiệp Hưng",
	},
	en: {
		eyebrow: "Introduction video",
		iframeTitle: "Nghiep Hung introduction video",
	},
};

function getYoutubeVideoId(value: string) {
	const youtubeValue = value.trim();

	if (!youtubeValue) {
		return "";
	}

	if (/^[a-zA-Z0-9_-]{11}$/.test(youtubeValue)) {
		return youtubeValue;
	}

	try {
		const url = new URL(youtubeValue);
		const hostname = url.hostname.replace("www.", "");

		if (hostname === "youtu.be") {
			return url.pathname.split("/").filter(Boolean)[0] || "";
		}

		if (hostname === "youtube.com" || hostname === "m.youtube.com") {
			const videoId = url.searchParams.get("v");

			if (videoId) {
				return videoId;
			}

			const pathParts = url.pathname.split("/").filter(Boolean);

			if (pathParts[0] === "embed" || pathParts[0] === "shorts") {
				return pathParts[1] || "";
			}
		}
	} catch {
		return youtubeValue;
	}

	return "";
}

export default async function AboutYoutubeSection({
	locale,
}: AboutYoutubeSectionProps) {
	const heroAboutInfo = await getHeroAboutInfo();

	const lang = locale === "en" ? "en" : "vi";
	const text = uiText[lang];

	const youtubeLink = heroAboutInfo.youtubelink[lang] || "";
	const videoTitle = heroAboutInfo.videotitle[lang] || "";
	const videoDescription = heroAboutInfo.videodescription[lang] || "";

	const youtubeVideoId = getYoutubeVideoId(youtubeLink);
	const youtubeEmbedUrl = youtubeVideoId
		? `https://www.youtube-nocookie.com/embed/${youtubeVideoId}`
		: "";

	return (
		<section className="w-full border-y border-[#E7D0AF] bg-[#FAF7F0] px-4 py-10 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.58fr_0.42fr] lg:items-center">
				<div className="overflow-hidden border border-[#E7D0AF] bg-[#342312]">
					<div className="relative aspect-video w-full">
						{youtubeEmbedUrl ? (
							<iframe
								className="absolute inset-0 h-full w-full"
								src={youtubeEmbedUrl}
								title={videoTitle || text.iframeTitle}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowFullScreen
							/>
						) : null}
					</div>
				</div>

				<div className="lg:pl-4">
					<p className="text-[14px] font-bold uppercase tracking-[0.2em] text-[#A87E3C]">
						{text.eyebrow}
					</p>

					<h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#342312] sm:text-4xl">
						{videoTitle}
					</h2>

					<p className="mt-7 border-l-2 border-[#A87E3C] pl-4 text-[17px] font-semibold leading-7 text-[#342312]">
						{videoDescription}
					</p>
				</div>
			</div>
		</section>
	);
}