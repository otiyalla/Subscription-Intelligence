import {
  eachDayOfInterval,
  endOfDay,
  formatISO,
  startOfDay,
  subDays,
} from "date-fns";

import type { MetricPoint, StudioFilters } from "@/types/revenuecat";

type MultiplierMap<T extends string> = Record<T, number>;

const productMultipliers: MultiplierMap<StudioFilters["product"]> = {
  all: 1,
  starter: 0.58,
  pro: 1.18,
  enterprise: 0.92,
};

const regionMultipliers: MultiplierMap<StudioFilters["region"]> = {
  all: 1,
  "north-america": 1.14,
  europe: 0.94,
  "asia-pacific": 0.79,
};

const platformMultipliers: MultiplierMap<StudioFilters["platform"]> = {
  all: 1,
  ios: 1.08,
  android: 0.92,
  web: 0.63,
};

function round(value: number, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function buildBasePoint(index: number, total: number): MetricPoint {
  const trend = index / total;
  const waveA = Math.sin(index / 6) * 520;
  const waveB = Math.cos(index / 13) * 260;
  const campaignLift = index > total - 42 ? 780 : 0;
  const churnSpike = index > total - 18 ? 0.65 : 0;
  const subscriptions = 920 + index * 4.2 + Math.sin(index / 8) * 52;
  const revenue = 18_600 + trend * 7_400 + waveA + waveB + campaignLift;
  const mrr = 15_800 + trend * 5_900 + waveA * 0.72 + campaignLift * 0.84;
  const churnRate = 3.4 - trend * 0.6 + Math.cos(index / 7) * 0.28 + churnSpike;
  const retentionRate = 88.7 + trend * 1.7 + Math.sin(index / 10) * 0.5 - churnSpike;

  return {
    date: "",
    revenue: round(revenue),
    mrr: round(mrr),
    activeSubscriptions: Math.round(subscriptions),
    churnRate: round(churnRate),
    retentionRate: round(retentionRate),
    arpu: round(revenue / subscriptions),
  };
}

const totalDays = 180;
const start = startOfDay(subDays(new Date(), totalDays - 1));
const end = endOfDay(new Date());

export const demoSeriesFixture: MetricPoint[] = eachDayOfInterval({
  start,
  end,
}).map((date, index, values) => {
  const basePoint = buildBasePoint(index, values.length);

  return {
    ...basePoint,
    date: formatISO(date, { representation: "date" }),
  };
});

export function applyDemoFilters(
  point: MetricPoint,
  filters: StudioFilters,
): MetricPoint {
  const demandMultiplier =
    productMultipliers[filters.product] *
    regionMultipliers[filters.region] *
    platformMultipliers[filters.platform];

  const subscriptionMultiplier =
    productMultipliers[filters.product] *
    (regionMultipliers[filters.region] * 0.92 + 0.08) *
    (platformMultipliers[filters.platform] * 0.88 + 0.12);

  return {
    ...point,
    revenue: round(point.revenue * demandMultiplier),
    mrr: round(point.mrr * demandMultiplier),
    activeSubscriptions: Math.round(
      point.activeSubscriptions * subscriptionMultiplier,
    ),
    churnRate: round(
      point.churnRate +
        (filters.product === "starter" ? 0.45 : 0) +
        (filters.platform === "web" ? 0.3 : 0) -
        (filters.product === "pro" ? 0.18 : 0),
    ),
    retentionRate: round(
      point.retentionRate -
        (filters.product === "starter" ? 0.8 : 0) -
        (filters.platform === "web" ? 0.4 : 0) +
        (filters.product === "pro" ? 0.35 : 0),
    ),
    arpu: round((point.revenue * demandMultiplier) / Math.max(1, point.activeSubscriptions)),
  };
}
