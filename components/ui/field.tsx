import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-[var(--card-border)] bg-[var(--card-strong)] px-4 py-3 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(15,123,255,0.14)] aria-[invalid=true]:border-[rgba(232,69,69,0.5)] aria-[invalid=true]:focus:ring-[rgba(232,69,69,0.16)]",
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-2xl border border-[var(--card-border)] bg-[var(--card-strong)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(15,123,255,0.14)]",
        className,
      )}
      {...props}
    />
  );
}
