export type RuntimeMode = "demo" | "live";

export function getRuntimeMode(): RuntimeMode {
  const hasCredentials = Boolean(
    process.env.REVENUECAT_API_KEY && process.env.REVENUECAT_PROJECT_ID,
  );

  return hasCredentials ? "live" : "demo";
}
