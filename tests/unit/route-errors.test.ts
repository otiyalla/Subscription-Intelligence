import { z } from "zod";

import { getRouteErrorDetails } from "@/lib/api/route-errors";

describe("getRouteErrorDetails", () => {
  it("returns 400 for zod validation errors", () => {
    const schema = z.object({
      range: z.enum(["7d", "30d"]),
    });
    const parseResult = schema.safeParse({
      range: "14d",
    });

    expect(parseResult.success).toBe(false);

    if (parseResult.success) {
      throw new Error("Expected the schema parse to fail.");
    }

    const details = getRouteErrorDetails(
      parseResult.error,
      "Request failed",
    );

    expect(details).toEqual({
      message: "Invalid request payload.",
      status: 400,
    });
  });

  it("returns 502 for upstream RevenueCat failures", () => {
    const details = getRouteErrorDetails(
      new Error("RevenueCat request failed with 400: unsupported filter"),
      "Request failed",
    );

    expect(details).toEqual({
      message: "RevenueCat request failed with 400: unsupported filter",
      status: 502,
    });
  });

  it("returns 500 for non-validation application errors", () => {
    const details = getRouteErrorDetails(
      new Error("Missing required env var: REVENUECAT_API_KEY"),
      "Request failed",
    );

    expect(details).toEqual({
      message: "Missing required env var: REVENUECAT_API_KEY",
      status: 500,
    });
  });
});
