import { beforeEach, describe, expect, it, vi } from "vitest";

const { getHeroBrandInfoMock } = vi.hoisted(() => ({
	getHeroBrandInfoMock: vi.fn(),
}));

vi.mock("src/server/herobrand", () => ({
	getHeroBrandInfo: getHeroBrandInfoMock,
}));

import { GET } from "src/app/favicon.ico/route";

describe("favicon route", () => {
	beforeEach(() => {
		getHeroBrandInfoMock.mockReset();
	});

	it("redirects to the database-backed company logo", async () => {
		getHeroBrandInfoMock.mockResolvedValue({
			logo: { url: "https://cdn.example.com/company-logo.png" },
			companyName: { vi: "Nghiệp Hưng", en: "Nghiep Hung" },
		});

		const response = await GET(new Request("https://demo.nghiephung.vn/favicon.ico"));

		expect(response.status).toBe(307);
		expect(response.headers.get("location")).toBe("https://cdn.example.com/company-logo.png");
		expect(response.headers.get("cache-control")).toBe("no-store, max-age=0");
	});

	it("supports a company logo stored under a local public URL", async () => {
		getHeroBrandInfoMock.mockResolvedValue({
			logo: { url: "/uploads/herobrand/company-logo.svg" },
			companyName: { vi: "", en: "" },
		});

		const response = await GET(new Request("https://demo.nghiephung.vn/favicon.ico"));

		expect(response.headers.get("location")).toBe(
			"https://demo.nghiephung.vn/uploads/herobrand/company-logo.svg",
		);
	});

	it("falls back to the bundled logo when the database is unavailable", async () => {
		getHeroBrandInfoMock.mockRejectedValue(new Error("MongoDB is unavailable"));

		const response = await GET(new Request("https://demo.nghiephung.vn/favicon.ico"));

		expect(response.status).toBe(307);
		expect(response.headers.get("location")).toBe(
			"https://demo.nghiephung.vn/nghiep_hung_logo_no_bg.svg",
		);
	});
});
