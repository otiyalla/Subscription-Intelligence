"use client";

import { useMutation } from "@tanstack/react-query";

import { fetchJson } from "@/lib/utils/fetch-json";
import type { QueryResponse, StudioQueryInput } from "@/types/revenuecat";

export function useStudioQuery() {
  return useMutation({
    mutationFn: (input: StudioQueryInput) =>
      fetchJson<QueryResponse>("/api/studio/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      }),
  });
}
