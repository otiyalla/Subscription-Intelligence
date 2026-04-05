"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchJson } from "@/lib/utils/fetch-json";
import type {
  DashboardResponse,
  RangePreset,
  StudioFilters,
} from "@/types/revenuecat";

export function useDashboard(range: RangePreset, filters: StudioFilters) {
  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      range,
      product: filters.product,
      region: filters.region,
      platform: filters.platform,
    });

    return params.toString();
  }, [filters.platform, filters.product, filters.region, range]);

  return useQuery({
    queryKey: ["dashboard", queryString],
    queryFn: () => fetchJson<DashboardResponse>(`/api/studio/dashboard?${queryString}`),
  });
}
