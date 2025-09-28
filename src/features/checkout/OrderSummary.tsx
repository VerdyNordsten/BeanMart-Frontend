import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Separator } from "@/ui/separator";
import { formatPrice } from "@/utils/currency";
import { ShoppingCart, Package, Shield, Truck } from "lucide-react";

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    images?: Array<{ url: string }>;
  };
  variant: {
    weight_gram?: number;
  };
  quantity: number;
  price: number;
}

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  loading: boolean;
  onSubmit: () => void;
}

export function OrderSummary({ items, subtotal, shipping, total, loading, onSubmit }: OrderSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                {item.product.images && item.product.images.length > 0 ? (
                  <img
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    <Package className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-2">
                  {item.product.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {item.variant.weight_gram}g
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </span>
                  <span className="text-sm font-medium">
                    {formatPrice(item.price * item.quantity, 'USD')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Order Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal, 'USD')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{formatPrice(shipping, 'USD')}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{formatPrice(total, 'USD')}</span>
          </div>
        </div>

        {/* Place Order Button */}
        <Button 
          className="w-full" 
          size="lg"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </Button>

        {/* Security Badges */}
        <div className="flex items-center justify-center gap-4 pt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-1">
            <Truck className="h-3 w-3" />
            <span>Fast Delivery</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
