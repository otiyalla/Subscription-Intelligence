import { runStudioQuery } from "@/lib/revenuecat/service";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import type {
  InsightIntent,
  InsightResult,
  QueryMetric,
  RangePreset,
  StudioFilters,
} from "@/types/revenuecat";

type ParsedPrompt = {
  intent: InsightIntent;
  metric: QueryMetric;
  range: RangePreset;
};

export function parseInsightPrompt(prompt: string): ParsedPrompt {
  const normalized = prompt.toLowerCase();

  if (normalized.includes("why") && normalized.includes("mrr")) {
    return {
      intent: "explain_mrr_change",
      metric: "mrr",
      range: normalized.includes("week") ? "7d" : "30d",
    };
  }

  if (normalized.includes("churn")) {
    return {
      intent: "show_churn_trend",
      metric: "churn_rate",
      range: normalized.includes("30") ? "30d" : "90d",
    };
  }

  if (normalized.includes("compare")) {
    return {
      intent: "compare_periods",
      metric: normalized.includes("subscription") ? "subscriptions" : "revenue",
      range: normalized.includes("month") ? "30d" : "7d",
    };
  }

  if (normalized.includes("subscription")) {
    return {
      intent: "show_subscription_change",
      metric: "subscriptions",
      range: normalized.includes("month") ? "30d" : "7d",
    };
  }

  return {
    intent: "show_revenue_trend",
    metric: normalized.includes("mrr") ? "mrr" : "revenue",
    range: normalized.includes("90") ? "90d" : "30d",
  };
}

function defaultFilters(): StudioFilters {
  return {
    product: "all",
    region: "all",
    platform: "all",
  };
}

export async function generateInsight(prompt: string): Promise<InsightResult> {
  const parsed = parseInsightPrompt(prompt);
  const metricResponse = await runStudioQuery({
    metric: parsed.metric,
    range: parsed.range,
    comparePrevious: true,
    filters: defaultFilters(),
  });
  const churnResponse =
    parsed.metric === "churn_rate"
      ? metricResponse
      : await runStudioQuery({
          metric: "churn_rate",
          range: parsed.range,
          comparePrevious: true,
          filters: defaultFilters(),
        });
  const subscriptionsResponse =
    parsed.metric === "subscriptions"
      ? metricResponse
      : await runStudioQuery({
          metric: "subscriptions",
          range: parsed.range,
          comparePrevious: true,
          filters: defaultFilters(),
        });

  const metricLabel = parsed.metric.replaceAll("_", " ");
  const metricValue =
    parsed.metric === "churn_rate"
      ? formatPercent(metricResponse.summary.currentValue)
      : formatCurrency(metricResponse.summary.currentValue);
  const changeLabel =
    metricResponse.summary.changePct === null
      ? "with no comparison baseline"
      : `${metricResponse.summary.changePct >= 0 ? "up" : "down"} ${Math.abs(
          metricResponse.summary.changePct,
        ).toFixed(1)}% vs the previous window`;

  const churnShift = churnResponse.summary.changePct ?? 0;
  const subscriptionShift = subscriptionsResponse.summary.changePct ?? 0;

  return {
    mode: metricResponse.mode,
    generatedAt: metricResponse.generatedAt,
    prompt,
    intent: parsed.intent,
    title: `Insight: ${metricLabel} over ${parsed.range}`,
    summary: `${metricLabel.toUpperCase()} is ${metricValue}, ${changeLabel}. Churn is ${
      churnShift > 0 ? "adding pressure" : "stabilizing"
    } while subscriber growth is ${
      subscriptionShift >= 0 ? "still expanding" : "softening"
    }.`,
    evidence: [
      `${metricLabel.toUpperCase()} current window: ${metricValue}.`,
      `Churn moved ${churnShift >= 0 ? "up" : "down"} ${Math.abs(churnShift).toFixed(1)}% versus the prior period.`,
      `Subscriptions changed ${subscriptionShift >= 0 ? "+" : ""}${subscriptionShift.toFixed(1)}% across the same window.`,
    ],
    metricsUsed: Array.from(new Set([parsed.metric, "churn_rate", "subscriptions"])),
    chartMetric: parsed.metric,
  };
}
