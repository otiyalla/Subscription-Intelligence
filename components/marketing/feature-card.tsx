import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--muted-soft)]">
          {icon}
        </div>
        <CardTitle className="flex items-center justify-between gap-3">
          <span>{title}</span>
          <ArrowUpRight className="size-4 text-[var(--muted)]" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-[var(--muted)]">{body}</p>
      </CardContent>
    </Card>
  );
}
