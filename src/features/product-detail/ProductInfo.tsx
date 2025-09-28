import { Badge } from "@/ui/badge";
import { formatPrice } from "@/utils/currency";
import { formatDescription } from "@/utils/textFormatter";
import { Star } from "lucide-react";
import { ProductWithRelations, ProductVariant } from "@/types";

interface ProductInfoProps {
  product: ProductWithRelations;
  selectedVariant: ProductVariant | null;
  hasPriceRange: boolean;
}

export function ProductInfo({ product, selectedVariant, hasPriceRange }: ProductInfoProps) {
  return (
    <div className="space-y-6">
      {/* Title and Rating */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-gray-600">4.8 (24 reviews)</span>
          </div>
          {/* Display actual roast levels from database */}
          {product.roastLevels && product.roastLevels.length > 0 && (
            <div className="flex gap-2">
              {product.roastLevels.map((roastLevel: { roast_level_id: string; roast_level_name: string }) => (
                <Badge key={roastLevel.roast_level_id} variant="outline" className="text-xs">
                  {roastLevel.roast_level_name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-green-600">
            {selectedVariant ? formatPrice(selectedVariant.price, 'USD') : 
             hasPriceRange ? `${formatPrice(product.price_min || 0, 'USD')  } - ${  formatPrice(product.price_max || 0, 'USD')}` : 
             formatPrice(product.price_min || 0, 'USD')}
          </span>
        </div>
        {hasPriceRange && !selectedVariant && (
          <p className="text-sm text-gray-600">
            Starting from {formatPrice(product.price_min || 0, 'USD')}
          </p>
        )}
        {selectedVariant?.compare_at_price && 
         selectedVariant.compare_at_price > selectedVariant.price && (
          <p className="text-sm text-gray-500 line-through">
            {formatPrice(selectedVariant.compare_at_price, 'USD')}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
        <div className="text-gray-600 leading-relaxed">
          {product.long_description ? (
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: formatDescription(product.long_description)
              }} 
            />
          ) : product.short_description ? (
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: formatDescription(product.short_description)
              }} 
            />
          ) : (
            <p className="text-gray-500 italic">No description available.</p>
          )}
        </div>
      </div>

      {/* Categories and Roast Levels */}
      {(product.categories && product.categories.length > 0) || (product.roastLevels && product.roastLevels.length > 0) ? (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Product Details</h3>
          <div className="space-y-3">
            {product.categories && product.categories.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-600">Categories:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.categories.map((category: { category_id: string; category_name: string }) => (
                    <Badge key={category.category_id} variant="secondary" className="text-xs">
                      {category.category_name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {product.roastLevels && product.roastLevels.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-600">Roast Levels:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.roastLevels.map((roastLevel: { roast_level_id: string; roast_level_name: string }) => (
                    <Badge key={roastLevel.roast_level_id} variant="outline" className="text-xs">
                      {roastLevel.roast_level_name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
