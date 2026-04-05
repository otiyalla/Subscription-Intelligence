import { NextResponse } from "next/server";

import { getRouteErrorDetails } from "@/lib/api/route-errors";
import { runStudioQuery } from "@/lib/revenuecat/service";
import { studioQuerySchema } from "@/lib/revenuecat/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = studioQuerySchema.parse(body);
    const response = await runStudioQuery(parsed);

    return NextResponse.json(response);
  } catch (error) {
    const { message, status } = getRouteErrorDetails(error, "Query failed");

    return NextResponse.json({ error: message }, { status });
  }
}
