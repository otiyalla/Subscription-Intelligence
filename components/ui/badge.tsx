import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--card-border)] bg-[var(--muted-soft)] px-3 py-1 text-xs font-medium text-[var(--foreground)]",
        className,
      )}
      {...props}
    />
  );
}
