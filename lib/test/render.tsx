import { render } from "@testing-library/react";
import type { ReactElement } from "react";

import { AppProviders } from "@/components/providers/app-providers";

export function renderWithProviders(ui: ReactElement) {
  return render(<AppProviders mode="demo">{ui}</AppProviders>);
}
