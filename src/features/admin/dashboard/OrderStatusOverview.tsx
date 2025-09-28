import { Badge } from "@/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Clock, CheckCircle, Truck, XCircle } from "lucide-react";

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-500' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'bg-blue-500' },
  shipped: { label: 'Shipped', icon: Truck, color: 'bg-purple-500' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'bg-green-500' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'bg-red-500' },
};

interface KPIData {
  totalOrders: number;
  pending: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

interface OrderStatusOverviewProps {
  kpis: KPIData | null;
}

export function OrderStatusOverview({ kpis }: OrderStatusOverviewProps) {
  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="font-display text-xl text-coffee-dark">
          Order Status Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon;
            const count = kpis?.[status as keyof KPIData] || 0;
            const percentage = kpis?.totalOrders 
              ? Math.round((count / kpis.totalOrders) * 100) 
              : 0;
            
            return (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${config.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-coffee-dark">
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{count}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
