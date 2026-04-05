import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function DemoModeBanner({ mode }: { mode: "demo" | "live" }) {
  return mode === "demo" ? (
    <div
      data-testid="demo-mode-banner"
      className="surface flex flex-col gap-3 rounded-2xl px-4 py-3 text-sm sm:flex-row sm:items-center"
    >
      <Sparkles className="size-4 text-[var(--accent)]" />
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">Demo mode is active.</span>
        <span className="text-[var(--muted)]">
          The full studio runs on typed local fixtures until RevenueCat credentials are
          supplied.
        </span>
      </div>
      <Badge className="sm:ml-auto sm:inline-flex">Stable demo data</Badge>
    </div>
  ) : (
    <div className="surface rounded-2xl px-4 py-3 text-sm text-[var(--muted)]">
      Live RevenueCat mode is active.
    </div>
  );
}
