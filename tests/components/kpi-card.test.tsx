import { screen } from "@testing-library/react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { renderWithProviders } from "@/lib/test/render";

describe("KpiCard", () => {
  it("renders formatted KPI data", () => {
    renderWithProviders(
      <KpiCard
        metric={{
          key: "mrr",
          label: "MRR",
          value: 15420,
          changePct: 8.2,
          format: "currency",
          emphasis: "positive",
          hint: "Monthly recurring revenue",
        }}
      />,
    );

    expect(screen.getByText("MRR")).toBeInTheDocument();
    expect(screen.getByText("$15,420")).toBeInTheDocument();
    expect(screen.getByText("+8.2%")).toBeInTheDocument();
  });
});
