import {
  average,
  buildOverviewTimestamp,
  changePct,
  normalizeError,
} from "@/lib/revenuecat/helpers";
import type {
  DashboardResponse,
  MetricPoint,
  OverviewMetric,
  QueryMetric,
  QueryResponse,
  StudioQueryInput,
} from "@/types/revenuecat";
import { PLATFORMS, PRODUCTS, REGIONS } from "@/types/revenuecat";

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }

  return value;
}

function buildTemplatePath(
  template: string,
  replacements: Record<string, string>,
): string {
  return Object.entries(replacements).reduce(
    (path, [key, value]) => path.replaceAll(`{${key}}`, value),
    template,
  );
}

async function fetchRevenueCatJson(path: string, params: URLSearchParams) {
  const baseUrl = process.env.REVENUECAT_API_BASE_URL ?? "https://api.revenuecat.com/v2";
  const apiKey = requireEnv("REVENUECAT_API_KEY");

  const url = new URL(path, baseUrl);
  params.forEach((value, key) => url.searchParams.set(key, value));

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`RevenueCat request failed with ${response.status}`);
  }

  return response.json();
}

function findSeriesArray(payload: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(payload)) {
    const objects = payload.filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null,
    );

    if (objects.length > 0) {
      return objects;
    }
  }

  if (typeof payload === "object" && payload !== null) {
    for (const value of Object.values(payload)) {
      const result = findSeriesArray(value);

      if (result.length > 0) {
        return result;
      }
    }
  }

  return [];
}

function coerceMetricSeries(
  metric: QueryMetric,
  payload: unknown,
): Array<{ date: string; value: number }> {
  const series = findSeriesArray(payload);

  return series
    .map((item) => {
      const date = String(
        item.date ?? item.day ?? item.timestamp ?? item.period_start ?? "",
      );
      const valueCandidate =
        item.value ??
        item.metric ??
        item.amount ??
        item.count ??
        item.total ??
        item[metric];
      const value =
        typeof valueCandidate === "number"
          ? valueCandidate
          : Number(valueCandidate ?? Number.NaN);

      return {
        date,
        value,
      };
    })
    .filter((item) => item.date && Number.isFinite(item.value));
}

function buildLiveOverview(series: MetricPoint[]): OverviewMetric[] {
  const current = series.at(-1);
  const previous = series.at(-8);

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
      hint: "Monthly recurring revenue from the RevenueCat overview feed.",
    },
    {
      key: "arr",
      label: "ARR",
      value: current.mrr * 12,
      changePct: changePct(current.mrr * 12, previous.mrr * 12),
      format: "currency",
      emphasis: current.mrr >= previous.mrr ? "positive" : "negative",
      hint: "Annualized from current MRR.",
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
      hint: "Current paid subscriber base.",
    },
    {
      key: "churn_rate",
      label: "Churn Rate",
      value: current.churnRate,
      changePct: changePct(current.churnRate, previous.churnRate),
      format: "percent",
      emphasis: current.churnRate <= previous.churnRate ? "positive" : "negative",
      hint: "RevenueCat chart-derived churn signal.",
    },
    {
      key: "arpu",
      label: "ARPU",
      value: current.arpu,
      changePct: changePct(current.arpu, previous.arpu),
      format: "currency",
      emphasis: current.arpu >= previous.arpu ? "positive" : "negative",
      hint: "Average revenue per active subscription.",
    },
    {
      key: "retention_rate",
      label: "Retention",
      value: current.retentionRate,
      changePct: changePct(current.retentionRate, previous.retentionRate),
      format: "percent",
      emphasis:
        current.retentionRate >= previous.retentionRate ? "positive" : "negative",
      hint: "Retention rate inferred from the chart feed.",
    },
  ];
}

function valueAtIndex(
  points: Array<{ date: string; value: number }>,
  fallbackDates: string[],
  index: number,
) {
  const point = points[index];

  return {
    date: point?.date ?? fallbackDates[index] ?? "",
    value: point?.value ?? 0,
  };
}

export async function getLiveDashboard(
  input: Omit<StudioQueryInput, "metric" | "comparePrevious">,
): Promise<DashboardResponse> {
  const projectId = requireEnv("REVENUECAT_PROJECT_ID");
  const overviewPath = buildTemplatePath(
    process.env.REVENUECAT_OVERVIEW_PATH_TEMPLATE ??
      "/projects/{projectId}/metrics/overview",
    { projectId },
  );
  const chartPathTemplate =
    process.env.REVENUECAT_CHART_PATH_TEMPLATE ??
    "/projects/{projectId}/charts/{metric}";

  const params = new URLSearchParams({
    range: input.range,
    product: input.filters.product,
    region: input.filters.region,
    platform: input.filters.platform,
  });

  try {
    const [overviewPayload, revenuePayload, subscriptionsPayload, churnPayload] =
      await Promise.all([
        fetchRevenueCatJson(overviewPath, params),
        fetchRevenueCatJson(
          buildTemplatePath(chartPathTemplate, {
            projectId,
            metric: "revenue",
          }),
          params,
        ),
        fetchRevenueCatJson(
          buildTemplatePath(chartPathTemplate, {
            projectId,
            metric: "subscriptions",
          }),
          params,
        ),
        fetchRevenueCatJson(
          buildTemplatePath(chartPathTemplate, {
            projectId,
            metric: "churn_rate",
          }),
          params,
        ),
      ]);

    const revenuePoints = coerceMetricSeries("revenue", revenuePayload);
    const subscriptionsPoints = coerceMetricSeries(
      "subscriptions",
      subscriptionsPayload,
    );
    const churnPoints = coerceMetricSeries("churn_rate", churnPayload);

    const fallbackDates =
      revenuePoints.map((point) => point.date) ??
      subscriptionsPoints.map((point) => point.date);

    const series = revenuePoints.map((point, index) => {
      const subscriptions = valueAtIndex(
        subscriptionsPoints,
        fallbackDates,
        index,
      ).value;
      const churn = valueAtIndex(churnPoints, fallbackDates, index).value;
      const mrr =
        Number(
          (overviewPayload as Record<string, unknown>).mrr ??
            (overviewPayload as Record<string, unknown>).monthly_recurring_revenue,
        ) || point.value;

      return {
        date: point.date,
        revenue: point.value,
        mrr,
        activeSubscriptions: subscriptions,
        churnRate: churn,
        retentionRate: Math.max(0, 100 - churn * 2.6),
        arpu: subscriptions > 0 ? point.value / subscriptions : 0,
      };
    });

    return {
      mode: "live",
      generatedAt: buildOverviewTimestamp(),
      overview: buildLiveOverview(series),
      series,
      highlights: [
        "Live mode is active. Data is being requested from your RevenueCat configuration.",
      ],
      availableFilters: {
        products: PRODUCTS,
        regions: REGIONS,
        platforms: PLATFORMS,
      },
    };
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function runLiveQuery(
  input: StudioQueryInput,
): Promise<QueryResponse> {
  const projectId = requireEnv("REVENUECAT_PROJECT_ID");
  const chartPath = buildTemplatePath(
    process.env.REVENUECAT_CHART_PATH_TEMPLATE ??
      "/projects/{projectId}/charts/{metric}",
    { projectId, metric: input.metric },
  );

  const params = new URLSearchParams({
    range: input.range,
    product: input.filters.product,
    region: input.filters.region,
    platform: input.filters.platform,
  });

  try {
    const payload = await fetchRevenueCatJson(chartPath, params);
    const points = coerceMetricSeries(input.metric, payload);
    const midpoint = Math.floor(points.length / 2);
    const currentWindow = points.slice(midpoint);
    const previousWindow = points.slice(0, midpoint);
    const currentValue = average(currentWindow.map((point) => point.value));
    const previousValue = previousWindow.length
      ? average(previousWindow.map((point) => point.value))
      : null;

    return {
      mode: "live",
      generatedAt: buildOverviewTimestamp(),
      request: input,
      summary: {
        label: input.metric.replaceAll("_", " "),
        currentValue,
        previousValue,
        changePct:
          input.comparePrevious && previousValue !== null
            ? changePct(currentValue, previousValue)
            : null,
        pointCount: points.length,
      },
      points,
      raw: payload as Record<string, unknown>,
    };
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}
