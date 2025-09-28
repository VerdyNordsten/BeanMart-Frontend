import { Separator } from "@/ui/separator";
import { Weight, Package } from "lucide-react";
import { Product, ProductVariant } from "@/types/product";

interface ProductDetailsProps {
  product: Product;
  selectedVariant: ProductVariant | null;
}

export function ProductDetails({ product, selectedVariant }: ProductDetailsProps) {
  return (
    <div className="space-y-4">
      <Separator />
      
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Product Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Weight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Weight:</span>
            <span className="font-medium">
              {selectedVariant?.weight_gram ? `${selectedVariant.weight_gram}g` : 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Variants:</span>
            <span className="font-medium">{product.variants?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
