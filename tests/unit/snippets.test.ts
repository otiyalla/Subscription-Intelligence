import { createCurlSnippet, createTypeScriptSnippet } from "@/lib/revenuecat/snippets";

const request = {
  metric: "revenue" as const,
  range: "30d" as const,
  comparePrevious: true,
  filters: {
    product: "all" as const,
    region: "all" as const,
    platform: "all" as const,
  },
};

describe("snippet generators", () => {
  it("creates a curl snippet", () => {
    const snippet = createCurlSnippet(request);

    expect(snippet).toContain("curl -X POST");
    expect(snippet).toContain("/api/studio/query");
    expect(snippet).toContain('"metric": "revenue"');
  });

  it("creates a TypeScript snippet", () => {
    const snippet = createTypeScriptSnippet(request);

    expect(snippet).toContain('fetch("/api/studio/query"');
    expect(snippet).toContain('method: "POST"');
  });
});
