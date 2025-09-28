import { Card, CardContent } from "@/ui/card";
import { Skeleton } from "@/ui/skeleton";

interface LoadingCardProps {
  hasImage?: boolean;
  lines?: number;
  className?: string;
}

export function LoadingCard({ hasImage = false, lines = 3, className }: LoadingCardProps) {
  return (
    <Card className={className}>
      {hasImage && <Skeleton className="aspect-square w-full" />}
      <CardContent className="p-3 space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i === 0 ? 'w-3/4' : i === 1 ? 'w-1/2' : 'w-full'}`} />
        ))}
      </CardContent>
    </Card>
  );
}
