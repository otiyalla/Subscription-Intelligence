import type { Dispatch, SetStateAction } from "react";

import { Select } from "@/components/ui/field";
import type {
  PlatformFilter,
  ProductFilter,
  RangePreset,
  RegionFilter,
  StudioFilters,
} from "@/types/revenuecat";

const rangeOptions: RangePreset[] = ["7d", "30d", "90d", "180d"];
const productOptions: ProductFilter[] = ["all", "starter", "pro", "enterprise"];
const regionOptions: RegionFilter[] = ["all", "north-america", "europe", "asia-pacific"];
const platformOptions: PlatformFilter[] = ["all", "ios", "android", "web"];

export function FilterBar({
  range,
  setRange,
  filters,
  setFilters,
}: {
  range: RangePreset;
  setRange: Dispatch<SetStateAction<RangePreset>>;
  filters: StudioFilters;
  setFilters: Dispatch<SetStateAction<StudioFilters>>;
}) {
  return (
    <div className="grid gap-4 rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-5 sm:grid-cols-2 xl:grid-cols-4">
      <label className="space-y-2 text-sm" htmlFor="dashboard-range">
        <span className="font-medium">Time range</span>
        <Select
          id="dashboard-range"
          aria-label="Time range"
          value={range}
          onChange={(event) => setRange(event.target.value as RangePreset)}
        >
          {rangeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </label>
      <label className="space-y-2 text-sm" htmlFor="dashboard-product">
        <span className="font-medium">Product</span>
        <Select
          id="dashboard-product"
          aria-label="Product"
          value={filters.product}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              product: event.target.value as ProductFilter,
            }))
          }
        >
          {productOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </label>
      <label className="space-y-2 text-sm" htmlFor="dashboard-region">
        <span className="font-medium">Region</span>
        <Select
          id="dashboard-region"
          aria-label="Region"
          value={filters.region}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              region: event.target.value as RegionFilter,
            }))
          }
        >
          {regionOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </label>
      <label className="space-y-2 text-sm" htmlFor="dashboard-platform">
        <span className="font-medium">Platform</span>
        <Select
          id="dashboard-platform"
          aria-label="Platform"
          value={filters.platform}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              platform: event.target.value as PlatformFilter,
            }))
          }
        >
          {platformOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </label>
    </div>
  );
}
