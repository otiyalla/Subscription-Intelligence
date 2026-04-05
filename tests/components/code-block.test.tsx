import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CodeBlock } from "@/components/ui/code-block";
import { renderWithProviders } from "@/lib/test/render";

describe("CodeBlock", () => {
  it("copies code to the clipboard and updates button state", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);

    vi.stubGlobal("navigator", {
      clipboard: {
        writeText,
      },
    });

    renderWithProviders(<CodeBlock title="TypeScript snippet" code="const demo = true;" />);

    await user.click(screen.getByRole("button", { name: /copy typescript snippet/i }));

    expect(writeText).toHaveBeenCalledWith("const demo = true;");
    expect(screen.getByRole("button", { name: /copy typescript snippet/i })).toHaveTextContent(
      "Copied",
    );
  });
});
