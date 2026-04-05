import { z } from "zod";

import {
  PLATFORMS,
  PRODUCTS,
  QUERY_METRICS,
  RANGE_PRESETS,
  REGIONS,
} from "@/types/revenuecat";

export const studioQuerySchema = z.object({
  metric: z.enum(QUERY_METRICS),
  range: z.enum(RANGE_PRESETS).default("30d"),
  comparePrevious: z.coerce.boolean().default(true),
  filters: z.object({
    product: z.enum(PRODUCTS).default("all"),
    region: z.enum(REGIONS).default("all"),
    platform: z.enum(PLATFORMS).default("all"),
  }),
  forceError: z.coerce.boolean().optional(),
});

export const dashboardSearchSchema = z.object({
  range: z.enum(RANGE_PRESETS).default("30d"),
  product: z.enum(PRODUCTS).default("all"),
  region: z.enum(REGIONS).default("all"),
  platform: z.enum(PLATFORMS).default("all"),
  forceError: z.coerce.boolean().optional(),
});

export type DashboardSearch = z.infer<typeof dashboardSearchSchema>;
