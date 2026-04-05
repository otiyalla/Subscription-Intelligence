import { getDemoDashboard, runDemoQuery } from "@/lib/revenuecat/demo-adapter";

describe("demo adapter", () => {
  it("builds dashboard data for the default range", async () => {
    const response = await getDemoDashboard({
      range: "30d",
      filters: {
        product: "all",
        region: "all",
        platform: "all",
      },
    });

    expect(response.mode).toBe("demo");
    expect(response.overview).toHaveLength(6);
    expect(response.series).toHaveLength(30);
    expect(response.highlights).toHaveLength(3);
  });

  it("returns query data for the console", async () => {
    const response = await runDemoQuery({
      metric: "mrr",
      range: "7d",
      comparePrevious: true,
      filters: {
        product: "pro",
        region: "all",
        platform: "ios",
      },
    });

    expect(response.points).toHaveLength(7);
    expect(response.summary.currentValue).toBeGreaterThan(0);
    expect(response.summary.pointCount).toBe(7);
  });
});
