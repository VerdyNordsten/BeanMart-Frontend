import { LoadingCard } from "./LoadingCard";

interface LoadingGridProps {
  count?: number;
  hasImages?: boolean;
  columns?: 'auto' | 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function LoadingGrid({ 
  count = 8, 
  hasImages = true, 
  columns = 'auto',
  className 
}: LoadingGridProps) {
  const gridClass = columns === 'auto' 
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
    : `grid grid-cols-${columns} gap-6`;

  return (
    <div className={`${gridClass} ${className || ""}`}>
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} hasImage={hasImages} />
      ))}
    </div>
  );
}
