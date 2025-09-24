import { apiClient } from './api-client';

// ===== AUTH API =====
export const authApi = {
  register: async (data: {
    email: string;
    password: string;
    fullName?: string;
    phone?: string;
  }) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: {
    email: string;
    password: string;
    isAdmin?: boolean;
  }) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
};

// ===== PRODUCTS API =====
export const productsApi = {
  // Get all products with variants and images
  getAllProducts: async () => {
    const response = await apiClient.get('/products');
    return response.data;
  },

  // Get active products with variants and images
  getActiveProducts: async () => {
    const response = await apiClient.get('/products/active');
    return response.data;
  },

  // Get product by ID with variants and images
  getProduct: async (id: string) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Get product by slug with variants and images
  getProductBySlug: async (slug: string) => {
    const response = await apiClient.get(`/products/slug/${slug}`);
    return response.data;
  },

  // Create product (admin only)
  createProduct: async (data: {
    slug: string;
    name: string;
    short_description?: string;
    long_description?: string;
    currency: string;
    is_active: boolean;
  }) => {
    const response = await apiClient.post('/products', data);
    return response.data;
  },

  // Update product (admin only)
  updateProduct: async (id: string, data: {
    slug?: string;
    name?: string;
    short_description?: string;
    long_description?: string;
    currency?: string;
    is_active?: boolean;
  }) => {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data;
  },

  // Delete product (admin only)
  deleteProduct: async (id: string) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
};

// ===== PRODUCT VARIANTS API =====
export const productVariantsApi = {
  // Get all variants for a product
  getProductVariants: async (productId: string) => {
    const response = await apiClient.get(`/product-variants/product/${productId}`);
    return response.data;
  },
  
  // Get active variants for a product
  getActiveProductVariants: async (productId: string) => {
    const response = await apiClient.get(`/product-variants/product/${productId}/active`);
    return response.data;
  },
  
  // Get variant by ID
  getProductVariant: async (id: string) => {
    const response = await apiClient.get(`/product-variants/${id}`);
    return response.data;
  },

  // Create variant (admin only)
  createVariant: async (data: {
    product_id: string;
    price: number;
    compare_at_price?: number;
    stock: number;
    weight_gram?: number;
    is_active: boolean;
  }) => {
    const response = await apiClient.post('/product-variants', data);
    return response.data;
  },

  // Update variant (admin only)
  updateVariant: async (id: string, data: {
    price?: number;
    compare_at_price?: number;
    stock?: number;
    weight_gram?: number;
    is_active?: boolean;
  }) => {
    const response = await apiClient.put(`/product-variants/${id}`, data);
    return response.data;
  },

  // Delete variant (admin only)
  deleteVariant: async (id: string) => {
    const response = await apiClient.delete(`/product-variants/${id}`);
    return response.data;
  },
};

// ===== VARIANT IMAGES API =====
export const variantImagesApi = {
  // Upload single image (admin only)
  uploadImage: async (formData: FormData) => {
    const response = await apiClient.post('/variant-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload multiple images (admin only)
  uploadMultipleImages: async (formData: FormData) => {
    const response = await apiClient.post('/variant-images/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Advanced upload (file, URL, or base64) (admin only)
  uploadAdvanced: async (formData: FormData) => {
    const response = await apiClient.post('/variant-images/upload-advanced', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Advanced upload multiple (admin only)
  uploadAdvancedMultiple: async (formData: FormData) => {
    const response = await apiClient.post('/variant-images/upload-advanced-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete image (admin only)
  deleteImage: async (id: string) => {
    const response = await apiClient.delete(`/variant-images/${id}`);
    return response.data;
  },

  // Smart delete image (admin only)
  smartDeleteImage: async (id: string) => {
    const response = await apiClient.delete(`/variant-images/${id}/smart-delete`);
    return response.data;
  },
};

// ===== CATEGORIES API =====
export const categoriesApi = {
  // Get all categories
  getAllCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  // Get category by ID
  getCategory: async (id: string) => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string) => {
    const response = await apiClient.get(`/categories/slug/${slug}`);
    return response.data;
  },

  // Get products for category
  getProductsForCategory: async (id: string) => {
    const response = await apiClient.get(`/categories/${id}/products`);
    return response.data;
  },

  // Create category (admin only)
  createCategory: async (data: {
    slug: string;
    name: string;
  }) => {
    const response = await apiClient.post('/categories', data);
    return response.data;
  },

  // Update category (admin only)
  updateCategory: async (id: string, data: {
    slug?: string;
    name?: string;
  }) => {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data;
  },

  // Delete category (admin only)
  deleteCategory: async (id: string) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },
};

// ===== USERS API =====
export const usersApi = {
  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  // Get user by ID (admin only)
  getUser: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // Update user (admin only)
  updateUser: async (id: string, data: {
    email?: string;
    full_name?: string;
    phone?: string;
  }) => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};

// ===== USER ADDRESSES API =====
export const userAddressesApi = {
  // Get user addresses
  getUserAddresses: async (userId: string) => {
    const response = await apiClient.get(`/user-addresses/user/${userId}`);
    return response.data;
  },

  // Get address by ID
  getAddress: async (id: string) => {
    const response = await apiClient.get(`/user-addresses/${id}`);
    return response.data;
  },

  // Create address
  createAddress: async (data: {
    user_id: string;
    label: string;
    recipient_name: string;
    recipient_phone: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
    is_primary: boolean;
  }) => {
    const response = await apiClient.post('/user-addresses', data);
    return response.data;
  },

  // Update address
  updateAddress: async (id: string, data: {
    label?: string;
    recipient_name?: string;
    recipient_phone?: string;
    address?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    is_primary?: boolean;
  }) => {
    const response = await apiClient.put(`/user-addresses/${id}`, data);
    return response.data;
  },

  // Delete address
  deleteAddress: async (id: string) => {
    const response = await apiClient.delete(`/user-addresses/${id}`);
    return response.data;
  },
};

// ===== ORDERS API =====
export const ordersApi = {
  // Get all orders (admin only)
  getAllOrders: async () => {
    const response = await apiClient.get('/orders');
    return response.data;
  },

  // Get user orders
  getUserOrders: async (userId: string) => {
    const response = await apiClient.get(`/orders/user/${userId}`);
    return response.data;
  },

  // Get order by ID
  getOrder: async (id: string) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  // Create order
  createOrder: async (data: {
    user_id: string;
    address_id: string;
    items: Array<{
      variant_id: string;
      quantity: number;
      price: number;
    }>;
    total_amount: number;
    shipping_cost: number;
    notes?: string;
  }) => {
    const response = await apiClient.post('/orders', data);
    return response.data;
  },

  // Update order status (admin only)
  updateOrderStatus: async (id: string, data: {
    status: string;
    tracking_number?: string;
  }) => {
    const response = await apiClient.put(`/orders/${id}/status`, data);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id: string) => {
    const response = await apiClient.put(`/orders/${id}/cancel`);
    return response.data;
  },
};