import type { StudioQueryInput } from "@/types/revenuecat";

export function createCurlSnippet(input: StudioQueryInput) {
  return `curl -X POST "${
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  }/api/studio/query" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(input, null, 2)}'`;
}

export function createTypeScriptSnippet(input: StudioQueryInput) {
  return `const response = await fetch("/api/studio/query", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(${JSON.stringify(input, null, 2)}),
});

if (!response.ok) {
  throw new Error("Studio query failed");
}

const data = await response.json();`;
}
