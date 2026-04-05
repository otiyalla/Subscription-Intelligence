import { screen, waitFor } from "@testing-library/react";

import { DashboardPage } from "@/features/dashboard/dashboard-page";
import { renderWithProviders } from "@/lib/test/render";

describe("error states", () => {
  it("renders a dashboard error panel when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Forced dashboard failure for testing." }),
      }),
    );

    renderWithProviders(<DashboardPage />);

    await waitFor(() =>
      expect(screen.getByText(/dashboard unavailable/i)).toBeInTheDocument(),
    );
  });
});
