import axios, { AxiosResponse, AxiosError } from "axios";
import { useAuthStore } from "./auth";
import { debug } from "@/utils/debug";
import { globalErrorHandler } from "@/utils/globalErrorHandler";
import { logger } from "@/utils/logger";

// Create axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  timeout: 10000, // Keep default timeout low for normal requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create special instance for file uploads with longer timeout
export const uploadApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  timeout: 120000, // 2 minutes timeout for upload operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Apply the same interceptors to uploadApiClient
uploadApiClient.interceptors.request.use(
  (config) => {
    const {token} = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log API request
    debug.apiRequest(config.method?.toUpperCase() || 'UNKNOWN', config.url || '', {
      data: config.data,
      headers: config.headers,
    });
    
    return config;
  },
  (error) => {
    // Log request error
    debug.apiError(error, error.config?.url || 'unknown');
    return Promise.reject(error);
  }
);

uploadApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful response
    debug.apiResponse(response.status, response.config.url || '', {
      data: response.data,
      statusText: response.statusText,
    });
    return response;
  },
  (error: AxiosError) => {
    // Log error response
    debug.apiError(error, error.config?.url || 'unknown');
    
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();

      // Redirect to login if not already there
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/admin')) {
          window.location.href = '/admin/login';
        } else {
          window.location.href = '/login';
        }
      }
    } else if (error.response?.status >= 500) {
      // For server errors, log to global error handler
      globalErrorHandler.captureException(error, `API Server Error: ${error.config?.url}`);
    }
    
    return Promise.reject(error);
  }
);

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const {token} = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log API request
    debug.apiRequest(config.method?.toUpperCase() || 'UNKNOWN', config.url || '', {
      data: config.data,
      headers: config.headers,
    });
    
    return config;
  },
  (error) => {
    // Log request error
    debug.apiError(error, error.config?.url || 'unknown');
    return Promise.reject(error);
  }
);

// Response interceptor to handle 500 errors and other responses
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful response
    debug.apiResponse(response.status, response.config.url || '', {
      data: response.data,
      statusText: response.statusText,
    });
    return response;
  },
  (error: AxiosError) => {
    // Log error response
    debug.apiError(error, error.config?.url || 'unknown');
    
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();

      // Redirect to login if not already there
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/admin')) {
          window.location.href = '/admin/login';
        } else {
          window.location.href = '/login';
        }
      }
    } else if (error.response?.status >= 500) {
      // For server errors, log to global error handler
      globalErrorHandler.captureException(error, `API Server Error: ${error.config?.url}`);
    }
    
    return Promise.reject(error);
  }
);

// API error type
export interface APIError {
  message: string;
  details?: Record<string, string[]>;
  status?: number;
  url?: string;
  method?: string;
}

// Helper to format API errors with enhanced details
export const formatAPIError = (error: unknown, config?: {
  url?: string;
  method?: string;
}): APIError => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
      const data = axiosError.response.data as { message?: string; details?: Record<string, string[]>; error?: string };
      return {
        message: data.message || data.error || "An API error occurred",
        details: data.details || {},
        status: axiosError.response.status,
        url: config?.url,
        method: config?.method,
      };
    }
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return {
      message: (error as Error).message || "Network error",
      status: 0,
      url: config?.url,
      method: config?.method,
    };
  }
  
  return {
    message: 'Unknown error',
    status: 0,
    url: config?.url,
    method: config?.method,
  };
};

// Enhanced wrapper function for API calls with error handling
export const apiCall = async <T>(promise: Promise<AxiosResponse<T>>): Promise<T> => {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    // Get the config information for better error reporting
    let config;
    if (error && typeof error === 'object' && 'config' in error) {
      const axiosError = error as AxiosError;
      config = {
        url: axiosError.config?.url,
        method: axiosError.config?.method,
      };
    }
    
    const formattedError = formatAPIError(error, config);
    
    // Log the formatted error
    debug.error('API', 'API call failed', formattedError);
    
    throw formattedError;
  }
};

// New enhanced API call function with automatic error reporting
export const apiCallWithErrorHandling = async <T>(
  promise: Promise<AxiosResponse<T>>,
  options?: {
    silent?: boolean; // If true, don't show toast notification
    customErrorMessage?: string; // Custom error message to show
    reportToSentry?: boolean; // Whether to report to error tracking service
  }
): Promise<T> => {
  const { silent = false, customErrorMessage, reportToSentry = true } = options || {};
  
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    // Get the config information for better error reporting
    let config;
    if (error && typeof error === 'object' && 'config' in error) {
      const axiosError = error as AxiosError;
      config = {
        url: axiosError.config?.url,
        method: axiosError.config?.method?.toUpperCase(),
      };
    }
    
    const formattedError = formatAPIError(error, config);
    
    // Log the error
    debug.error('API', 'API call failed', formattedError);
    
    // Show error toast if not silent
    if (!silent) {
      const message = customErrorMessage || formattedError.message || 'An error occurred during the API call';
      // Using sonner toast - need to import this but will be available in the calling component
      // We'll just log for now and components should handle the toast
      logger.error('API Error', { message, error: formattedError });
    }
    
    // Report to error tracking if enabled
    if (reportToSentry) {
      globalErrorHandler.captureException(error, `API Call Error: ${config?.url}`);
    }
    
    throw formattedError;
  }
};