import { parseInsightPrompt } from "@/lib/revenuecat/insights";
import { insightPromptSchema } from "@/lib/revenuecat/insight-schemas";

describe("parseInsightPrompt", () => {
  it("maps mrr why prompts to an explain intent", () => {
    expect(parseInsightPrompt("Why did MRR drop this week?")).toEqual({
      intent: "explain_mrr_change",
      metric: "mrr",
      range: "7d",
    });
  });

  it("maps compare prompts to period comparison", () => {
    expect(parseInsightPrompt("Compare this month to last month")).toEqual({
      intent: "compare_periods",
      metric: "revenue",
      range: "30d",
    });
  });

  it("falls back to revenue trend for unmatched prompts", () => {
    expect(parseInsightPrompt("tell me something useful")).toEqual({
      intent: "show_revenue_trend",
      metric: "revenue",
      range: "30d",
    });
  });
});

describe("insightPromptSchema", () => {
  it("rejects non-natural-language prompts", () => {
    const parsed = insightPromptSchema.safeParse("???");

    expect(parsed.success).toBe(false);
  });
});
