import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types/product';
import { ShoppingCart, Star, Package } from 'lucide-react';
import { formatPrice, formatPriceRange, getCurrencySymbol } from '@/utils/currency';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
  // Get active variants
  const activeVariants = product.variants?.filter(variant => variant.is_active) || [];
  
  // Get the first image from the first variant or product images
  const primaryImage = activeVariants[0]?.images?.[0]?.url || 
                      (product.images && product.images.length > 0 ? product.images[0].url : '');
  
  // Calculate price range from variants
  const minPrice = activeVariants.length > 0 ? Math.min(...activeVariants.map(v => parseFloat(v.price))) : product.price_min;
  const maxPrice = activeVariants.length > 0 ? Math.max(...activeVariants.map(v => parseFloat(v.price))) : product.price_max;
  const hasPriceRange = minPrice !== maxPrice;
  
  // Format price display using currency utility
  const priceDisplay = hasPriceRange ? 
    formatPriceRange(minPrice, maxPrice, product.currency) : 
    formatPrice(minPrice, product.currency);
  
  // Get total stock
  const totalStock = activeVariants.reduce((sum, variant) => sum + variant.stock, 0);

  // Default roast level if not provided
  const roastLevel = product.roast_level || 'medium';
  
  const roastLevelColors: Record<string, string> = {
    light: 'bg-caramel/20 text-caramel border-caramel/30',
    medium: 'bg-coffee-medium/20 text-coffee-medium border-coffee-medium/30',
    dark: 'bg-coffee-dark/20 text-coffee-dark border-coffee-dark/30',
  };

  return (
    <Card className="group overflow-hidden card-shadow hover:warm-shadow smooth-transition hover:-translate-y-1">
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
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-display font-semibold text-lg text-coffee-dark hover:text-coffee-medium smooth-transition">
              {product.name}
            </h3>
          </Link>
          {product.is_featured && (
            <Star className="h-4 w-4 text-caramel fill-caramel" />
          )}
        </div>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {product.short_description}
        </p>

        {/* Price Display */}
        <div className="mb-3">
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

        {/* Variants Info */}
        {activeVariants.length > 0 && (
          <div className="mb-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>{activeVariants.length} variant{activeVariants.length !== 1 ? 's' : ''}</span>
            </div>
            
            {totalStock > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{totalStock} in stock</span>
              </div>
            )}
          </div>
        )}

        {/* Variants Preview */}
        {activeVariants.length > 0 && activeVariants.length <= 3 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-coffee-dark mb-2">Available Variants:</p>
            <div className="space-y-1">
              {activeVariants.map((variant) => (
                <div key={variant.id} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {variant.weight_gram ? `${variant.weight_gram}g` : 'Standard'}
                  </span>
                  <span className="font-medium">{formatPrice(variant.price, product.currency)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Roast Level and Origin */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge 
            variant="outline" 
            className={`text-xs ${roastLevelColors[roastLevel]}`}
          >
            {roastLevel} roast
          </Badge>
          {product.origin && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {product.origin.split(',')[0]}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Button asChild variant="outline" size="sm">
            <Link to={`/product/${product.slug}`}>
              View Details
            </Link>
          </Button>
          
          {showAddToCart && product.is_active && totalStock > 0 && (
            <Button size="sm" variant="coffee" className="h-8">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}