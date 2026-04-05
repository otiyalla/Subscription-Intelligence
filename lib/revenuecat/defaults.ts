import type { StudioFilters, StudioQueryInput } from "@/types/revenuecat";

export function createDefaultStudioFilters(): StudioFilters {
  return {
    product: "all",
    region: "all",
    platform: "all",
  };
}

export function createDefaultStudioQuery(): StudioQueryInput {
  return {
    metric: "revenue",
    range: "30d",
    comparePrevious: true,
    filters: createDefaultStudioFilters(),
  };
}
