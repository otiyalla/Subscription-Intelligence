import { getLiveDashboard, runLiveQuery } from "@/lib/revenuecat/live-adapter";

describe("live adapter", () => {
  beforeEach(() => {
    process.env.REVENUECAT_API_KEY = "test-key";
    process.env.REVENUECAT_PROJECT_ID = "project-123";
    process.env.REVENUECAT_API_BASE_URL = "https://api.revenuecat.com/v2";
    delete process.env.REVENUECAT_CHART_PATH_TEMPLATE;
    delete process.env.REVENUECAT_OVERVIEW_PATH_TEMPLATE;
  });

  it("uses RevenueCat chart names supported by the live dashboard", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes("/metrics/overview")) {
        return {
          ok: true,
          json: async () => ({ mrr: 250 }),
        } satisfies Partial<Response>;
      }

      return {
        ok: true,
        json: async () => [
          { date: "2026-03-01", value: 100 },
          { date: "2026-03-02", value: 120 },
          { date: "2026-03-03", value: 140 },
          { date: "2026-03-04", value: 160 },
          { date: "2026-03-05", value: 180 },
          { date: "2026-03-06", value: 200 },
          { date: "2026-03-07", value: 220 },
          { date: "2026-03-08", value: 240 },
        ],
      } satisfies Partial<Response>;
    });

    vi.stubGlobal("fetch", fetchMock);

    await getLiveDashboard({
      range: "30d",
      filters: {
        product: "all",
        region: "all",
        platform: "all",
      },
    });

    const urls = fetchMock.mock.calls.map(([input]) => String(input));

    expect(urls).toContain(
      "https://api.revenuecat.com/projects/project-123/metrics/overview?range=30d&product=all&region=all&platform=all",
    );
    expect(urls).toContain(
      "https://api.revenuecat.com/projects/project-123/charts/actives?range=30d&product=all&region=all&platform=all",
    );
    expect(urls).toContain(
      "https://api.revenuecat.com/projects/project-123/charts/churn?range=30d&product=all&region=all&platform=all",
    );
    expect(urls).not.toContain(
      "https://api.revenuecat.com/projects/project-123/charts/subscriptions?range=30d&product=all&region=all&platform=all",
    );
  });

  it("maps subscriptions queries to the actives chart", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { date: "2026-03-01", value: 10 },
        { date: "2026-03-02", value: 12 },
        { date: "2026-03-03", value: 14 },
        { date: "2026-03-04", value: 16 },
      ],
    });

    vi.stubGlobal("fetch", fetchMock);

    const response = await runLiveQuery({
      metric: "subscriptions",
      range: "30d",
      comparePrevious: true,
      filters: {
        product: "all",
        region: "all",
        platform: "all",
      },
    });

    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("/charts/actives?");
    expect(response.points).toEqual([
      { date: "2026-03-01", value: 10 },
      { date: "2026-03-02", value: 12 },
      { date: "2026-03-03", value: 14 },
      { date: "2026-03-04", value: 16 },
    ]);
  });

  it("derives arpu from revenue divided by actives", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes("/charts/revenue")) {
        return {
          ok: true,
          json: async () => [
            { date: "2026-03-01", value: 200 },
            { date: "2026-03-02", value: 180 },
          ],
        } satisfies Partial<Response>;
      }

      return {
        ok: true,
        json: async () => [
          { date: "2026-03-01", value: 10 },
          { date: "2026-03-02", value: 12 },
        ],
      } satisfies Partial<Response>;
    });

    vi.stubGlobal("fetch", fetchMock);

    const response = await runLiveQuery({
      metric: "arpu",
      range: "30d",
      comparePrevious: true,
      filters: {
        product: "all",
        region: "all",
        platform: "all",
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(response.points).toEqual([
      { date: "2026-03-01", value: 20 },
      { date: "2026-03-02", value: 15 },
    ]);
  });
});
