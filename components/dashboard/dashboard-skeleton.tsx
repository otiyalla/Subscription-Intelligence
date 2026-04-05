import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" data-testid="dashboard-loading-state">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-32" />
            </CardHeader>
            <CardContent className="flex items-end justify-between gap-4">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1.4fr_1fr]">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="min-h-[360px]">
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[260px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
