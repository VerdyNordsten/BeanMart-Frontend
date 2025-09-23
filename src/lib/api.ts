import { apiClient, apiCall } from './api-client';
import { User } from './auth';

// Auth API
export const authApi = {
  login: async (email: string, password: string, isAdmin: boolean = false) => {
    const response = await apiCall(apiClient.post('/auth/login', { email, password, isAdmin }));
    // Handle different token field names
    if (response && response.token && !response.accessToken) {
      return {
        ...response,
        accessToken: response.token
      };
    }
    return response;
  },
  
  getProfile: async (token?: string): Promise<User> => {
    const config = token ? { 
      headers: { 
        'Authorization': `Bearer ${token}` 
      } 
    } : {};
    
    const response = await apiCall(apiClient.get('/auth/profile', config));
    // Transform the response to match the User interface
    const profileData = response.data || response;
    
    // Extract role from token if provided
    let role: 'admin' | 'user' = 'user';
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        role = payload.isAdmin ? 'admin' : 'user';
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    }
    
    return {
      id: profileData.id,
      email: profileData.email,
      full_name: profileData.full_name || profileData.fullName || '',
      role: role,
      is_active: profileData.is_active !== undefined ? profileData.is_active : true, // Default to true if not provided
      phone: profileData.phone,
      created_at: profileData.created_at
    };
  },
  
  register: async (email: string, password: string, fullName: string, phone: string) => {
    return apiCall(apiClient.post('/auth/register', { email, password, fullName, phone }));
  },
};

// User Addresses API
export const userAddressesApi = {
  getUserAddresses: async (userId: string) => {
    return apiCall(apiClient.get(`/users/${userId}/addresses`));
  },
  
  getUserAddress: async (id: string) => {
    return apiCall(apiClient.get(`/user-addresses/${id}`));
  },
  
  createUserAddress: async (userId: string, data: any) => {
    return apiCall(apiClient.post(`/users/${userId}/addresses`, data));
  },
  
  updateUserAddress: async (id: string, data: any) => {
    return apiCall(apiClient.put(`/user-addresses/${id}`, data));
  },
  
  deleteUserAddress: async (id: string) => {
    return apiCall(apiClient.delete(`/user-addresses/${id}`));
  },
  
  setUserAddressAsDefault: async (id: string, userId: string) => {
    return apiCall(apiClient.post(`/user-addresses/${id}/set-default`, { user_id: userId }));
  },
};

// Products API
export const productsApi = {
  getProducts: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: string;
  } = {}) => {
    try {
      const response = await apiCall(apiClient.get('/products', { params }));
      // API returns { success: true, data: [...] }
      return {
        success: response.success,
        data: response.data || [],
        products: response.data || [], // For backward compatibility
        pagination: {
          page: params.page || 1,
          limit: params.limit || 12,
          total: response.data?.length || 0,
          total_pages: Math.ceil((response.data?.length || 0) / (params.limit || 12))
        }
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        success: false,
        data: [],
        products: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          total_pages: 0
        }
      };
    }
  },
  
  getProduct: async (id: string) => {
    return apiCall(apiClient.get(`/products/${id}`));
  },
  
  createProduct: async (data: any) => {
    return apiCall(apiClient.post('/products', data));
  },
  
  updateProduct: async (id: string, data: any) => {
    return apiCall(apiClient.put(`/products/${id}`, data));
  },
  
  deleteProduct: async (id: string) => {
    return apiCall(apiClient.delete(`/products/${id}`));
  },
  
  getProductImages: async (id: string) => {
    return apiCall(apiClient.get(`/products/${id}/images`));
  },
  
  uploadProductImage: async (productId: string, data: FormData) => {
    return apiCall(apiClient.post(`/products/${productId}/images`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }));
  },
  
  deleteProductImage: async (productId: string, imageId: string) => {
    return apiCall(apiClient.delete(`/products/${productId}/images/${imageId}`));
  },
};

// Orders API
export const ordersApi = {
  getOrders: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = {}) => {
    return apiCall(apiClient.get('/orders', { params }));
  },
  
  getUserOrders: async () => {
    return apiCall(apiClient.get('/orders/my'));
  },
  
  getOrder: async (id: string) => {
    return apiCall(apiClient.get(`/orders/${id}`));
  },
  
  updateOrderStatus: async (id: string, status: string) => {
    return apiCall(apiClient.put(`/orders/${id}`, { status }));
  },
};

// Users API
export const usersApi = {
  getUsers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}) => {
    return apiCall(apiClient.get('/users', { params }));
  },
  
  updateUser: async (id: string, data: any) => {
    return apiCall(apiClient.put(`/users/${id}`, data));
  },
};

// Categories API
export const categoriesApi = {
  getCategories: async () => {
    return apiCall(apiClient.get('/categories'));
  },
  
  createCategory: async (data: any) => {
    return apiCall(apiClient.post('/categories', data));
  },
  
  updateCategory: async (id: string, data: any) => {
    return apiCall(apiClient.put(`/categories/${id}`, data));
  },
  
  deleteCategory: async (id: string) => {
    return apiCall(apiClient.delete(`/categories/${id}`));
  },
};

// File upload API
export const filesApi = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiCall(apiClient.post('/file-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }));
  },
};

// Product Variants API
export const productVariantsApi = {
  getProductVariants: async (productId: string) => {
    return apiCall(apiClient.get(`/product-variants/product/${productId}`));
  },
  
  getActiveProductVariants: async (productId: string) => {
    return apiCall(apiClient.get(`/product-variants/product/${productId}/active`));
  },
  
  getProductVariant: async (id: string) => {
    return apiCall(apiClient.get(`/product-variants/${id}`));
  },
  
  createProductVariant: async (data: any) => {
    return apiCall(apiClient.post('/product-variants', data));
  },
  
  updateProductVariant: async (id: string, data: any) => {
    return apiCall(apiClient.put(`/product-variants/${id}`, data));
  },
  
  deleteProductVariant: async (id: string) => {
    return apiCall(apiClient.delete(`/product-variants/${id}`));
  },
  
  getProductVariantBySku: async (sku: string) => {
    return apiCall(apiClient.get(`/product-variants/sku/${sku}`));
  },
};

// Product Categories API
export const productCategoriesApi = {
  addProductCategory: async (data: { product_id: string; category_id: string }) => {
    return apiCall(apiClient.post('/product-categories', data));
  },
  
  removeProductCategory: async (data: { product_id: string; category_id: string }) => {
    return apiCall(apiClient.post('/product-categories/remove', data));
  },
  
  getProductCategories: async (productId: string) => {
    return apiCall(apiClient.get(`/product-categories/product/${productId}`));
  },
  
  getCategoryProducts: async (categoryId: string) => {
    return apiCall(apiClient.get(`/product-categories/category/${categoryId}`));
  },
};

// Product Options API
export const productOptionsApi = {
  getProductOptions: async (optionTypeId: string) => {
    return apiCall(apiClient.get(`/product-options/option-type/${optionTypeId}`));
  },
  
  getProductOption: async (id: string) => {
    return apiCall(apiClient.get(`/product-options/${id}`));
  },
  
  createProductOption: async (data: any) => {
    return apiCall(apiClient.post('/product-options', data));
  },
  
  updateProductOption: async (id: string, data: any) => {
    return apiCall(apiClient.put(`/product-options/${id}`, data));
  },
  
  deleteProductOption: async (id: string) => {
    return apiCall(apiClient.delete(`/product-options/${id}`));
  },
};

// Product Option Types API
export const productOptionTypesApi = {
  getProductOptionTypes: async (productId: string) => {
    return apiCall(apiClient.get(`/product-option-types/product/${productId}`));
  },
  
  getProductOptionType: async (id: string) => {
    return apiCall(apiClient.get(`/product-option-types/${id}`));
  },
  
  createProductOptionType: async (data: any) => {
    return apiCall(apiClient.post('/product-option-types', data));
  },
  
  updateProductOptionType: async (id: string, data: any) => {
    return apiCall(apiClient.put(`/product-option-types/${id}`, data));
  },
  
  deleteProductOptionType: async (id: string) => {
    return apiCall(apiClient.delete(`/product-option-types/${id}`));
  },
};

// Product Images API
export const productImagesApi = {
  getProductImages: async (productId: string) => {
    return apiCall(apiClient.get(`/product-images/product/${productId}`));
  },
  
  getProductImage: async (id: string) => {
    return apiCall(apiClient.get(`/product-images/${id}`));
  },
  
  createProductImage: async (data: any) => {
    return apiCall(apiClient.post('/product-images', data));
  },
  
  updateProductImage: async (id: string, data: any) => {
    return apiCall(apiClient.put(`/product-images/${id}`, data));
  },
  
  deleteProductImage: async (id: string) => {
    return apiCall(apiClient.delete(`/product-images/${id}`));
  },
  
  updateProductImagePosition: async (id: string, position: number) => {
    return apiCall(apiClient.put(`/product-images/${id}/position`, { position }));
  },
};

// File Upload API (Product Images)
export const fileUploadApi = {
  uploadProductImage: async (data: FormData) => {
    return apiCall(apiClient.post('/file-upload/product-image', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }));
  },
  
  uploadProductImages: async (data: FormData) => {
    return apiCall(apiClient.post('/file-upload/product-images', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }));
  },
};

// Variant Images API
export const variantImagesApi = {
  getVariantImages: async (variantId: string) => {
    return apiCall(apiClient.get(`/variant-images/variant/${variantId}`));
  },
  
  getVariantImage: async (id: string) => {
    return apiCall(apiClient.get(`/variant-images/${id}`));
  },
  
  createVariantImage: async (data: any) => {
    return apiCall(apiClient.post('/variant-images', data));
  },
  
  updateVariantImage: async (id: string, data: any) => {
    return apiCall(apiClient.put(`/variant-images/${id}`, data));
  },
  
  deleteVariantImage: async (id: string) => {
    return apiCall(apiClient.delete(`/variant-images/${id}`));
  },
};

// Additional Products API
export const additionalProductsApi = {
  getActiveProducts: async () => {
    try {
      return await apiCall(apiClient.get('/products/active'));
    } catch (error) {
      console.error('Error fetching active products:', error);
      return { success: false, data: [] };
    }
  },

  getProductBySlug: async (slug: string) => {
    try {
      return await apiCall(apiClient.get(`/products/slug/${slug}`));
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      return { success: false, data: null };
    }
  },

  getProductVariants: async (id: string) => {
    try {
      return await apiCall(apiClient.get(`/products/${id}/variants`));
    } catch (error) {
      console.error('Error fetching product variants:', error);
      return { success: false, data: [] };
    }
  },

  getActiveProductVariants: async (id: string) => {
    try {
      return await apiCall(apiClient.get(`/products/${id}/variants/active`));
    } catch (error) {
      console.error('Error fetching active product variants:', error);
      return { success: false, data: [] };
    }
  },

  getProductImages: async (id: string) => {
    try {
      return await apiCall(apiClient.get(`/products/${id}/images`));
    } catch (error) {
      console.error('Error fetching product images:', error);
      return { success: false, data: [] };
    }
  },
};

// Additional Categories API
export const additionalCategoriesApi = {
  getCategoryBySlug: async (slug: string) => {
    return apiCall(apiClient.get(`/categories/slug/${slug}`));
  },
  
  getCategoryProducts: async (id: string) => {
    return apiCall(apiClient.get(`/categories/${id}/products`));
  },
};

// Additional Users API
export const additionalUsersApi = {
  getUser: async (id: string) => {
    return apiCall(apiClient.get(`/users/${id}`));
  },
  
  createUser: async (data: any) => {
    return apiCall(apiClient.post('/users', data));
  },
  
  deleteUser: async (id: string) => {
    return apiCall(apiClient.delete(`/users/${id}`));
  },
};

// Additional Orders API
export const additionalOrdersApi = {
  createOrder: async (data: any) => {
    return apiCall(apiClient.post('/orders', data));
  },
  
  deleteOrder: async (id: string) => {
    return apiCall(apiClient.delete(`/orders/${id}`));
  },
};