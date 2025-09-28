// Orders API with proper typing and mappers
import { apiClient } from "../api-client";
import type {
  GetOrdersResponse,
  GetOrderResponse,
  CreateOrderResponse,
  UpdateOrderResponse,
  // DeleteOrderResponse,
  GetOrdersParams,
  CreateOrderRequest,
  UpdateOrderRequest,
  UpdateOrderStatusRequest,
} from "@/types/api/order";

// ===== ORDERS API =====
export const ordersApi = {
  // Get all orders (admin only)
  getAllOrders: async (params?: GetOrdersParams): Promise<GetOrdersResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.user_id) queryParams.append('user_id', params.user_id);
    if (params?.date_from) queryParams.append('date_from', params.date_from);
    if (params?.date_to) queryParams.append('date_to', params.date_to);
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);
    
    const response = await apiClient.get(`/orders?${queryParams.toString()}`);
    return response.data;
  },

  // Get user orders
  getUserOrders: async (): Promise<GetOrdersResponse> => {
    const response = await apiClient.get('/orders/my');
    return response.data;
  },

  // Get order by ID
  getOrder: async (id: string): Promise<GetOrderResponse> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  // Create order
  createOrder: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const response = await apiClient.post('/orders', data);
    return response.data;
  },

  // Update order (admin only)
  updateOrder: async (id: string, data: UpdateOrderRequest): Promise<UpdateOrderResponse> => {
    const response = await apiClient.put(`/orders/${id}`, data);
    return response.data;
  },

  // Update order status (admin only)
  updateOrderStatus: async (id: string, data: UpdateOrderStatusRequest): Promise<UpdateOrderResponse> => {
    const response = await apiClient.put(`/orders/${id}/status`, data);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id: string): Promise<UpdateOrderResponse> => {
    const response = await apiClient.put(`/orders/${id}/cancel`);
    return response.data;
  },
};
