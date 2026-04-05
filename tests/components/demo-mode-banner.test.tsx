import { screen } from "@testing-library/react";

import { DemoModeBanner } from "@/components/layout/demo-mode-banner";
import { renderWithProviders } from "@/lib/test/render";

describe("DemoModeBanner", () => {
  it("shows the demo mode state", () => {
    renderWithProviders(<DemoModeBanner mode="demo" />);

    expect(screen.getByTestId("demo-mode-banner")).toBeInTheDocument();
    expect(screen.getByText(/demo mode is active/i)).toBeInTheDocument();
  });
});
