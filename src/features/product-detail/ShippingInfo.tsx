import { Separator } from "@/ui/separator";
import { Truck, Shield } from "lucide-react";

export function ShippingInfo() {
  return (
    <div className="space-y-4">
      <Separator />
      
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Shipping & Returns</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-sm">Free Shipping</p>
              <p className="text-xs text-gray-600">On orders over $50</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-sm">30-Day Returns</p>
              <p className="text-xs text-gray-600">Hassle-free returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
