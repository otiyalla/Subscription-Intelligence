"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";

import { ChartCard } from "@/components/dashboard/chart-card";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionBanner } from "@/components/ui/section-banner";
import { EmptyPanel, ErrorPanel } from "@/components/ui/state-panels";
import { useDashboard } from "@/hooks/use-dashboard";
import { createDefaultStudioFilters } from "@/lib/revenuecat/defaults";
import type { RangePreset, StudioFilters } from "@/types/revenuecat";

export function DashboardPage() {
  const [range, setRange] = useState<RangePreset>("30d");
  const [filters, setFilters] = useState<StudioFilters>(createDefaultStudioFilters);
  const dashboard = useDashboard(range, filters);

  return (
    <div className="space-y-6">
      <SectionBanner
        eyebrow="Executive dashboard"
        title="Recurring revenue, retention, and growth context in one premium command surface."
        description="Track recurring revenue, subscriber health, and churn signals in a founder-ready analytics workspace built for quick scans, demos, and board-style storytelling."
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setRange("30d");
              setFilters(createDefaultStudioFilters());
            }}
          >
            <RotateCcw className="mr-2 size-4" />
            Reset filters
          </Button>
        }
      />
      <FilterBar
        range={range}
        setRange={setRange}
        filters={filters}
        setFilters={setFilters}
      />
      {dashboard.isLoading ? <DashboardSkeleton /> : null}
      {dashboard.isError ? (
        <ErrorPanel
          title="Dashboard unavailable"
          body={dashboard.error.message}
          onRetry={() => dashboard.refetch()}
        />
      ) : null}
      {dashboard.data ? (
        <>
          {dashboard.data.overview.length > 0 ? (
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {dashboard.data.overview.map((metric) => (
                <KpiCard key={metric.key} metric={metric} />
              ))}
            </section>
          ) : (
            <EmptyPanel
              title="No metrics returned"
              body="Adjust filters or switch back to the all-products view to inspect the demo dataset."
            />
          )}
          <section className="grid gap-4 xl:grid-cols-[1.4fr_1.4fr_1fr]">
            <ChartCard
              title="Revenue trend"
              description="Daily revenue movement for the selected range."
              points={dashboard.data.series}
              metric="revenue"
              color="#0f7bff"
            />
            <ChartCard
              title="Subscription base"
              description="How the active paid subscriber base is evolving."
              points={dashboard.data.series}
              metric="subscriptions"
              color="#09acc2"
            />
            <Card>
              <CardHeader>
                <CardTitle>What changed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboard.data.highlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[var(--card-border)] bg-[var(--muted-soft)] p-4 text-sm leading-6 text-[var(--muted)]"
                  >
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
          <ChartCard
            title="Churn and retention"
            description="Monitor churn pressure while keeping a retention lens beside it."
            points={dashboard.data.series}
            metric="churn_rate"
            color="#e84545"
          />
        </>
      ) : null}
    </div>
  );
}
