import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Package, ShoppingCart, CheckCircle } from "lucide-react";

export function QuickActions() {
  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="font-display text-xl text-coffee-dark">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <a
            href="/admin/products"
            className="flex items-center p-3 rounded-lg border hover:bg-muted smooth-transition"
          >
            <Package className="h-5 w-5 text-coffee-medium mr-3" />
            <span className="font-medium">Manage Products</span>
          </a>
          
          <a
            href="/admin/orders"
            className="flex items-center p-3 rounded-lg border hover:bg-muted smooth-transition"
          >
            <ShoppingCart className="h-5 w-5 text-coffee-medium mr-3" />
            <span className="font-medium">View Orders</span>
          </a>
          
          <a
            href="/admin/users"
            className="flex items-center p-3 rounded-lg border hover:bg-muted smooth-transition"
          >
            <CheckCircle className="h-5 w-5 text-coffee-medium mr-3" />
            <span className="font-medium">Manage Users</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
