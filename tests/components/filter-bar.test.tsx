import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { FilterBar } from "@/components/dashboard/filter-bar";
import { renderWithProviders } from "@/lib/test/render";
import type { RangePreset, StudioFilters } from "@/types/revenuecat";

function FilterHarness() {
  const [range, setRange] = useState<RangePreset>("30d");
  const [filters, setFilters] = useState<StudioFilters>({
    product: "all",
    region: "all",
    platform: "all",
  });

  return (
    <>
      <FilterBar
        range={range}
        setRange={setRange}
        filters={filters}
        setFilters={setFilters}
      />
      <p data-testid="range-value">{range}</p>
      <p data-testid="product-value">{filters.product}</p>
    </>
  );
}

describe("FilterBar", () => {
  it("updates range and product selections", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FilterHarness />);

    await user.selectOptions(screen.getByLabelText(/time range/i), "90d");
    await user.selectOptions(screen.getByLabelText(/product/i), "pro");

    expect(screen.getByTestId("range-value")).toHaveTextContent("90d");
    expect(screen.getByTestId("product-value")).toHaveTextContent("pro");
  });
});
