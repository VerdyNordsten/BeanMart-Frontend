import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  actionHref, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <div className="h-12 w-12 mx-auto mb-4 flex items-center justify-center">
        {icon}
      </div>
      <p className="font-medium text-gray-900 mb-2">{title}</p>
      <p className="text-sm mb-4">{description}</p>
      {(actionLabel && (actionHref || onAction)) && (
        <Button 
          variant="outline" 
          onClick={onAction}
          {...(actionHref && { asChild: true })}
        >
          {actionHref ? (
            <a href={actionHref}>{actionLabel}</a>
          ) : (
            actionLabel
          )}
        </Button>
      )}
    </div>
  );
}
