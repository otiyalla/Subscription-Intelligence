export const RANGE_PRESETS = ["7d", "30d", "90d", "180d"] as const;
export const PRODUCTS = ["all", "starter", "pro", "enterprise"] as const;
export const REGIONS = ["all", "north-america", "europe", "asia-pacific"] as const;
export const PLATFORMS = ["all", "ios", "android", "web"] as const;
export const QUERY_METRICS = [
  "revenue",
  "mrr",
  "subscriptions",
  "churn_rate",
  "retention_rate",
  "arpu",
] as const;

export type RangePreset = (typeof RANGE_PRESETS)[number];
export type ProductFilter = (typeof PRODUCTS)[number];
export type RegionFilter = (typeof REGIONS)[number];
export type PlatformFilter = (typeof PLATFORMS)[number];
export type QueryMetric = (typeof QUERY_METRICS)[number];

export type StudioFilters = {
  product: ProductFilter;
  region: RegionFilter;
  platform: PlatformFilter;
};

export type StudioQueryInput = {
  metric: QueryMetric;
  range: RangePreset;
  comparePrevious: boolean;
  filters: StudioFilters;
  forceError?: boolean;
};

export type OverviewMetricKey =
  | "mrr"
  | "arr"
  | "active_subscriptions"
  | "churn_rate"
  | "arpu"
  | "retention_rate";

export type OverviewMetric = {
  key: OverviewMetricKey;
  label: string;
  value: number;
  changePct: number;
  format: "currency" | "percent" | "integer";
  emphasis: "positive" | "negative" | "neutral";
  hint: string;
};

export type MetricPoint = {
  date: string;
  revenue: number;
  mrr: number;
  activeSubscriptions: number;
  churnRate: number;
  retentionRate: number;
  arpu: number;
};

export type DashboardResponse = {
  mode: "demo" | "live";
  generatedAt: string;
  overview: OverviewMetric[];
  series: MetricPoint[];
  highlights: string[];
  availableFilters: {
    products: readonly ProductFilter[];
    regions: readonly RegionFilter[];
    platforms: readonly PlatformFilter[];
  };
};

export type QueryResponse = {
  mode: "demo" | "live";
  generatedAt: string;
  request: StudioQueryInput;
  summary: {
    label: string;
    currentValue: number;
    previousValue: number | null;
    changePct: number | null;
    pointCount: number;
  };
  points: Array<{
    date: string;
    value: number;
  }>;
  raw: Record<string, unknown>;
};

export type InsightIntent =
  | "explain_mrr_change"
  | "show_churn_trend"
  | "show_subscription_change"
  | "compare_periods"
  | "show_revenue_trend";

export type InsightResult = {
  mode: "demo" | "live";
  generatedAt: string;
  prompt: string;
  intent: InsightIntent;
  title: string;
  summary: string;
  evidence: string[];
  metricsUsed: QueryMetric[];
  chartMetric: QueryMetric;
};
