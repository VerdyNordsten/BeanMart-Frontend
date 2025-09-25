// ===== BASE TYPES =====
export interface Product {
  id: string;
  slug: string;
  name: string;
  short_description?: string;
  long_description?: string;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  variants?: ProductVariant[];
  // Additional fields for frontend display
  price_min?: number;
  price_max?: number;
  origin?: string;
  roast_level?: 'light' | 'medium' | 'dark';
  tasting_notes?: string[];
  processing_method?: string;
  altitude?: string;
  producer?: string;
  harvest_date?: string;
  is_featured?: boolean;
  category_id?: string;
  images?: VariantImage[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  price: number;
  compare_at_price?: number;
  stock: number;
  weight_gram?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  images?: VariantImage[];
}

export interface VariantImage {
  id: string;
  variant_id: string;
  url: string;
  position: number;
  created_at: string;
  updated_at: string;
}

// ===== FORM TYPES =====
export interface ProductFormData {
  product: {
    slug: string;
    name: string;
    short_description?: string;
    long_description?: string;
    currency: string;
    is_active: boolean;
  };
  variants: Array<{
    id?: string;
    price: number;
    compare_at_price?: number;
    stock: number;
    weight_gram?: number;
    is_active: boolean;
    images: Array<{
      id?: string;
      url?: string;
      imageData?: string;
      position: number;
    }>;
  }>;
}

// ===== API RESPONSE TYPES =====
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: any;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// ===== CATEGORY TYPES =====
export interface Category {
  id: string;
  slug: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryFormData {
  slug: string;
  name: string;
}

// ===== USER TYPES =====
export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export interface UserAddress {
  id: string;
  user_id: string;
  label: string;
  recipient_name: string;
  recipient_phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

// ===== ORDER TYPES =====
export interface Order {
  id: string;
  user_id: string;
  address_id: string;
  status: string;
  total_amount: number;
  shipping_cost: number;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

// ===== AUTH TYPES =====
export interface LoginRequest {
  email: string;
  password: string;
  isAdmin?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  data: User;
  token: string;
}

// ===== UPLOAD TYPES =====
export interface UploadResponse {
  success: boolean;
  data: {
    id: string;
    variantId: string;
    url: string;
    position: number;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

export interface MultipleUploadResponse {
  success: boolean;
  data: Array<{
    id: string;
    variantId: string;
    url: string;
    position: number;
    createdAt: string;
    updatedAt: string;
  }>;
  message: string;
}

export interface SmartDeleteResponse {
  success: boolean;
  message: string;
  deletedFromStorage: boolean;
}