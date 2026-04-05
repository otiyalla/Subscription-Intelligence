"use client";

import { useState } from "react";

import { PromptExamples } from "@/components/insights/prompt-examples";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { SectionBanner } from "@/components/ui/section-banner";
import { EmptyPanel, ErrorPanel, LoadingPanel } from "@/components/ui/state-panels";
import { useInsight } from "@/hooks/use-insight";
import { insightPromptSchema } from "@/lib/revenuecat/insight-schemas";

export function InsightsPage() {
  const [prompt, setPrompt] = useState("Why did MRR drop this week?");
  const insight = useInsight();
  const validation = insightPromptSchema.safeParse(prompt);
  const promptError = validation.success ? null : validation.error.issues[0]?.message;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-6">
        <SectionBanner
          eyebrow="Natural-language insights"
          title="Prompt for answers, get deterministic evidence back."
          description="The insight engine maps prompts to known metrics, runs the relevant query, and explains the result with cited evidence instead of brittle generative behavior."
        />
        <Card>
          <CardHeader>
            <CardTitle>Ask the studio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Prompt</span>
              <Input
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Why did MRR drop this week?"
                aria-invalid={promptError ? "true" : "false"}
              />
            </label>
            {promptError ? (
              <p className="text-sm text-[var(--danger)]">{promptError}</p>
            ) : (
              <p className="text-sm text-[var(--muted)]">
                Ask about MRR, churn, subscriptions, comparisons, or revenue trends.
              </p>
            )}
            <PromptExamples onSelect={setPrompt} />
            <Button
              disabled={Boolean(promptError)}
              onClick={() => {
                if (!promptError) {
                  insight.mutate(prompt);
                }
              }}
            >
              {insight.isPending ? "Generating..." : "Generate insight"}
            </Button>
          </CardContent>
        </Card>
        {insight.isError ? (
          <ErrorPanel title="Insight unavailable" body={insight.error.message} />
        ) : null}
      </div>
      <Card className="min-h-[420px]">
        <CardHeader>
          <CardTitle>Insight output</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {insight.isPending ? <LoadingPanel label="Generating deterministic insight..." /> : null}
          {insight.data ? (
            <>
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Intent
                </p>
                <h2 data-testid="insight-title" className="text-2xl font-semibold">
                  {insight.data.title}
                </h2>
                <p className="text-[var(--muted)]">{insight.data.summary}</p>
              </div>
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Evidence
                </p>
                {insight.data.evidence.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[var(--card-border)] bg-[var(--muted-soft)] p-4 text-sm text-[var(--muted)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-[var(--card-border)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Metrics used
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {insight.data.metricsUsed.join(", ")}
                </p>
              </div>
            </>
          ) : (
            <EmptyPanel
              title="No insight yet"
              body="Run a prompt to generate a deterministic explanation from the current dataset."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
