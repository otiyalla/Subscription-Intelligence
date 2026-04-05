"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Play, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Recipes } from "@/components/console/recipes";
import { RequestSummary } from "@/components/console/request-summary";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/field";
import { SectionBanner } from "@/components/ui/section-banner";
import { LoadingPanel } from "@/components/ui/state-panels";
import { ErrorPanel } from "@/components/ui/state-panels";
import { useStudioQuery } from "@/hooks/use-studio-query";
import { createDefaultStudioQuery } from "@/lib/revenuecat/defaults";
import { createCurlSnippet, createTypeScriptSnippet } from "@/lib/revenuecat/snippets";
import { studioQuerySchema } from "@/lib/revenuecat/schemas";
import type { StudioQueryInput } from "@/types/revenuecat";

type StudioQueryFormValues = z.input<typeof studioQuerySchema>;
type StudioQueryResolvedValues = z.output<typeof studioQuerySchema>;
const defaultValues: StudioQueryFormValues = createDefaultStudioQuery();

export function DeveloperConsolePage() {
  const form = useForm<
    StudioQueryFormValues,
    undefined,
    StudioQueryResolvedValues
  >({
    resolver: zodResolver(studioQuerySchema),
    defaultValues,
  });
  const query = useStudioQuery();
  const { mutate } = query;
  const watchedValues = useWatch({
    control: form.control,
  }) as StudioQueryInput;

  useEffect(() => {
    mutate(createDefaultStudioQuery());
  }, [mutate]);

  const response = query.data;
  const {
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
      <Card className="h-fit xl:sticky xl:top-28">
        <CardHeader>
          <CardTitle>Developer console</CardTitle>
          <p className="text-sm text-[var(--muted)]">
            Build a typed request, validate parameters, inspect JSON, and copy clean
            TypeScript or curl snippets.
          </p>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values: StudioQueryResolvedValues) =>
              mutate(values),
            )}
          >
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Metric</span>
              <Select aria-label="Metric" {...form.register("metric")}>
                <option value="revenue">Revenue</option>
                <option value="mrr">MRR</option>
                <option value="subscriptions">Subscriptions</option>
                <option value="churn_rate">Churn rate</option>
                <option value="retention_rate">Retention rate</option>
                <option value="arpu">ARPU</option>
              </Select>
            </label>
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Date range</span>
              <Select aria-label="Date range" {...form.register("range")}>
                <option value="7d">7d</option>
                <option value="30d">30d</option>
                <option value="90d">90d</option>
                <option value="180d">180d</option>
              </Select>
            </label>
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Product</span>
              <Select aria-label="Product" {...form.register("filters.product")}>
                <option value="all">all</option>
                <option value="starter">starter</option>
                <option value="pro">pro</option>
                <option value="enterprise">enterprise</option>
              </Select>
            </label>
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Region</span>
              <Select aria-label="Region" {...form.register("filters.region")}>
                <option value="all">all</option>
                <option value="north-america">north-america</option>
                <option value="europe">europe</option>
                <option value="asia-pacific">asia-pacific</option>
              </Select>
            </label>
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Platform</span>
              <Select aria-label="Platform" {...form.register("filters.platform")}>
                <option value="all">all</option>
                <option value="ios">ios</option>
                <option value="android">android</option>
                <option value="web">web</option>
              </Select>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-[var(--card-border)] bg-[var(--muted-soft)] px-4 py-3 text-sm">
              <input type="checkbox" {...form.register("comparePrevious")} />
              Compare to previous window
            </label>
            {errors.metric ? (
              <p className="text-sm text-[var(--danger)]">{errors.metric.message}</p>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              <Button className="w-full" type="submit">
              <Play className="mr-2 size-4" />
                {query.isPending ? "Running..." : "Run query"}
              </Button>
              <Button
                className="w-full"
                type="button"
                variant="secondary"
                onClick={() => {
                  const query = createDefaultStudioQuery();
                  form.reset(query);
                  mutate(query);
                }}
              >
                <RotateCcw className="mr-2 size-4" />
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="space-y-6">
        <SectionBanner
          eyebrow="RevenueCat data explorer"
          title="API explorer built for fast demos"
          description="Use the same typed query structure across the product, then copy the request into your own product code or growth workflows."
          actions={
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => {
                const query = createDefaultStudioQuery();
                form.reset(query);
                mutate(query);
              }}
            >
              Load sample query
            </Button>
          }
        />
        {query.isError ? (
          <ErrorPanel title="Console request failed" body={query.error.message} />
        ) : null}
        {query.isPending && !response ? (
          <LoadingPanel label="Running console query..." />
        ) : null}
        {response ? <RequestSummary response={response} /> : null}
        <div className="grid gap-6 xl:grid-cols-2">
          <CodeBlock
            title="TypeScript snippet"
            code={createTypeScriptSnippet(watchedValues)}
          />
          <CodeBlock title="curl snippet" code={createCurlSnippet(watchedValues)} />
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader>
              <CardTitle>JSON response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre
                aria-label="JSON response"
                data-testid="json-response"
                className="max-h-[480px] overflow-auto rounded-2xl bg-[#06101d] p-4 font-mono text-xs leading-6 text-[#d4e3ff]"
              >
                <code>{JSON.stringify(response?.raw ?? {}, null, 2)}</code>
              </pre>
            </CardContent>
          </Card>
          <Recipes />
        </div>
      </div>
    </div>
  );
}
