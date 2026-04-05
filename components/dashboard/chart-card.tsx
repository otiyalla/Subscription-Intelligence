"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactNumber } from "@/lib/utils/format";
import type { MetricPoint, QueryMetric } from "@/types/revenuecat";

const metricLabels: Record<QueryMetric, string> = {
  revenue: "Revenue",
  mrr: "MRR",
  subscriptions: "Active subscriptions",
  churn_rate: "Churn rate",
  retention_rate: "Retention rate",
  arpu: "ARPU",
};

const dataKeys: Record<QueryMetric, keyof MetricPoint> = {
  revenue: "revenue",
  mrr: "mrr",
  subscriptions: "activeSubscriptions",
  churn_rate: "churnRate",
  retention_rate: "retentionRate",
  arpu: "arpu",
};

export function ChartCard({
  title,
  description,
  points,
  metric,
  color,
}: {
  title: string;
  description: string;
  points: MetricPoint[];
  metric: QueryMetric;
  color: string;
}) {
  const key = dataKeys[metric];
  const gradientId = `${metric}-gradient`;
  const data = useMemo(
    () =>
      points.map((point) => ({
        ...point,
        shortDate: point.date.slice(5),
    })),
    [points],
  );

  return (
    <Card className="min-h-[360px] overflow-hidden hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3">
          <span>{title}</span>
          <span className="rounded-full bg-[var(--muted-soft)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
            {points.length} points
          </span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        <div className="w-full min-w-0">
          <ResponsiveContainer width="100%" height={300} minWidth={280}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(138,155,177,0.15)" vertical={false} />
              <XAxis
                dataKey="shortDate"
                minTickGap={28}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted)", fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatCompactNumber}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted)", fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [
                  formatCompactNumber(Number(value ?? 0)),
                  metricLabels[metric],
                ]}
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid var(--card-border)",
                  background: "var(--card-strong)",
                  boxShadow: "0 24px 80px rgba(8,17,31,0.16)",
                }}
              />
              <Area
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={3}
                fill={`url(#${gradientId})`}
                fillOpacity={1}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
