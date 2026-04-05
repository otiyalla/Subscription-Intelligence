import { AlertTriangle, Inbox, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingPanel({ label = "Loading analytics…" }: { label?: string }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="relative flex min-h-52 flex-col justify-center gap-5">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--accent),transparent)] opacity-60" />
        <div className="flex items-center gap-3">
          <LoaderCircle className="size-5 animate-spin text-[var(--accent)]" />
          <p className="text-sm text-[var(--muted)]">{label}</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function EmptyPanel({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <Card>
      <CardContent className="flex min-h-52 flex-col items-center justify-center gap-3 text-center">
        <Inbox className="size-8 text-[var(--muted)]" />
        <div className="space-y-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="max-w-md text-sm text-[var(--muted)]">{body}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ErrorPanel({
  title,
  body,
  onRetry,
}: {
  title: string;
  body: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="border-[rgba(232,69,69,0.22)] bg-[linear-gradient(180deg,rgba(232,69,69,0.06),transparent)]">
      <CardContent className="flex min-h-52 flex-col items-center justify-center gap-4 text-center">
        <AlertTriangle className="size-8 text-[var(--danger)]" />
        <div className="space-y-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="max-w-md text-sm text-[var(--muted)]">{body}</p>
        </div>
        {onRetry ? (
          <Button variant="secondary" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
