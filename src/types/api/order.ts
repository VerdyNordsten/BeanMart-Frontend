// API types for Order endpoints
import type { 
  Order, 
  OrderWithItems, 
  OrderWithItemsAndProducts, 
  OrderStatus 
} from "../domain/order";
import type { ApiResponse, PaginatedResponse, SearchParams } from "./common";

// ===== ORDER API RESPONSES =====
export type GetOrdersResponse = PaginatedResponse<OrderWithItemsAndProducts>;
export type GetOrderResponse = ApiResponse<OrderWithItemsAndProducts>;
export type CreateOrderResponse = ApiResponse<OrderWithItems>;
export type UpdateOrderResponse = ApiResponse<Order>;
export type DeleteOrderResponse = ApiResponse<{ id: string }>;

// ===== ORDER REQUEST TYPES =====
export interface GetOrdersParams extends SearchParams {
  status?: OrderStatus;
  user_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface CreateOrderItemRequest {
  productVariantId: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

export interface CreateOrderRequest {
  items: CreateOrderItemRequest[];
  shippingAddress?: Record<string, unknown>;
  billingAddress?: Record<string, unknown>;
  notes?: string;
  shippingCost?: number;
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  shippingAddress?: Record<string, unknown>;
  billingAddress?: Record<string, unknown>;
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}
