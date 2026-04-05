import type { Metadata } from "next";

import { AppProviders } from "@/components/providers/app-providers";
import { getRuntimeMode } from "@/lib/revenuecat/runtime";
import "./globals.css";

export const metadata: Metadata = {
  title: "Subscription Intelligence Studio",
  description:
    "A polished RevenueCat analytics studio for founders, growth teams, and AI builders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mode = getRuntimeMode();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <AppProviders mode={mode}>{children}</AppProviders>
      </body>
    </html>
  );
}
