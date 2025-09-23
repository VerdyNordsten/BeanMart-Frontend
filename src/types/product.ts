// Product types matching the Beanmart API structure
export interface ProductVariant {
  id: string;
  size: string;
  grind?: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  long_description: string;
  price_min: number;
  price_max: number;
  origin?: string;
  roast_level: 'light' | 'medium' | 'dark';
  tasting_notes?: string[];
  processing_method?: string;
  altitude?: string;
  producer?: string;
  harvest_date?: string;
  is_featured: boolean;
  is_active: boolean;
  category_id?: string;
  created_at: string;
  updated_at: string;
  variants: ProductVariant[];
  images: ProductImage[];
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

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  total: number;
}