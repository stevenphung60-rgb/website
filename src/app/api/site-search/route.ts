import { NextResponse } from "next/server";
import { getSiteSearchResults } from "src/server/site-search";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("q") || "";
	const localeParam = searchParams.get("locale");
	const locale = localeParam === "en" ? "en" : "vi";

	try {
		const results = await getSiteSearchResults({
			query,
			locale,
			limit: 10,
		});

		return NextResponse.json({ results });
	} catch (error) {
		console.error("Site search error:", error);

		return NextResponse.json(
			{
				results: [],
				error: "Không thể tìm kiếm nội dung. Vui lòng thử lại.",
			},
			{ status: 500 },
		);
	}
}
