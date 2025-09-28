import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";
import { Badge } from "@/ui/badge";
import { Separator } from "@/ui/separator";
import { format } from "date-fns";
import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { Order } from "@/types";

const statusConfig: Record<string, { label: string; icon: React.ComponentType; className: string }> = {
  pending: { label: "Pending", icon: Clock, className: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmed", icon: CheckCircle, className: "bg-blue-100 text-blue-800" },
  shipped: { label: "Shipped", icon: Truck, className: "bg-purple-100 text-purple-800" },
  delivered: { label: "Delivered", icon: Package, className: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-red-100 text-red-800" },
};

interface OrderDetailsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}

export function OrderDetailsSheet({ isOpen, onOpenChange, order }: OrderDetailsSheetProps) {
  if (!order) return null;

  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Order Details</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Order Info */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Order Number</span>
              <span className="text-sm text-muted-foreground">#{order.order_number}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Status</span>
              <Badge variant="secondary" className={status.className}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {status.label}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Order Date</span>
              <span className="text-sm text-muted-foreground">
                {format(new Date(order.created_at), "PPP")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount</span>
              <span className="font-semibold text-lg">
                {order.currency} {typeof order.total_amount === 'string' 
                  ? parseFloat(order.total_amount).toLocaleString() 
                  : order.total_amount.toLocaleString()}
              </span>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div className="space-y-3">
            <h3 className="font-semibold">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.variant_name && `${item.variant_name} • `}
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium text-sm">
                    {order.currency} {(parseFloat(item.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="space-y-3">
              <h3 className="font-semibold">Shipping Address</h3>
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <p className="font-medium">{order.shipping_address.fullName}</p>
                <p>{order.shipping_address.address}</p>
                <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}</p>
                <p className="text-muted-foreground">{order.shipping_address.phone}</p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
