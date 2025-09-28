// Domain types for Order entities - mirrors database schema exactly
import type { UUID, ISODate, CurrencyCode } from "./product";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: UUID;
  user_id: UUID;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  shipping_cost: number;
  currency: CurrencyCode;
  shipping_address?: Record<string, unknown>; // JSONB
  billing_address?: Record<string, unknown>; // JSONB
  notes?: string | null;
  created_at: ISODate;
  updated_at: ISODate;
}

export interface OrderItem {
  id: UUID;
  order_id: UUID;
  product_variant_id: UUID;
  quantity: number;
  price_per_unit: number;
  total_price: number;
  created_at: ISODate;
  // Note: order_items table doesn't have updated_at in DB
}

// ===== RELATION TYPES =====
export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface OrderItemWithProduct extends OrderItem {
  product_variant: {
    id: UUID;
    product_id: UUID;
    price: number;
    weight_gram?: number | null;
    product: {
      id: UUID;
      name: string;
      slug: string;
      images?: Array<{
        id: UUID;
        url: string;
        position: number;
      }>;
    };
  };
}

export interface OrderWithItemsAndProducts extends Order {
  items: OrderItemWithProduct[];
}
