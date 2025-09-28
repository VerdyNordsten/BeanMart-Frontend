// Common API types - shared across all endpoints

// ===== GENERIC API RESPONSE TYPES =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
  details?: Record<string, unknown>;
  statusCode?: number;
}

// ===== REQUEST TYPES =====
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SearchParams extends PaginationParams {
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

// ===== UPLOAD TYPES =====
export interface UploadResponse {
  success: boolean;
  data: {
    id: string;
    url: string;
    filename: string;
    size: number;
    mimeType: string;
  };
  message?: string;
}

export interface MultipleUploadResponse {
  success: boolean;
  data: Array<{
    id: string;
    url: string;
    filename: string;
    size: number;
    mimeType: string;
  }>;
  message?: string;
}
