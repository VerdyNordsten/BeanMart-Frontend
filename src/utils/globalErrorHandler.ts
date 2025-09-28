import { debug } from '@/utils/debug';
import { toast } from 'sonner';

class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private isInitialized = false;

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  initialize() {
    if (this.isInitialized) return;

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error, 'Global Uncaught Error');
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, 'Global Unhandled Promise Rejection');
      // Prevent the default behavior (logging to console)
      event.preventDefault();
    });

    // Handle React hydration errors in development
    if (import.meta.env.DEV) {
      // React 18+ automatically handles hydration errors, but we can log them
      const originalConsoleError = console.error;
      console.error = (...args) => {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('Hydration')) {
          debug.error('Hydration', 'Hydration error detected', {
            error: args,
          });
          toast.error('Hydration Error', {
            description: 'There was an issue with page hydration. This is usually not a user-facing problem but has been logged.',
            duration: 5000,
          });
        }
        originalConsoleError(...args);
      };
    }

    this.isInitialized = true;
  }

  private handleError(error: any, context: string) {
    // Log error to our debug utility
    debug.error('GlobalErrorHandler', context, {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      fileName: error?.filename,
      lineNumber: error?.lineno,
      columnNumber: error?.colno,
    });

    // Show toast notification
    toast.error('Unexpected Error', {
      description: error?.message || 'An unexpected error occurred',
      duration: 5000,
    });

    // In production, you might want to send errors to an external service
    if (import.meta.env.PROD) {
      this.reportError(error, context);
    }
  }

  private reportError(error: any, context: string) {
    // In a real SaaS application, you would send this to an error tracking service
    // like Sentry, Bugsnag, etc.
    console.group('Error Report');
    console.log('Context:', context);
    console.log('Message:', error?.message);
    console.log('Stack:', error?.stack);
    console.groupEnd();
  }

  // Additional utility methods
  captureException(error: any, context?: string) {
    const errorContext = context || 'Manual Exception Capture';
    this.handleError(error, errorContext);
  }

  captureMessage(message: string, context?: string) {
    const error = new Error(message);
    const errorContext = context || 'Manual Message Capture';
    this.handleError(error, errorContext);
  }
}

export const globalErrorHandler = GlobalErrorHandler.getInstance();

// Initialize the global error handler
if (typeof window !== 'undefined') {
  globalErrorHandler.initialize();
}

export default globalErrorHandler;