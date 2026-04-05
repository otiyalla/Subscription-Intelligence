import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { InsightsPage } from "@/features/insights/insights-page";
import { generateInsight } from "@/lib/revenuecat/insights";
import { renderWithProviders } from "@/lib/test/render";

describe("InsightsPage", () => {
  it("generates an explanation from a prompt", async () => {
    const result = await generateInsight("Why did MRR drop this week?");
    const user = userEvent.setup();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => result,
      }),
    );

    renderWithProviders(<InsightsPage />);

    await user.click(screen.getByRole("button", { name: /generate insight/i }));

    await waitFor(() =>
      expect(screen.getByTestId("insight-title")).toBeInTheDocument(),
    );
    expect(screen.getByText(/metrics used/i)).toBeInTheDocument();
  });

  it("blocks invalid prompts with inline validation", async () => {
    const user = userEvent.setup();
    renderWithProviders(<InsightsPage />);

    const input = screen.getByLabelText(/prompt/i);
    await user.clear(input);
    await user.type(input, "???");

    expect(
      screen.getByText(/use a natural-language analytics question/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /generate insight/i }),
    ).toBeDisabled();
  });
});
