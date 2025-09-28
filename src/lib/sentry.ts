import * as Sentry from '@sentry/react';

// Initialize Sentry for error tracking in production
if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN || '', // You'll need to set this in your .env file
    
    // Performance Monitoring
    tracesSampleRate: 0.1, // Capture 10% of transactions for performance monitoring
    
    // Filter out less critical errors
    beforeSend: (event, hint) => {
      // Filter out specific errors that we don't want to track
      const ignoredErrors = [
        'ResizeObserver loop limit exceeded',
        'Script error',
        'Network Error',
        'Failed to fetch',
      ];
      
      if (event.message && ignoredErrors.some(ignored => event.message?.includes(ignored))) {
        return null;
      }
      
      // Log to console in development
      if (import.meta.env.DEV) {
        console.group('Sentry Event Captured');
        console.log('Event:', event);
        console.log('Hint:', hint);
        console.groupEnd();
      }
      
      return event;
    },
  });
}

export { Sentry };