import Link from "next/link";
import {
  BarChart3,
  BotMessageSquare,
  Braces,
  DatabaseZap,
  Layers3,
  Rocket,
} from "lucide-react";

import { FeatureCard } from "@/components/marketing/feature-card";
import { LivePreview } from "@/components/marketing/live-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { getRuntimeMode } from "@/lib/revenuecat/runtime";

const features = [
  {
    icon: <BarChart3 className="size-5 text-[var(--accent)]" />,
    title: "Premium executive dashboard",
    body: "Founder-grade KPI cards, chart storytelling, and what-changed summaries tuned for fast demos and growth reviews.",
  },
  {
    icon: <Braces className="size-5 text-[var(--accent)]" />,
    title: "Developer console",
    body: "Validated parameter controls, raw JSON inspection, and copy-ready TypeScript and curl snippets for each request.",
  },
  {
    icon: <BotMessageSquare className="size-5 text-[var(--accent)]" />,
    title: "Deterministic insights engine",
    body: "Natural-language prompts route to predictable metric queries and evidence-backed explanations without introducing LLM fragility.",
  },
  {
    icon: <DatabaseZap className="size-5 text-[var(--accent)]" />,
    title: "RevenueCat-powered data layer",
    body: "A clean adapter layer keeps live RevenueCat requests isolated while demo mode stays stable, typed, and presentation-ready.",
  },
  {
    icon: <Layers3 className="size-5 text-[var(--accent)]" />,
    title: "Demo mode by default",
    body: "When credentials are absent, the app automatically falls back to realistic fixtures so every route remains usable without secrets.",
  },
  {
    icon: <Rocket className="size-5 text-[var(--accent)]" />,
    title: "Launch content included",
    body: "The repo ships with blog, video, social, and campaign drafts so the take-home doubles as a growth-ready submission package.",
  },
];

export default function Home() {
  const mode = getRuntimeMode();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-16 px-4 py-8 sm:px-6 sm:py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--foreground),var(--accent))] text-white">
            <BarChart3 className="size-5" />
          </div>
          <div>
            <p className="font-semibold">Subscription Intelligence Studio</p>
            <p className="text-sm text-[var(--muted)]">
              RevenueCat take-home product demo
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{mode === "demo" ? "Demo mode ready" : "Live RevenueCat ready"}</Badge>
          <Link href="/studio/dashboard">
            <Button size="lg">Enter the studio</Button>
          </Link>
        </div>
      </header>

      <section className="grid items-center gap-10 lg:grid-cols-[1fr_560px]">
        <div className="space-y-6">
          <Badge className="w-fit">Founders + developers in one experience</Badge>
          <div className="space-y-5">
            <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
              A polished RevenueCat analytics workspace built to demo, ship, and explain.
            </h1>
            <p className="max-w-2xl text-balance text-lg leading-8 text-[var(--muted)]">
              Subscription Intelligence Studio turns RevenueCat metrics into an executive
              dashboard, a developer API explorer, and a reliable natural-language insight
              surface. It is designed to look public-launch ready on day one.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/studio/dashboard">
              <Button>Open dashboard</Button>
            </Link>
            <Link href="/studio/console">
              <Button variant="secondary">Inspect the developer console</Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                Audience fit
              </p>
              <p className="mt-3 text-lg font-semibold">Founder + builder duality</p>
            </div>
            <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                Reliability
              </p>
              <p className="mt-3 text-lg font-semibold">Demo mode with typed fixtures</p>
            </div>
            <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                Storytelling
              </p>
              <p className="mt-3 text-lg font-semibold">Launch content included</p>
            </div>
          </div>
        </div>
        <LivePreview />
      </section>

      <section id="features" className="space-y-8">
        <SectionHeading
          eyebrow="Product"
          title="The studio pairs boardroom clarity with developer-grade observability."
          description="Every route is designed to support a short product demo, a technical walkthrough, and a growth-oriented launch narrative."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6 rounded-[2rem] border border-[var(--card-border)] bg-[var(--card)] p-8">
          <SectionHeading
            eyebrow="Founder workflow"
            title="Move from trend watching to action faster."
            description="MRR, churn, retention, and active subscriptions stay in one place, with filterable views that can be narrated clearly in a growth review."
          />
          <ul className="space-y-4 text-sm text-[var(--muted)]">
            <li>Board-ready KPI cards with explanatory context rather than raw numbers alone.</li>
            <li>What-changed summaries that turn trend lines into a short executive narrative.</li>
            <li>Demo-first states so the product always works in a recorded walkthrough.</li>
          </ul>
        </div>
        <div className="space-y-6 rounded-[2rem] border border-[var(--card-border)] bg-[var(--card)] p-8">
          <SectionHeading
            eyebrow="Developer workflow"
            title="Inspect the data contract, not just the chart."
            description="The developer console exposes request inputs, generated snippets, and JSON output so builders can understand and extend the integration quickly."
          />
          <ul className="space-y-4 text-sm text-[var(--muted)]">
            <li>Validated request builder with filters, range controls, and stable defaults.</li>
            <li>Copy-to-clipboard TypeScript and curl snippets for repeatable requests.</li>
            <li>Deterministic insights logic that remains testable without an external LLM.</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-8 rounded-[2rem] border border-[var(--card-border)] bg-[var(--card)] p-8 lg:grid-cols-[1.15fr_0.85fr]">
        <SectionHeading
          eyebrow="Integration"
          title="RevenueCat charts and metrics are the source, with a clean fallback path."
          description="Server-side adapters keep live credentials secure. When credentials are absent, the app automatically falls back to a realistic local metrics fixture and clearly labels demo mode in the UI."
        />
        <div className="space-y-4 text-sm text-[var(--muted)]">
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--muted-soft)] p-4">
            <p className="font-medium text-[var(--foreground)]">Demo mode</p>
            <p className="mt-2">
              Default experience for local runs, tests, and recorded demos.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--muted-soft)] p-4">
            <p className="font-medium text-[var(--foreground)]">Live mode</p>
            <p className="mt-2">
              Enabled automatically when RevenueCat credentials are present in the
              environment.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--card-border)] py-8 text-sm text-[var(--muted)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>Subscription Intelligence Studio</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/studio/dashboard">Dashboard</Link>
            <Link href="/studio/console">Developer Console</Link>
            <Link href="/studio/insights">Insights</Link>
            <a href="#features">Features</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
