// Domain types for Product entities - mirrors database schema exactly
export type UUID = string;
export type ISODate = string;
export type CurrencyCode = string;

// ===== BASE TYPES (exact database schema) =====
export interface Category {
  id: UUID;
  slug: string;
  name: string;
  // Note: categories table doesn't have created_at/updated_at in DB
}

export interface RoastLevel {
  id: UUID;
  slug: string;
  name: string;
  // Note: roast_levels table doesn't have created_at/updated_at in DB
}

export interface VariantImage {
  id: UUID;
  variant_id: UUID;
  url: string;
  position: number;
  // Note: variant_images table doesn't have created_at/updated_at in DB
}

export interface ProductVariant {
  id: UUID;
  product_id: UUID;
  price: number;
  compare_at_price?: number | null;
  stock: number;
  weight_gram?: number | null;
  is_active: boolean;
  created_at: ISODate;
  updated_at: ISODate;
}

export interface Product {
  id: UUID;
  slug: string;
  name: string;
  short_description?: string | null;
  long_description?: string | null;
  currency: CurrencyCode;
  is_active: boolean;
  created_at: ISODate;
  updated_at: ISODate;
}

// ===== RELATION TYPES =====
export interface ProductVariantWithImages extends ProductVariant {
  images: VariantImage[];
}

export interface ProductWithRelations extends Product {
  categories: Category[];
  roast_levels: RoastLevel[];
  variants: ProductVariantWithImages[];
}

// ===== UTILITY TYPES (junction tables) =====
export interface ProductCategory {
  product_id: UUID;
  category_id: UUID;
}

export interface ProductRoastLevel {
  product_id: UUID;
  roast_level_id: UUID;
}
