import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { productsApi } from '@/lib/api';
import { Product } from '@/types/product';
import { ArrowLeft, ShoppingCart, Star, Package, Weight, Coffee } from 'lucide-react';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    if (!slug) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsApi.getProductBySlug(slug);
      
      if (response.success && response.data) {
        // Transform API data to match frontend Product interface
        const apiProduct = response.data;
        const transformedProduct: Product = {
          id: apiProduct.id,
          slug: apiProduct.slug,
          name: apiProduct.name,
          short_description: apiProduct.short_description || '',
          long_description: apiProduct.long_description || '',
          price_min: parseFloat(apiProduct.base_price) || 0,
          price_max: parseFloat(apiProduct.base_compare_at_price) || parseFloat(apiProduct.base_price) || 0,
          origin: '',
          roast_level: 'medium' as const,
          tasting_notes: [],
          processing_method: '',
          altitude: '',
          producer: '',
          harvest_date: '',
          is_featured: false,
          is_active: apiProduct.is_active !== false,
          category_id: '',
          created_at: apiProduct.created_at,
          updated_at: apiProduct.updated_at,
          variants: [],
          images: []
        };
        
        setProduct(transformedProduct);
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug, loadProduct]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-screen-2xl py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-32 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-24"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-coffee-dark mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const basePrice = `$${product.price_min.toLocaleString()}`;
  const comparePrice = product.price_max > product.price_min ? `$${product.price_max.toLocaleString()}` : null;

  const roastLevelColors: Record<string, string> = {
    light: 'bg-caramel/20 text-caramel border-caramel/30',
    medium: 'bg-coffee-medium/20 text-coffee-medium border-coffee-medium/30',
    dark: 'bg-coffee-dark/20 text-coffee-dark border-coffee-dark/30',
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-screen-2xl py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-coffee-medium">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-coffee-medium">Products</Link>
          <span>/</span>
          <span className="text-coffee-dark">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden bg-muted rounded-lg">
              {product.images && product.images.length > 0 && product.images[0]?.url ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
                  <span className="text-lg">No Image Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="font-display text-3xl font-bold text-coffee-dark">
                  {product.name}
                </h1>
                {product.is_featured && (
                  <Star className="h-6 w-6 text-caramel fill-caramel" />
                )}
              </div>
              
              <p className="text-muted-foreground text-lg">
                {product.short_description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="font-display text-3xl font-bold text-coffee-dark">
                {basePrice}
              </span>
              {comparePrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {comparePrice}
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="outline" 
                className={`${roastLevelColors[product.roast_level]}`}
              >
                <Coffee className="mr-1 h-3 w-3" />
                {product.roast_level} roast
              </Badge>
              {product.origin && (
                <Badge variant="outline" className="text-muted-foreground">
                  {product.origin}
                </Badge>
              )}
              <Badge variant="outline" className="text-muted-foreground">
                <Package className="mr-1 h-3 w-3" />
                In Stock
              </Badge>
            </div>

            {/* Add to Cart */}
            <div className="flex space-x-4">
              <Button size="lg" variant="coffee" className="flex-1">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline">
                <Star className="mr-2 h-5 w-5" />
                Wishlist
              </Button>
            </div>

            <Separator />

            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="font-display text-xl font-semibold text-coffee-dark">
                Product Details
              </h3>
              
              {product.long_description && (
                <div>
                  <h4 className="font-medium text-coffee-dark mb-2">Description</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.long_description}
                  </p>
                </div>
              )}

              {/* Product Specifications */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Weight className="h-4 w-4 text-coffee-medium" />
                      <div>
                        <p className="text-sm text-muted-foreground">Weight</p>
                        <p className="font-medium">1000g</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-coffee-medium" />
                      <div>
                        <p className="text-sm text-muted-foreground">SKU</p>
                        <p className="font-medium">SKU-001</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold text-coffee-dark mb-8">
            You Might Also Like
          </h2>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Related products will be displayed here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
