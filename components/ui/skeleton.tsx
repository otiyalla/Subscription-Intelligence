import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-[linear-gradient(90deg,rgba(138,155,177,0.12),rgba(138,155,177,0.22),rgba(138,155,177,0.12))] bg-[length:200%_100%]",
        className,
      )}
      {...props}
    />
  );
}
