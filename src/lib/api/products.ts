// Products API with proper typing and mappers
import { apiClient, uploadApiClient } from "../api-client";
import type {
  GetProductsResponse,
  GetProductResponse,
  GetProductDetailResponse,
  CreateProductResponse,
  UpdateProductResponse,
  DeleteProductResponse,
  GetProductVariantsResponse,
  GetProductVariantResponse,
  CreateProductVariantResponse,
  UpdateProductVariantResponse,
  DeleteProductVariantResponse,
  GetCategoriesResponse,
  GetCategoryResponse,
  CreateCategoryResponse,
  UpdateCategoryResponse,
  DeleteCategoryResponse,
  GetRoastLevelsResponse,
  GetRoastLevelResponse,
  CreateRoastLevelResponse,
  UpdateRoastLevelResponse,
  DeleteRoastLevelResponse,
  UploadVariantImageResponse,
  UploadMultipleVariantImagesResponse,
  DeleteVariantImageResponse,
  GetProductsParams,
  CreateProductRequest,
  UpdateProductRequest,
  CreateProductVariantRequest,
  UpdateProductVariantRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateRoastLevelRequest,
  UpdateRoastLevelRequest,
  UpdateProductRelationsRequest,
} from "@/types/api/product";

// ===== PRODUCTS API =====
export const productsApi = {
  // Get all products with variants and images
  getAllProducts: async (): Promise<GetProductsResponse> => {
    const response = await apiClient.get('/products');
    return response.data;
  },

  // Get products with optional parameters
  getProducts: async (params?: GetProductsParams): Promise<GetProductsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.roast_level) queryParams.append('roast_level', params.roast_level);
    if (params?.weight) queryParams.append('weight', params.weight);
    if (params?.min_price) queryParams.append('min_price', params.min_price.toString());
    if (params?.max_price) queryParams.append('max_price', params.max_price.toString());
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);
    
    const response = await apiClient.get(`/products?${queryParams.toString()}`);
    return response.data;
  },

  // Get active products with variants and images
  getActiveProducts: async (): Promise<GetProductsResponse> => {
    const response = await apiClient.get('/products/active');
    return response.data;
  },

  // Get product by ID with variants and images
  getProduct: async (id: string): Promise<GetProductResponse> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Get product by slug with variants and images
  getProductBySlug: async (slug: string): Promise<GetProductDetailResponse> => {
    const response = await apiClient.get(`/products/slug/${slug}`);
    return response.data;
  },

  // Create product (admin only)
  createProduct: async (data: CreateProductRequest): Promise<CreateProductResponse> => {
    const response = await apiClient.post('/products', data);
    return response.data;
  },

  // Update product (admin only)
  updateProduct: async (id: string, data: UpdateProductRequest): Promise<UpdateProductResponse> => {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data;
  },

  // Delete product (admin only)
  deleteProduct: async (id: string): Promise<DeleteProductResponse> => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
};

// ===== PRODUCT VARIANTS API =====
export const productVariantsApi = {
  // Get all variants for a product
  getProductVariants: async (productId: string): Promise<GetProductVariantsResponse> => {
    const response = await apiClient.get(`/product-variants/product/${productId}`);
    return response.data;
  },
  
  // Get active variants for a product
  getActiveProductVariants: async (productId: string): Promise<GetProductVariantsResponse> => {
    const response = await apiClient.get(`/product-variants/product/${productId}/active`);
    return response.data;
  },
  
  // Get variant by ID
  getProductVariant: async (id: string): Promise<GetProductVariantResponse> => {
    const response = await apiClient.get(`/product-variants/${id}`);
    return response.data;
  },

  // Create variant (admin only)
  createVariant: async (data: CreateProductVariantRequest): Promise<CreateProductVariantResponse> => {
    const response = await apiClient.post('/product-variants', data);
    return response.data;
  },

  // Update variant (admin only)
  updateVariant: async (id: string, data: UpdateProductVariantRequest): Promise<UpdateProductVariantResponse> => {
    const response = await apiClient.put(`/product-variants/${id}`, data);
    return response.data;
  },

  // Delete variant (admin only)
  deleteVariant: async (id: string): Promise<DeleteProductVariantResponse> => {
    const response = await apiClient.delete(`/product-variants/${id}`);
    return response.data;
  },
};

// ===== VARIANT IMAGES API =====
export const variantImagesApi = {
  // Upload single image (admin only)
  uploadImage: async (formData: FormData): Promise<UploadVariantImageResponse> => {
    const response = await uploadApiClient.post('/variant-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload multiple images (admin only)
  uploadMultipleImages: async (formData: FormData): Promise<UploadMultipleVariantImagesResponse> => {
    const response = await uploadApiClient.post('/variant-images/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Advanced upload (file, URL, or base64) (admin only)
  uploadAdvanced: async (formData: FormData): Promise<UploadVariantImageResponse> => {
    const response = await uploadApiClient.post('/variant-images/upload-advanced', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Advanced upload multiple (admin only)
  uploadAdvancedMultiple: async (formData: FormData): Promise<UploadMultipleVariantImagesResponse> => {
    const response = await uploadApiClient.post('/variant-images/upload-advanced-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete image (admin only)
  deleteImage: async (id: string): Promise<DeleteVariantImageResponse> => {
    const response = await apiClient.delete(`/variant-images/${id}`);
    return response.data;
  },

  // Smart delete image (admin only)
  smartDeleteImage: async (id: string): Promise<DeleteVariantImageResponse> => {
    const response = await apiClient.delete(`/variant-images/${id}/smart-delete`);
    return response.data;
  },
};

// ===== CATEGORIES API =====
export const categoriesApi = {
  // Get all categories
  getAllCategories: async (): Promise<GetCategoriesResponse> => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  // Get category by ID
  getCategory: async (id: string): Promise<GetCategoryResponse> => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string): Promise<GetCategoryResponse> => {
    const response = await apiClient.get(`/categories/slug/${slug}`);
    return response.data;
  },

  // Get products for category
  getProductsForCategory: async (id: string): Promise<GetProductsResponse> => {
    const response = await apiClient.get(`/categories/${id}/products`);
    return response.data;
  },

  // Create category (admin only)
  createCategory: async (data: CreateCategoryRequest): Promise<CreateCategoryResponse> => {
    const response = await apiClient.post('/categories', data);
    return response.data;
  },

  // Update category (admin only)
  updateCategory: async (id: string, data: UpdateCategoryRequest): Promise<UpdateCategoryResponse> => {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data;
  },

  // Delete category (admin only)
  deleteCategory: async (id: string): Promise<DeleteCategoryResponse> => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },
};

// ===== ROAST LEVELS API =====
export const roastLevelsApi = {
  // Get all roast levels
  getAllRoastLevels: async (): Promise<GetRoastLevelsResponse> => {
    const response = await apiClient.get('/roast-levels');
    return response.data;
  },

  // Get roast level by ID
  getRoastLevel: async (id: string): Promise<GetRoastLevelResponse> => {
    const response = await apiClient.get(`/roast-levels/${id}`);
    return response.data;
  },

  // Get roast level by slug
  getRoastLevelBySlug: async (slug: string): Promise<GetRoastLevelResponse> => {
    const response = await apiClient.get(`/roast-levels/slug/${slug}`);
    return response.data;
  },

  // Get products for roast level
  getProductsForRoastLevel: async (id: string): Promise<GetProductsResponse> => {
    const response = await apiClient.get(`/roast-levels/${id}/products`);
    return response.data;
  },

  // Create roast level (admin only)
  createRoastLevel: async (data: CreateRoastLevelRequest): Promise<CreateRoastLevelResponse> => {
    const response = await apiClient.post('/roast-levels', data);
    return response.data;
  },

  // Update roast level (admin only)
  updateRoastLevel: async (id: string, data: UpdateRoastLevelRequest): Promise<UpdateRoastLevelResponse> => {
    const response = await apiClient.put(`/roast-levels/${id}`, data);
    return response.data;
  },

  // Delete roast level (admin only)
  deleteRoastLevel: async (id: string): Promise<DeleteRoastLevelResponse> => {
    const response = await apiClient.delete(`/roast-levels/${id}`);
    return response.data;
  },
};

// ===== PRODUCT RELATIONS API =====
export const productRelationsApi = {
  // Update product categories and roast levels
  updateProductRelations: async (productId: string, data: UpdateProductRelationsRequest): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.put(`/product-relations/${productId}`, data);
    return response.data;
  },

  // Get product relations
  getProductRelations: async (productId: string): Promise<ApiResponse<{ categories: string[]; roastLevels: string[] }>> => {
    const response = await apiClient.get(`/product-relations/${productId}`);
    return response.data;
  },
};
