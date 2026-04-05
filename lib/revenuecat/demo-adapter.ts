import { demoSeriesFixture, applyDemoFilters } from "@/lib/demo/fixtures";
import {
  average,
  buildHighlights,
  buildOverviewTimestamp,
  changePct,
  metricAccessor,
  sliceSeriesForRange,
  splitComparisonWindows,
  sum,
} from "@/lib/revenuecat/helpers";
import type {
  DashboardResponse,
  MetricPoint,
  OverviewMetric,
  QueryResponse,
  StudioQueryInput,
} from "@/types/revenuecat";
import { PLATFORMS, PRODUCTS, REGIONS } from "@/types/revenuecat";

function buildOverview(points: MetricPoint[]): OverviewMetric[] {
  const current = points.at(-1);
  const previous = points.at(-8);

  if (!current || !previous) {
    return [];
  }

  return [
    {
      key: "mrr",
      label: "MRR",
      value: current.mrr,
      changePct: changePct(current.mrr, previous.mrr),
      format: "currency",
      emphasis: current.mrr >= previous.mrr ? "positive" : "negative",
      hint: "Monthly recurring revenue normalized from the latest mix.",
    },
    {
      key: "arr",
      label: "ARR",
      value: current.mrr * 12,
      changePct: changePct(current.mrr * 12, previous.mrr * 12),
      format: "currency",
      emphasis: current.mrr >= previous.mrr ? "positive" : "negative",
      hint: "Forward-looking annualized recurring revenue.",
    },
    {
      key: "active_subscriptions",
      label: "Active Subscriptions",
      value: current.activeSubscriptions,
      changePct: changePct(
        current.activeSubscriptions,
        previous.activeSubscriptions,
      ),
      format: "integer",
      emphasis:
        current.activeSubscriptions >= previous.activeSubscriptions
          ? "positive"
          : "negative",
      hint: "Paid subscriptions currently retained in the active base.",
    },
    {
      key: "churn_rate",
      label: "Churn Rate",
      value: current.churnRate,
      changePct: changePct(current.churnRate, previous.churnRate),
      format: "percent",
      emphasis: current.churnRate <= previous.churnRate ? "positive" : "negative",
      hint: "Subscriber churn over the latest measurement window.",
    },
    {
      key: "arpu",
      label: "ARPU",
      value: current.arpu,
      changePct: changePct(current.arpu, previous.arpu),
      format: "currency",
      emphasis: current.arpu >= previous.arpu ? "positive" : "negative",
      hint: "Average revenue per active subscriber.",
    },
    {
      key: "retention_rate",
      label: "Retention",
      value: current.retentionRate,
      changePct: changePct(current.retentionRate, previous.retentionRate),
      format: "percent",
      emphasis:
        current.retentionRate >= previous.retentionRate ? "positive" : "negative",
      hint: "Retention signal paired to churn for renewal health.",
    },
  ];
}

function getFilteredSeries(filters: StudioQueryInput["filters"]) {
  return demoSeriesFixture.map((point) => applyDemoFilters(point, filters));
}

export async function getDemoDashboard(
  input: Omit<StudioQueryInput, "metric" | "comparePrevious">,
): Promise<DashboardResponse> {
  if (input.forceError) {
    throw new Error("Forced dashboard failure for testing.");
  }

  const filtered = getFilteredSeries(input.filters);
  const series = sliceSeriesForRange(filtered, input.range);
  const response: DashboardResponse = {
    mode: "demo",
    generatedAt: buildOverviewTimestamp(),
    overview: buildOverview(series),
    series,
    highlights: [],
    availableFilters: {
      products: PRODUCTS,
      regions: REGIONS,
      platforms: PLATFORMS,
    },
  };

  response.highlights = buildHighlights(response);

  return response;
}

export async function runDemoQuery(input: StudioQueryInput): Promise<QueryResponse> {
  if (input.forceError) {
    throw new Error("Forced console failure for testing.");
  }

  const filtered = getFilteredSeries(input.filters);
  const relevantPoints = sliceSeriesForRange(filtered, input.range);
  const comparison = splitComparisonWindows(filtered, input.range);
  const label = input.metric.replaceAll("_", " ");
  const currentValue = average(
    comparison.current.map((point) => metricAccessor(point, input.metric)),
  );
  const previousValue =
    comparison.previous.length > 0
      ? average(
          comparison.previous.map((point) => metricAccessor(point, input.metric)),
        )
      : null;
  const currentTotal = sum(
    comparison.current.map((point) => metricAccessor(point, input.metric)),
  );

  return {
    mode: "demo",
    generatedAt: buildOverviewTimestamp(),
    request: input,
    summary: {
      label,
      currentValue:
        input.metric === "subscriptions" ? currentValue : currentTotal / relevantPoints.length,
      previousValue,
      changePct:
        previousValue !== null && input.comparePrevious
          ? changePct(currentValue, previousValue)
          : null,
      pointCount: relevantPoints.length,
    },
    points: relevantPoints.map((point) => ({
      date: point.date,
      value: metricAccessor(point, input.metric),
    })),
    raw: {
      mode: "demo",
      sampledRange: input.range,
      filters: input.filters,
      metric: input.metric,
      points: relevantPoints,
    },
  };
}
