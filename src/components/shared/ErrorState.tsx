import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({ 
  title = "Something went wrong",
  message = "We encountered an error while loading this content.",
  onRetry,
  retryLabel = "Try again"
}: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <div className="h-12 w-12 mx-auto mb-4 flex items-center justify-center text-red-500">
        <AlertCircle className="h-12 w-12" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
