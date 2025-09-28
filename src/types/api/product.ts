// API types for Product endpoints
import type { 
  Product, 
  ProductWithRelations, 
  ProductVariant, 
  ProductVariantWithImages,
  Category, 
  RoastLevel,
  VariantImage 
} from "../domain/product";
import type { ApiResponse, PaginatedResponse, SearchParams } from "./common";

// ===== PRODUCT API RESPONSES =====
export type GetProductsResponse = PaginatedResponse<ProductWithRelations>;
export type GetProductResponse = ApiResponse<ProductWithRelations>;
export type GetProductDetailResponse = ApiResponse<ProductWithRelations>;
export type CreateProductResponse = ApiResponse<Product>;
export type UpdateProductResponse = ApiResponse<Product>;
export type DeleteProductResponse = ApiResponse<{ id: string }>;

// ===== PRODUCT VARIANT API RESPONSES =====
export type GetProductVariantsResponse = ApiResponse<ProductVariantWithImages[]>;
export type GetProductVariantResponse = ApiResponse<ProductVariantWithImages>;
export type CreateProductVariantResponse = ApiResponse<ProductVariant>;
export type UpdateProductVariantResponse = ApiResponse<ProductVariant>;
export type DeleteProductVariantResponse = ApiResponse<{ id: string }>;

// ===== CATEGORY API RESPONSES =====
export type GetCategoriesResponse = ApiResponse<Category[]>;
export type GetCategoryResponse = ApiResponse<Category>;
export type CreateCategoryResponse = ApiResponse<Category>;
export type UpdateCategoryResponse = ApiResponse<Category>;
export type DeleteCategoryResponse = ApiResponse<{ id: string }>;

// ===== ROAST LEVEL API RESPONSES =====
export type GetRoastLevelsResponse = ApiResponse<RoastLevel[]>;
export type GetRoastLevelResponse = ApiResponse<RoastLevel>;
export type CreateRoastLevelResponse = ApiResponse<RoastLevel>;
export type UpdateRoastLevelResponse = ApiResponse<RoastLevel>;
export type DeleteRoastLevelResponse = ApiResponse<{ id: string }>;

// ===== VARIANT IMAGE API RESPONSES =====
export type UploadVariantImageResponse = ApiResponse<VariantImage>;
export type UploadMultipleVariantImagesResponse = ApiResponse<VariantImage[]>;
export type DeleteVariantImageResponse = ApiResponse<{ id: string }>;

// ===== PRODUCT REQUEST TYPES =====
export interface GetProductsParams extends SearchParams {
  category?: string;
  roast_level?: string;
  weight?: string;
  min_price?: number;
  max_price?: number;
  is_active?: boolean;
}

export interface CreateProductRequest {
  slug: string;
  name: string;
  short_description?: string;
  long_description?: string;
  currency: string;
  is_active: boolean;
}

export interface UpdateProductRequest {
  slug?: string;
  name?: string;
  short_description?: string;
  long_description?: string;
  currency?: string;
  is_active?: boolean;
}

export interface CreateProductVariantRequest {
  product_id: string;
  price: number;
  compare_at_price?: number;
  stock: number;
  weight_gram?: number;
  is_active: boolean;
}

export interface UpdateProductVariantRequest {
  price?: number;
  compare_at_price?: number;
  stock?: number;
  weight_gram?: number;
  is_active?: boolean;
}

export interface CreateCategoryRequest {
  slug: string;
  name: string;
}

export interface UpdateCategoryRequest {
  slug?: string;
  name?: string;
}

export interface CreateRoastLevelRequest {
  slug: string;
  name: string;
}

export interface UpdateRoastLevelRequest {
  slug?: string;
  name?: string;
}

export interface UpdateProductRelationsRequest {
  categories?: string[];
  roastLevels?: string[];
}

// ===== FORM DATA TYPES =====
export interface ProductFormData {
  slug: string;
  name: string;
  short_description?: string;
  long_description?: string;
  currency: string;
  is_active: boolean;
  categories: string[];
  roastLevels: string[];
  variants: Array<{
    price: number;
    compare_at_price?: number;
    stock: number;
    weight_gram?: number;
    is_active: boolean;
    images: Array<{
      url: string;
      position: number;
    }>;
  }>;
}

export interface CategoryFormData {
  slug: string;
  name: string;
}

export interface RoastLevelFormData {
  slug: string;
  name: string;
}
