import { Link } from "react-router-dom";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { ProductWithRelations } from "@/types";
import { Star, Package } from "lucide-react";
import { formatPrice, formatPriceRange } from "@/utils/currency";

interface ProductCardProps {
  product: ProductWithRelations;
}

export function ProductCard({ product }: ProductCardProps) {
  
  // Get active variants
  const activeVariants = product.variants?.filter(variant => variant.is_active).map(v => ({
    ...v,
    price: Number(v.price),
    compare_at_price: v.compare_at_price ? Number(v.compare_at_price) : undefined,
    stock: Number(v.stock),
    weight_gram: v.weight_gram ? Number(v.weight_gram) : undefined
  })) || [];
  
  // Get the first image from the first variant
  const primaryImage = activeVariants[0]?.images?.[0]?.url || '';
  
  // Calculate price range from variants
  const minPrice = activeVariants.length > 0 ? Math.min(...activeVariants.map(v => v.price)) : product.price_min;
  const maxPrice = activeVariants.length > 0 ? Math.max(...activeVariants.map(v => v.price)) : product.price_max;
  const hasPriceRange = minPrice !== maxPrice;
  
  // Format price display using currency utility
  const priceDisplay = hasPriceRange ? 
    formatPriceRange(minPrice, maxPrice, product.currency) : 
    formatPrice(minPrice, product.currency);
  
  // Get total stock
  const totalStock = activeVariants.reduce((sum, variant) => sum + variant.stock, 0);

  // Get roast levels from database
  const roastLevels = product.roastLevels || [];

  return (
    <Card className="group overflow-hidden card-shadow hover:warm-shadow smooth-transition hover:-translate-y-1 h-full flex flex-col">
      <Link to={`/product/${product.slug}`}>
        <div className="aspect-square overflow-hidden bg-muted relative">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.name}
              className="h-full w-full object-cover smooth-transition group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
              <span className="text-sm">No Image</span>
            </div>
          )}
          
          {/* Status badges */}
          {!product.is_active && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Out of Stock
            </Badge>
          )}
          {activeVariants.length > 1 && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              {activeVariants.length} Variants
            </Badge>
          )}
        </div>
      </Link>
      
      <CardContent className="p-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <Link to={`/product/${product.slug}`} className="flex-1">
            <h3 className="font-display font-semibold text-base text-coffee-dark hover:text-coffee-medium smooth-transition line-clamp-1" title={product.name}>
              {product.name.length > 30 ? `${product.name.substring(0, 30)}...` : product.name}
            </h3>
          </Link>
          {product.is_featured && (
            <Star className="h-4 w-4 text-caramel fill-caramel flex-shrink-0 ml-2" />
          )}
        </div>

        {/* Price Display */}
        <div className="mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-coffee-dark text-lg">
              {priceDisplay}
            </span>
          </div>
          {hasPriceRange && (
            <p className="text-xs text-muted-foreground">
              Starting from {formatPrice(minPrice, product.currency)}
            </p>
          )}
        </div>

        {/* Weight Range and Stock Info - in one line */}
        {activeVariants.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              {(() => {
                // Get weight range from variants
                const weightsInGrams = activeVariants
                  .map(v => v.weight_gram)
                  .filter(w => w && w > 0)
                  .sort((a, b) => a - b);
                
                if (weightsInGrams.length > 0) {
                  const minWeight = weightsInGrams[0];
                  const maxWeight = weightsInGrams[weightsInGrams.length - 1];
                  
                  // Format weight display
                  const formatWeight = (grams: number) => {
                    if (grams >= 1000) {
                      return `${(grams / 1000).toFixed(grams % 1000 === 0 ? 0 : 1)}kg`;
                    }
                    return `${grams}g`;
                  };
                  
                  const weightDisplay = minWeight === maxWeight 
                    ? formatWeight(minWeight)
                    : `${formatWeight(minWeight)} - ${formatWeight(maxWeight)}`;
                  
                  return (
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span>{weightDisplay}</span>
                    </div>
                  );
                }
                return null;
              })()}
              
              {totalStock > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{totalStock} in stock</span>
                </div>
              )}
            </div>
          </div>
        )}


        {/* Roast Levels - limit to 2 badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {roastLevels.slice(0, 2).map((roastLevel) => (
            <Badge 
              key={roastLevel.id || roastLevel.roast_level_id}
              variant="outline" 
              className="text-xs bg-orange-100 text-orange-800 border-orange-200"
            >
              {roastLevel.name || roastLevel.roast_level_name}
            </Badge>
          ))}
          {roastLevels.length > 2 && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              +{roastLevels.length - 2} more
            </Badge>
          )}
        </div>

        <div className="mt-auto">
          <Button asChild variant="coffee" size="sm" className="w-full">
            <Link to={`/product/${product.slug}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}