import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types/product';
import { ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
  // Use the first image or a placeholder
  const primaryImage = product.images && product.images.length > 0 
    ? product.images[0].url 
    : '/api/placeholder/300/300';
  
  // Format price - handle both price_min/price_max and base_price
  const priceRange = product.price_min === product.price_max 
    ? `Rp${product.price_min.toLocaleString()}`
    : `Rp${product.price_min.toLocaleString()} - Rp${product.price_max.toLocaleString()}`;

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
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={primaryImage}
            alt={product.name}
            className="h-full w-full object-cover smooth-transition group-hover:scale-105"
          />
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
          <div>
            <span className="font-semibold text-coffee-dark text-lg">
              {priceRange}
            </span>
            {product.variants && product.variants.length > 1 && (
              <span className="text-xs text-muted-foreground ml-1">
                from
              </span>
            )}
          </div>
          
          {showAddToCart && (
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