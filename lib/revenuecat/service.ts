import { getDemoDashboard, runDemoQuery } from "@/lib/revenuecat/demo-adapter";
import { getLiveDashboard, runLiveQuery } from "@/lib/revenuecat/live-adapter";
import { getRuntimeMode } from "@/lib/revenuecat/runtime";
import type {
  DashboardResponse,
  QueryResponse,
  StudioQueryInput,
} from "@/types/revenuecat";

export async function getDashboardData(
  input: Omit<StudioQueryInput, "metric" | "comparePrevious">,
): Promise<DashboardResponse> {
  const mode = getRuntimeMode();

  return mode === "demo" ? getDemoDashboard(input) : getLiveDashboard(input);
}

export async function runStudioQuery(
  input: StudioQueryInput,
): Promise<QueryResponse> {
  const mode = getRuntimeMode();

  return mode === "demo" ? runDemoQuery(input) : runLiveQuery(input);
}
