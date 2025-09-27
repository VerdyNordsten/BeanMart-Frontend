import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPrice } from '@/utils/currency';
import { ShoppingCart, Share2, Heart, Minus, Plus } from 'lucide-react';
import { Product, ProductVariant } from '@/types/product';

interface ProductActionsProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  quantity: number;
  hasMultipleVariants: boolean;
  onVariantChange: (variantId: string) => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onShare: () => void;
}

export function ProductActions({
  product,
  selectedVariant,
  quantity,
  hasMultipleVariants,
  onVariantChange,
  onQuantityChange,
  onAddToCart,
  onShare,
}: ProductActionsProps) {
  return (
    <div className="space-y-6">
      {/* Variants Selection */}
      {hasMultipleVariants && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Select Variant</h3>
          <Select value={selectedVariant?.id || ''} onValueChange={onVariantChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a variant" />
            </SelectTrigger>
            <SelectContent>
              {product.variants?.map((variant) => (
                <SelectItem key={variant.id} value={variant.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>
                      {variant.weight_gram ? `${variant.weight_gram}g` : 'Standard'}
                    </span>
                    <span className="ml-4 font-medium">
                      {formatPrice(variant.price, 'USD')}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Stock Status */}
      {selectedVariant && (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            selectedVariant.stock > 0 ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm text-gray-600">
            {selectedVariant.stock > 0 
              ? `${selectedVariant.stock} in stock` 
              : 'Out of stock'
            }
          </span>
        </div>
      )}

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Quantity:</label>
            <div className="flex items-center gap-2 border rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
                className="w-16 text-center border-0"
                min="1"
                max={selectedVariant?.stock || 1}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onQuantityChange(quantity + 1)}
                disabled={quantity >= (selectedVariant?.stock || 0)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={onAddToCart}
            disabled={!selectedVariant || selectedVariant.stock === 0}
            className="flex-1"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
          <Button variant="outline" size="lg" onClick={onShare}>
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg">
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
