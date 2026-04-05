import { TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { formatDelta } from "@/lib/utils/format";
import type { OverviewMetric } from "@/types/revenuecat";

export function KpiCard({ metric }: { metric: OverviewMetric }) {
  const positive =
    metric.emphasis === "positive" ||
    (metric.key === "churn_rate" ? metric.changePct <= 0 : metric.changePct >= 0);

  return (
    <Card
      data-testid={`kpi-${metric.key}`}
      className="group hover:-translate-y-1 hover:border-[rgba(15,123,255,0.18)]"
    >
      <CardHeader className="pb-4">
        <CardDescription>{metric.label}</CardDescription>
        <CardTitle className="text-3xl">
          <CountUp value={metric.value} format={metric.format} />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-4">
        <p className="max-w-[16rem] text-sm text-[var(--muted)]">{metric.hint}</p>
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium ${
            positive
              ? "bg-[rgba(15,159,110,0.12)] text-[var(--success)]"
              : "bg-[rgba(232,69,69,0.12)] text-[var(--danger)]"
          }`}
        >
          {positive ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
          {formatDelta(metric.changePct)}
        </div>
      </CardContent>
    </Card>
  );
}
