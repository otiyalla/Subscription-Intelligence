import { screen, waitFor } from "@testing-library/react";

import { DashboardPage } from "@/features/dashboard/dashboard-page";
import { getDemoDashboard } from "@/lib/revenuecat/demo-adapter";
import { renderWithProviders } from "@/lib/test/render";

describe("DashboardPage", () => {
  it("renders dashboard metrics with demo data", async () => {
    const payload = await getDemoDashboard({
      range: "30d",
      filters: {
        product: "all",
        region: "all",
        platform: "all",
      },
    });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => payload,
      }),
    );

    renderWithProviders(<DashboardPage />);

    await waitFor(() =>
      expect(screen.getByTestId("kpi-mrr")).toBeInTheDocument(),
    );
    expect(screen.getByText(/what changed/i)).toBeInTheDocument();
  });

  it("renders a loading skeleton while data is pending", () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => undefined)));

    renderWithProviders(<DashboardPage />);

    expect(screen.getByTestId("dashboard-loading-state")).toBeInTheDocument();
  });

  it("renders an empty state when no overview metrics are returned", async () => {
    const payload = await getDemoDashboard({
      range: "30d",
      filters: {
        product: "all",
        region: "all",
        platform: "all",
      },
    });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          ...payload,
          overview: [],
        }),
      }),
    );

    renderWithProviders(<DashboardPage />);

    await waitFor(() =>
      expect(screen.getByText(/no metrics returned/i)).toBeInTheDocument(),
    );
  });
});
