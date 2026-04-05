import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recipes = [
  "Compare 30-day MRR by platform before launching pricing tests.",
  "Inspect churn rate after onboarding changes to validate retention quality.",
  "Segment subscription growth by region to spot geographic concentration.",
];

export function Recipes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example API recipes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recipes.map((recipe) => (
          <div
            key={recipe}
            className="rounded-2xl border border-[var(--card-border)] bg-[var(--muted-soft)] px-4 py-3 text-sm text-[var(--muted)]"
          >
            {recipe}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
