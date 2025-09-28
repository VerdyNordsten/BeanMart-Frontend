import { debug } from '@/utils/debug';
import { toast } from 'sonner';

interface ErrorReportOptions {
  level?: 'error' | 'warning' | 'info';
  showNotification?: boolean;
  reportToSentry?: boolean;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
}

class ErrorReporter {
  private static instance: ErrorReporter;

  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter();
    }
    return ErrorReporter.instance;
  }

  private constructor() {}

  report(
    error: unknown, 
    context?: string, 
    options: ErrorReportOptions = {}
  ): void {
    const {
      level = 'error',
      showNotification = true,
      reportToSentry = true,
      tags = {},
      extra = {}
    } = options;

    // Format the error for consistent reporting
    const formattedError = this.formatError(error);

    // Log to our debug system
    if (debug[level as keyof typeof debug]) {
      (debug as any)[level](context || 'ErrorReporter', formattedError.message || 'An error occurred', {
        error: formattedError,
        tags,
        extra,
        context
      });
    } else {
      debug.error(context || 'ErrorReporter', formattedError.message || 'An error occurred', {
        error: formattedError,
        tags,
        extra,
        context
      });
    }

    // Show notification if requested
    if (showNotification) {
      this.showNotification(level, formattedError, context);
    }

    // Report to Sentry if requested and in production
    if (reportToSentry && import.meta.env.PROD) {
      this.reportToSentry(formattedError, context, tags, extra);
    }
  }

  private formatError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }

    if (typeof error === 'string') {
      return new Error(error);
    }

    // Handle axios errors specifically
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      return new Error(
        axiosError.message || 
        axiosError.response?.data?.message || 
        axiosError.response?.data?.error || 
        'API request failed'
      );
    }

    return new Error('Unknown error occurred');
  }

  private showNotification(level: string, error: Error, context?: string): void {
    const title = context || 'Error';
    const description = error.message;

    switch (level) {
      case 'error':
        toast.error(title, { description, duration: 5000 });
        break;
      case 'warning':
        toast.warning(title, { description, duration: 3000 });
        break;
      case 'info':
        toast(title, { description, duration: 2000 });
        break;
    }
  }

  private reportToSentry(
    error: Error, 
    context?: string, 
    tags?: Record<string, string>, 
    extra?: Record<string, unknown>
  ): void {
    // In a real implementation, this would send to Sentry
    console.log('Sentry error report:', { error, context, tags, extra });
  }

  // Convenience methods
  error(error: unknown, context?: string, options?: Omit<ErrorReportOptions, 'level'>): void {
    this.report(error, context, { ...options, level: 'error' });
  }

  warning(warning: unknown, context?: string, options?: Omit<ErrorReportOptions, 'level'>): void {
    this.report(warning, context, { ...options, level: 'warning' });
  }

  info(message: string, context?: string, options?: Omit<ErrorReportOptions, 'level'>): void {
    this.report(new Error(message), context, { ...options, level: 'info' });
  }

  // Method to capture user feedback
  captureUserFeedback(
    error: Error,
    email: string,
    comment: string,
    name?: string
  ): void {
    // In a real implementation, this would show a Sentry dialog
    console.log('Sentry feedback:', { error, email, comment, name });
  }
}

export const errorReporter = ErrorReporter.getInstance();

// Convenience functions
export const reportError = (
  error: unknown, 
  context?: string, 
  options?: Omit<ErrorReportOptions, 'level'>
) => errorReporter.error(error, context, options);

export const reportWarning = (
  warning: unknown, 
  context?: string, 
  options?: Omit<ErrorReportOptions, 'level'>
) => errorReporter.warning(warning, context, options);

export const reportInfo = (
  message: string, 
  context?: string, 
  options?: Omit<ErrorReportOptions, 'level'>
) => errorReporter.info(message, context, options);