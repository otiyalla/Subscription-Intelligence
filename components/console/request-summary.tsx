import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDelta, formatMetricValue } from "@/lib/utils/format";
import type { QueryResponse } from "@/types/revenuecat";

export function RequestSummary({ response }: { response: QueryResponse }) {
  const isRate = response.request.metric.includes("rate");

  return (
    <Card className="hover:-translate-y-1">
      <CardHeader>
        <CardTitle>Request summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--muted-soft)] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            Current window
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {formatMetricValue(
              response.summary.currentValue,
              isRate ? "percent" : response.request.metric === "subscriptions" ? "integer" : "currency",
            )}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--muted-soft)] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            Delta
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {formatDelta(response.summary.changePct)}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--muted-soft)] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            Returned points
          </p>
          <p className="mt-2 text-2xl font-semibold">{response.summary.pointCount}</p>
        </div>
      </CardContent>
    </Card>
  );
}
