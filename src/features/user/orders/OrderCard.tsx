import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { format } from "date-fns";
import { Package, Truck, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { Order } from "@/types";

const statusConfig: Record<string, { label: string; icon: React.ComponentType; className: string }> = {
  pending: { label: "Pending", icon: Clock, className: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmed", icon: CheckCircle, className: "bg-blue-100 text-blue-800" },
  shipped: { label: "Shipped", icon: Truck, className: "bg-purple-100 text-purple-800" },
  delivered: { label: "Delivered", icon: Package, className: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-red-100 text-red-800" },
};

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">
              Order #{order.order_number}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {format(new Date(order.created_at), "PPP")}
            </CardDescription>
          </div>
          <Badge variant="secondary" className={status.className}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="font-semibold">
              {order.currency} {typeof order.total_amount === 'string' 
                ? parseFloat(order.total_amount).toLocaleString() 
                : order.total_amount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Items</span>
            <span className="text-sm">{order.items?.length || 0} items</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-3"
            onClick={() => onViewDetails(order)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
