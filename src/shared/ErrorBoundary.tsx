import React from 'react';
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Button } from '@/ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { debug } from '@/utils/debug';
import { toast } from 'sonner';

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  // Log the error to our debug system
  debug.error('ErrorBoundary', 'Caught an error', {
    message: error.message,
    stack: error.stack,
    name: error.name,
  });

  // Also send to toast notifications
  toast.error('Something went wrong', {
    description: error.message,
    duration: 5000,
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] px-4 py-12 text-center">
      <div className="mb-6 p-4 bg-red-50 rounded-full">
        <AlertCircle className="h-12 w-12 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <div className="text-xs text-gray-500 bg-gray-50 p-4 rounded-lg w-full max-w-md mb-6 overflow-auto">
        <details>
          <summary className="cursor-pointer mb-2">Error Details</summary>
          <pre className="text-left whitespace-pre-wrap break-words">
            {error.stack || 'No stack trace available'}
          </pre>
        </details>
      </div>
      <Button 
        onClick={resetErrorBoundary}
        variant="default"
        className="flex items-center gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<FallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  fallback: CustomFallback = ErrorFallback,
  onError = (error, errorInfo) => {
    // Default error handling
    debug.error('ErrorBoundary', 'Global error caught', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }
}) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={CustomFallback}
      onError={onError}
      onReset={() => {
        // Reset any state if needed
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;