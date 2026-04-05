"use client";

import { useMutation } from "@tanstack/react-query";

import { fetchJson } from "@/lib/utils/fetch-json";
import type { InsightResult } from "@/types/revenuecat";

export function useInsight() {
  return useMutation({
    mutationFn: (prompt: string) =>
      fetchJson<InsightResult>("/api/studio/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }),
  });
}
