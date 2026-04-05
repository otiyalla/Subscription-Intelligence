import { NextResponse } from "next/server";

import { insightPromptSchema } from "@/lib/revenuecat/insight-schemas";
import { generateInsight } from "@/lib/revenuecat/insights";
import { z } from "zod";

const insightSchema = z.object({
  prompt: insightPromptSchema,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = insightSchema.parse(body);
    const response = await generateInsight(parsed.prompt);

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Insight generation failed";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
