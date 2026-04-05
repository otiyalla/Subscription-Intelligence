import { NextResponse } from "next/server";

import { runStudioQuery } from "@/lib/revenuecat/service";
import { studioQuerySchema } from "@/lib/revenuecat/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = studioQuerySchema.parse(body);
    const response = await runStudioQuery(parsed);

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Query failed";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
