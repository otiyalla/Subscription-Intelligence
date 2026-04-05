import { Button } from "@/components/ui/button";

const examples = [
  "Why did MRR drop this week?",
  "Show churn trend for the last 30 days",
  "What changed in subscriptions this month?",
  "Compare this month to last month",
];

export function PromptExamples({
  onSelect,
}: {
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {examples.map((example) => (
        <Button
          key={example}
          variant="secondary"
          size="sm"
          onClick={() => onSelect(example)}
        >
          {example}
        </Button>
      ))}
    </div>
  );
}
