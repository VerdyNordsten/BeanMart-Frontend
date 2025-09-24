import axios, { AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from './auth';
import { debug, logApi, logResponse, logError } from '@/utils/debug';

// Create axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
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
    }
    return Promise.reject(error);
  }
);

// API error type
export interface APIError {
  message: string;
  details?: Record<string, string[]>;
  status?: number;
}

// Helper to format API errors
export const formatAPIError = (error: unknown): APIError => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
      const data = axiosError.response.data as { message?: string; details?: Record<string, string[]> };
      return {
        message: data.message || 'An error occurred',
        details: data.details || {},
        status: axiosError.response.status,
      };
    }
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return {
      message: (error as Error).message || 'Network error',
      status: 0,
    };
  }
  
  return {
    message: 'Unknown error',
    status: 0,
  };
};

// Wrapper function for API calls with error handling
export const apiCall = async <T>(promise: Promise<AxiosResponse<T>>): Promise<T> => {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    throw formatAPIError(error);
  }
};