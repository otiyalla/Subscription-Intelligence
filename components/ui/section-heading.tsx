import { Badge } from "@/components/ui/badge";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <Badge className="w-fit">{eyebrow}</Badge>
      <div className="space-y-3">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="text-balance text-base text-[var(--muted)] sm:text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}
