import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ServiceMobileNavigation } from "src/app/(main)/[lang]/services/service-mobile-navigation";
import { describe, expect, it } from "vitest";

describe("ServiceMobileNavigation", () => {
	it("opens the service dialog and closes it after following a service link", async () => {
		const user = userEvent.setup();

		render(
			<ServiceMobileNavigation
				locale="vi"
				items={[
					{ id: "installation", name: "Thi công ống gió" },
					{ id: "maintenance", name: "Bảo trì hệ thống" },
				]}
			/>,
		);

		const trigger = screen.getByRole("button", {
			name: /Dịch vụ Nghiệp Hưng/i,
		});

		expect(screen.queryByRole("dialog", { name: /Dịch vụ Nghiệp Hưng/i })).not.toBeInTheDocument();

		await user.click(trigger);

		const dialog = await screen.findByRole("dialog", {
			name: /Dịch vụ Nghiệp Hưng/i,
		});
		const installationLink = within(dialog).getByRole("link", {
			name: "Thi công ống gió",
		});
		const maintenanceLink = within(dialog).getByRole("link", {
			name: "Bảo trì hệ thống",
		});

		expect(installationLink).toHaveAttribute("href", "/vi/services/installation");
		expect(maintenanceLink).toHaveAttribute("href", "/vi/services/maintenance");

		await user.click(installationLink);

		await waitFor(() => {
			expect(
				screen.queryByRole("dialog", { name: /Dịch vụ Nghiệp Hưng/i }),
			).not.toBeInTheDocument();
		});
	});
});
