import { useState, useEffect, useCallback } from "react";
import { ordersApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/types/product";
import { OrdersHeader } from "@/features/user/orders/OrdersHeader";
import { OrdersList } from "@/features/user/orders/OrdersList";
import { OrderDetailsSheet } from "@/features/user/orders/OrderDetailsSheet";


export default function UserOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const { user, token } = useAuthStore();
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the getUserOrders endpoint for user-specific orders
      const response = await ordersApi.getUserOrders();
      
      if (response.success) {
        // The backend returns data directly as an array for user orders
        setOrders(response.data || []);
      } else {
        throw new Error(response.message || "Failed to fetch orders");
      }
    } catch (err: unknown) {
      console.error("Failed to fetch orders:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load orders. Please try again later.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleViewOrder = async (orderId: string) => {
    try {
      const response = await ordersApi.getOrder(orderId);
      // The backend returns { success: true, data: orderObject }
      if (response.success) {
        setSelectedOrder(response.data);
        setShowOrderDetail(true);
      } else {
        throw new Error(response.message || "Failed to load order details");
      }
    } catch (error) {
      console.error('Failed to load order details:', error);
      toast({
        title: "Error",
        description: "Failed to load order details. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchOrders();
    }
  }, [user, token, fetchOrders]);

  return (
    <div className="space-y-6">
      <OrdersHeader />
      
      <OrdersList
        orders={orders}
        loading={loading}
        error={error}
        onViewDetails={handleViewOrder}
        onRetry={fetchOrders}
      />

      <OrderDetailsSheet
        isOpen={showOrderDetail}
        onOpenChange={setShowOrderDetail}
        order={selectedOrder}
      />
    </div>
  );
}