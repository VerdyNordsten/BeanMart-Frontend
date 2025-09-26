import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ordersApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Package, Truck, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { Order, OrderItem } from "@/types/product";

const statusConfig: Record<string, { label: string; icon: React.ComponentType; className: string }> = {
  pending: { label: "Pending", icon: Clock, className: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmed", icon: CheckCircle, className: "bg-blue-100 text-blue-800" },
  shipped: { label: "Shipped", icon: Truck, className: "bg-purple-100 text-purple-800" },
  delivered: { label: "Delivered", icon: Package, className: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-red-100 text-red-800" },
};

export default function UserOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<{
    id: string;
    order_number: string;
    status: string;
    total_amount: string | number;
    created_at: string;
    currency: string;
    shipping_address: { 
      fullName: string; 
      address: string; 
      city: string; 
      state: string; 
      postalCode: string; 
      phone: string; 
    };
    billing_address: { 
      fullName: string; 
      address: string; 
      city: string; 
      state: string; 
      postalCode: string; 
      phone: string; 
    };
    items: Array<{ 
      product_name: string; 
      quantity: number; 
      price_per_unit: string; 
      total_price: string;
      product_image?: string;
    }>;
  } | null>(null);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">
            View and manage your orders
          </p>
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-48 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">
            View and manage your orders
          </p>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">
          View and manage your orders
        </p>
      </div>
      
      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 font-medium">No orders yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You haven't placed any orders yet.
            </p>
            <Button className="mt-4" asChild>
              <a href="/catalog">Start shopping</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            
            return (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-lg">Order {order.order_number}</CardTitle>
                    <CardDescription>
                      Placed on {format(new Date(order.created_at), "MMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <Badge className={status.className}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {status.label}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: order.currency || "USD",
                        }).format(order.total_amount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.items?.length || 0} items
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewOrder(order.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Order Detail Sheet */}
      <Sheet open={showOrderDetail} onOpenChange={setShowOrderDetail}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Order Details</SheetTitle>
          </SheetHeader>
          
          {selectedOrder && (
            <div className="mt-6 space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Order Number</div>
                      <div className="font-mono">{selectedOrder.order_number}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Date</div>
                      <div>{format(new Date(selectedOrder.created_at), "MMM d, yyyy")}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Status</div>
                      <Badge className={statusConfig[selectedOrder.status]?.className}>
                        {statusConfig[selectedOrder.status]?.label}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total</div>
                      <div className="font-semibold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: selectedOrder.currency || "USD",
                        }).format(parseFloat(String(selectedOrder.total_amount || 0)))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              {selectedOrder.shipping_address && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      <div className="font-medium">{selectedOrder.shipping_address.fullName}</div>
                      <div>{selectedOrder.shipping_address.address}</div>
                      <div>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postalCode}</div>
                      <div>{selectedOrder.shipping_address.phone}</div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Order Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index: number) => (
                        <div key={index} className="flex gap-4 border-b pb-4 last:border-b-0">
                          {item.product_image && (
                            <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                              <img 
                                src={item.product_image} 
                                alt={item.product_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.product_name}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Qty: {item.quantity} × {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: selectedOrder.currency || "USD",
                              }).format(parseFloat(item.price_per_unit))}
                            </div>
                          </div>
                          <div className="font-medium text-sm">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: selectedOrder.currency || "USD",
                            }).format(parseFloat(item.total_price))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}