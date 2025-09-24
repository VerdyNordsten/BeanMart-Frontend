// API types for Beanmart
export interface UserAddress {
  id: string;
  user_id: string;
  name: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserAddressData {
  name: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

export type UpdateUserAddressData = Partial<CreateUserAddressData>

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  is_active?: boolean;
}

export type UpdateCategoryData = Partial<CreateCategoryData>

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: UserAddress;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
  };
  variant: {
    id: string;
    size: string;
    grind?: string;
  };
}

export interface CreateOrderData {
  shipping_address_id: string;
  items: {
    product_id: string;
    variant_id: string;
    quantity: number;
  }[];
}

export interface ProductOptionType {
  id: string;
  product_id: string;
  name: string;
  display_name: string;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductOption {
  id: string;
  option_type_id: string;
  name: string;
  display_name: string;
  price_adjustment: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductOptionTypeData {
  product_id: string;
  name: string;
  display_name: string;
  is_required?: boolean;
}

export type UpdateProductOptionTypeData = Partial<CreateProductOptionTypeData>

export interface CreateProductOptionData {
  option_type_id: string;
  name: string;
  display_name: string;
  price_adjustment?: number;
  is_active?: boolean;
}

export type UpdateProductOptionData = Partial<CreateProductOptionData>

export interface ProductVariantData {
  product_id: string;
  sku: string;
  size: string;
  grind?: string;
  price: number;
  stock_quantity: number;
  is_active?: boolean;
}

export type UpdateProductVariantData = Partial<ProductVariantData>

export interface ProductImageData {
  product_id: string;
  url: string;
  alt_text?: string;
  is_primary?: boolean;
  sort_order?: number;
}

export type UpdateProductImageData = Partial<ProductImageData>

export interface VariantImageData {
  variant_id: string;
  url: string;
  alt_text?: string;
  is_primary?: boolean;
  sort_order?: number;
}

export type UpdateVariantImageData = Partial<VariantImageData>

export interface CreateProductData {
  name: string;
  slug: string;
  short_description: string;
  long_description: string;
  origin?: string;
  roast_level: 'light' | 'medium' | 'dark';
  tasting_notes?: string[];
  processing_method?: string;
  altitude?: string;
  producer?: string;
  harvest_date?: string;
  is_featured?: boolean;
  is_active?: boolean;
  category_id?: string;
}

export type UpdateProductData = Partial<CreateProductData>

export interface CreateUserData {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  is_admin?: boolean;
}

export interface UpdateUserData {
  email?: string;
  full_name?: string;
  phone?: string;
  is_active?: boolean;
}

export interface ProductCategoryData {
  product_id: string;
  category_id: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
