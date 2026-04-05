import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const previewMetrics = [
  { label: "MRR", value: "$22.4k", delta: "+8.4%" },
  { label: "ARR", value: "$268k", delta: "+8.4%" },
  { label: "Churn", value: "2.9%", delta: "-0.4 pts" },
];

export function LivePreview() {
  return (
    <Card className="relative overflow-hidden">
      <div className="grid-fade absolute inset-0 opacity-70" />
      <CardHeader className="relative z-10">
        <Badge className="w-fit">Live UI preview</Badge>
        <CardTitle className="text-2xl">Launch-ready founder + developer workspace</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          {previewMetrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-strong)] p-4"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                {metric.label}
              </p>
              <p className="mt-3 text-2xl font-semibold">{metric.value}</p>
              <p className="mt-2 text-sm text-[var(--success)]">{metric.delta}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-strong)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-medium">Revenue trend</p>
              <p className="text-xs text-[var(--muted)]">30d</p>
            </div>
            <div className="flex h-40 items-end gap-2">
              {[28, 32, 31, 35, 36, 38, 42, 41, 45, 49, 53, 57].map((value) => (
                <div
                  key={value}
                  className="flex-1 rounded-t-2xl bg-[linear-gradient(180deg,var(--accent),rgba(15,123,255,0.15))]"
                  style={{ height: `${value * 2.2}px` }}
                />
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-strong)] p-5">
            <p className="font-medium">Developer console</p>
            <div className="mt-4 space-y-3 rounded-2xl bg-[#06101d] p-4 font-mono text-xs leading-6 text-[#d4e3ff]">
              <p>{`fetch("/api/studio/query", {`}</p>
              <p>{`  method: "POST",`}</p>
              <p>{`  body: JSON.stringify({ metric: "mrr" })`}</p>
              <p>{`})`}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
