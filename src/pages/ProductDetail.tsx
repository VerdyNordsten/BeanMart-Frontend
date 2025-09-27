import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SEO, generateProductStructuredData, generateBreadcrumbStructuredData } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { productsApi, categoriesApi, roastLevelsApi } from '@/lib/api';
import { formatPrice, getCurrencySymbol } from '@/utils/currency';
import { formatDescription } from '@/utils/textFormatter';
import { Product, ProductVariant, Category, RoastLevel } from '@/types/product';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/lib/cart';
import { 
  ShoppingCart, 
  Star, 
  Package, 
  Weight, 
  Truck, 
  Shield, 
  Heart,
  Minus,
  Plus,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem, openCart } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch categories and roast levels for display
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAllCategories(),
  });

  const { data: roastLevelsResponse } = useQuery({
    queryKey: ['roast-levels'],
    queryFn: () => roastLevelsApi.getAllRoastLevels(),
  });

  const categories = categoriesResponse?.data || [];
  const roastLevels = roastLevelsResponse?.data || [];

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    if (!slug) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsApi.getProductBySlug(slug);
      
      if (response.success && response.data) {
        const productData = response.data;
        
        // Transform API response to match frontend expectations
        const transformedProduct: Product = {
          id: productData.id,
          slug: productData.slug,
          name: productData.name,
          short_description: productData.short_description || '',
          long_description: productData.long_description || '',
          currency: productData.currency || 'USD',
          is_active: productData.is_active !== false,
          created_at: productData.created_at,
          updated_at: productData.updated_at,
          variants: productData.variants?.filter((v: { is_active: boolean }) => v.is_active).map((v: {
            price: string;
            compare_at_price?: string;
            stock: string;
            weight_gram?: string;
            [key: string]: unknown;
          }) => ({
            ...v,
            price: Number(v.price),
            compare_at_price: v.compare_at_price ? Number(v.compare_at_price) : undefined,
            stock: Number(v.stock),
            weight_gram: v.weight_gram ? Number(v.weight_gram) : undefined
          })) || [],
          images: productData.images || [],
          // Calculate price range from variants
          price_min: productData.variants?.length > 0 
            ? Math.min(...productData.variants.map((v: { price: string }) => parseFloat(v.price)))
            : 0,
          price_max: productData.variants?.length > 0 
            ? Math.max(...productData.variants.map((v: { price: string }) => parseFloat(v.price)))
            : 0,
          // Default values for missing fields
          origin: '',
          roast_level: 'medium' as const,
          tasting_notes: [],
          processing_method: '',
          altitude: '',
          producer: '',
          harvest_date: '',
          is_featured: false,
          category_id: '',
          categories: productData.categories || [],
          roastLevels: productData.roastLevels || []
        };
        
        setProduct(transformedProduct);
        
        // Set first variant as selected by default
        if (transformedProduct.variants && transformedProduct.variants.length > 0) {
          setSelectedVariant(transformedProduct.variants[0]);
        }
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Failed to load product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleVariantChange = (variantId: string) => {
    if (product?.variants) {
      const variant = product.variants.find(v => v.id === variantId);
      if (variant) {
        setSelectedVariant(variant);
        setSelectedImageIndex(0); // Reset image index when variant changes
      }
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (selectedVariant?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !product) {
      toast.error('Please select a variant');
      return;
    }
    
    if (quantity > selectedVariant.stock) {
      toast.error('Not enough stock available');
      return;
    }
    
    addItem(product, selectedVariant, quantity);
    toast.success(`Added ${quantity} ${product.name} to cart`);
    openCart();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.short_description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>
          
          {/* Content Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/products')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const images = selectedVariant?.images || product.images || [];
  const hasMultipleVariants = product.variants && product.variants.length > 1;
  const hasPriceRange = product.price_min !== product.price_max;

  // Generate SEO data
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: product.name, url: `/product/${product.slug}` }
  ]);

  const productStructuredData = generateProductStructuredData(product);

  const getProductImage = () => {
    const firstImage = product.images?.[0]?.image_url;
    return firstImage ? `https://beanmart.com${firstImage}` : '/coffee-placeholder.jpg';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO
        title={`${product.name} - Premium Coffee`}
        description={product.short_description || `${product.name} - Premium coffee beans available at Beanmart. ${product.long_description?.substring(0, 150) || ''}`}
        keywords={`${product.name}, coffee beans, ${product.categories?.map(c => c.name).join(', ')}, ${product.roastLevels?.map(r => r.name).join(', ')}, premium coffee`}
        url={`/product/${product.slug}`}
        type="product"
        image={getProductImage()}
        structuredData={[breadcrumbStructuredData, productStructuredData]}
      />
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <button 
          onClick={() => navigate('/products')}
          className="hover:text-gray-900 transition-colors"
        >
          Products
        </button>
        <span>/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            {images.length > 0 ? (
              <img
                src={images[selectedImageIndex]?.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Package className="h-12 w-12" />
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImageIndex === index 
                      ? 'border-blue-500' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
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
                 hasPriceRange ? formatPrice(product.price_min || 0, 'USD') + ' - ' + formatPrice(product.price_max || 0, 'USD') : 
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

          {/* Variants Selection */}
          {hasMultipleVariants && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Select Variant</h3>
              <Select value={selectedVariant?.id || ''} onValueChange={handleVariantChange}>
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
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-16 text-center border-0"
                    min="1"
                    max={selectedVariant?.stock || 1}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= (selectedVariant?.stock || 0)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Product Details */}
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

          {/* Shipping Info */}
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
      </div>
    </div>
  );
}