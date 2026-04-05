import { subDays } from "date-fns";

import type {
  DashboardResponse,
  MetricPoint,
  QueryMetric,
  RangePreset,
  StudioFilters,
} from "@/types/revenuecat";

export function getRangeDays(range: RangePreset) {
  switch (range) {
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "90d":
      return 90;
    case "180d":
      return 180;
    default:
      return 30;
  }
}

export function sliceSeriesForRange(points: MetricPoint[], range: RangePreset) {
  const days = getRangeDays(range);

  return points.slice(-days);
}

export function splitComparisonWindows(points: MetricPoint[], range: RangePreset) {
  const days = getRangeDays(range);
  const current = points.slice(-days);
  const previous = points.slice(-(days * 2), -days);

  return { current, previous };
}

export function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

export function changePct(current: number, previous: number) {
  if (previous === 0) {
    return 0;
  }

  return ((current - previous) / previous) * 100;
}

export function buildHighlights(response: DashboardResponse): string[] {
  const latest = response.series.at(-1);
  const prior = response.series.at(-8);

  if (!latest || !prior) {
    return [];
  }

  const revenueChange = changePct(latest.revenue, prior.revenue);
  const subscriptionChange = changePct(
    latest.activeSubscriptions,
    prior.activeSubscriptions,
  );
  const churnDelta = latest.churnRate - prior.churnRate;

  return [
    `Revenue is ${revenueChange >= 0 ? "up" : "down"} ${Math.abs(revenueChange).toFixed(1)}% versus the previous week.`,
    `Active subscriptions moved ${subscriptionChange >= 0 ? "up" : "down"} ${Math.abs(subscriptionChange).toFixed(1)}%, keeping the paid base ${latest.activeSubscriptions >= prior.activeSubscriptions ? "expanding" : "under pressure"}.`,
    `Churn ${churnDelta > 0 ? "increased" : "improved"} by ${Math.abs(churnDelta).toFixed(2)} pts, which is the clearest short-term lever behind the current MRR trend.`,
  ];
}

export function metricAccessor(point: MetricPoint, metric: QueryMetric) {
  switch (metric) {
    case "revenue":
      return point.revenue;
    case "mrr":
      return point.mrr;
    case "subscriptions":
      return point.activeSubscriptions;
    case "churn_rate":
      return point.churnRate;
    case "retention_rate":
      return point.retentionRate;
    case "arpu":
      return point.arpu;
    default:
      return point.revenue;
  }
}

export function buildFilterSignature(filters: StudioFilters) {
  return `${filters.product}:${filters.region}:${filters.platform}`;
}

export function buildQueryParams(
  range: RangePreset,
  filters: StudioFilters,
  forceError?: boolean,
) {
  const params = new URLSearchParams({
    range,
    product: filters.product,
    region: filters.region,
    platform: filters.platform,
  });

  if (forceError) {
    params.set("forceError", "true");
  }

  return params.toString();
}

export function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown RevenueCat error";
}

export function buildOverviewTimestamp() {
  return subDays(new Date(), 0).toISOString();
}
