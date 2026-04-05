import Link from "next/link";
import { BarChart3, BotMessageSquare, Braces, Compass } from "lucide-react";
import type { ReactNode } from "react";

import { DemoModeBanner } from "@/components/layout/demo-mode-banner";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

const links = [
  {
    href: "/studio/dashboard",
    label: "Dashboard",
    icon: BarChart3,
  },
  {
    href: "/studio/console",
    label: "Developer Console",
    icon: Braces,
  },
  {
    href: "/studio/insights",
    label: "Insights",
    icon: BotMessageSquare,
  },
] as const;

export function StudioShell({
  children,
  mode,
  pathname,
}: {
  children: ReactNode;
  mode: "demo" | "live";
  pathname: string;
}) {
  return (
    <div className="min-h-screen pb-8">
      <header className="sticky top-0 z-30 border-b border-[var(--card-border)] bg-[rgba(243,246,251,0.82)] backdrop-blur-xl dark:bg-[rgba(6,16,29,0.8)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--foreground),var(--accent))] text-white">
              <Compass className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold">Subscription Intelligence Studio</p>
              <p className="text-xs text-[var(--muted)]">
                RevenueCat analytics for founders and builders
              </p>
            </div>
          </Link>
            <div className="ml-auto flex items-center gap-2">
              <Badge className="hidden md:inline-flex">
                {mode === "demo" ? "Demo dataset" : "Live RevenueCat"}
              </Badge>
              <ThemeToggle />
            </div>
          </div>
          <nav
            aria-label="Studio navigation"
            className="flex items-center gap-2 overflow-x-auto pb-1"
          >
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
                    active
                      ? "bg-[var(--foreground)] text-white dark:bg-white dark:text-[var(--background)]"
                      : "text-[var(--muted)] hover:bg-[var(--muted-soft)] hover:text-[var(--foreground)]",
                  )}
                >
                  <Icon className="size-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        <DemoModeBanner mode={mode} />
        {children}
      </main>
    </div>
  );
}
