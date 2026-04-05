import { headers } from "next/headers";
import type { ReactNode } from "react";

import { StudioShell } from "@/components/layout/studio-shell";
import { getRuntimeMode } from "@/lib/revenuecat/runtime";

export default async function StudioLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "/studio/dashboard";
  const mode = getRuntimeMode();

  return (
    <StudioShell mode={mode} pathname={pathname}>
      {children}
    </StudioShell>
  );
}
