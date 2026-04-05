import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DeveloperConsolePage } from "@/features/console/developer-console-page";
import { runDemoQuery } from "@/lib/revenuecat/demo-adapter";
import { renderWithProviders } from "@/lib/test/render";

describe("DeveloperConsolePage", () => {
  it("runs a query and shows snippets plus JSON", async () => {
    const response = await runDemoQuery({
      metric: "revenue",
      range: "30d",
      comparePrevious: true,
      filters: {
        product: "all",
        region: "all",
        platform: "all",
      },
    });
    const user = userEvent.setup();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => response,
      }),
    );

    renderWithProviders(<DeveloperConsolePage />);

    await waitFor(() =>
      expect(screen.getByText(/request summary/i)).toBeInTheDocument(),
    );
    await user.selectOptions(screen.getByLabelText(/metric/i), "mrr");
    expect(screen.getByText(/typescript snippet/i)).toBeInTheDocument();
    expect(screen.getByTestId("json-response")).toBeInTheDocument();
  });
});
