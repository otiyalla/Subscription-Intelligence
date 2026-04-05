import { studioQuerySchema } from "@/lib/revenuecat/schemas";

describe("studioQuerySchema", () => {
  it("applies defaults for omitted optional values", () => {
    const parsed = studioQuerySchema.parse({
      metric: "mrr",
      filters: {},
    });

    expect(parsed.range).toBe("30d");
    expect(parsed.comparePrevious).toBe(true);
    expect(parsed.filters.product).toBe("all");
  });
});
