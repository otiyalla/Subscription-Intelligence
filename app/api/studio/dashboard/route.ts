import { NextResponse } from "next/server";

import { getDashboardData } from "@/lib/revenuecat/service";
import { dashboardSearchSchema } from "@/lib/revenuecat/schemas";

export async function GET(request: Request) {
  try {
    const searchParams = Object.fromEntries(new URL(request.url).searchParams.entries());
    const parsed = dashboardSearchSchema.parse(searchParams);
    const response = await getDashboardData({
      range: parsed.range,
      filters: {
        product: parsed.product,
        region: parsed.region,
        platform: parsed.platform,
      },
      forceError: parsed.forceError,
    });

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Dashboard request failed";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
