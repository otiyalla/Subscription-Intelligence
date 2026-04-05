import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

type SectionBannerProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  className?: string;
};

export function SectionBanner({
  eyebrow,
  title,
  description,
  actions,
  className,
}: SectionBannerProps) {
  return (
    <section
      className={cn(
        "rounded-[2rem] border border-[var(--card-border)] bg-[linear-gradient(135deg,rgba(15,123,255,0.16),rgba(9,172,194,0.08),rgba(255,255,255,0.04))] p-6 shadow-[0_24px_70px_rgba(8,17,31,0.08)]",
        className,
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Badge className="w-fit">{eyebrow}</Badge>
          <div className="space-y-2">
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
              {description}
            </p>
          </div>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}
