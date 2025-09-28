import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SEO } from "@/shared/SEO";
import { generateProductStructuredData, generateBreadcrumbStructuredData } from "@/shared/seo-utils";
import { Button } from "@/ui/button";
import { Skeleton } from "@/ui/skeleton";
import { productsApi } from "@/lib/api";
import { ProductWithRelations, ProductVariant } from "@/types";
import { useCartStore } from "@/lib/cart";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { logger } from "@/utils/logger";
import { ProductBreadcrumb } from "@/features/product-detail/ProductBreadcrumb";
import { ProductImages } from "@/features/product-detail/ProductImages";
import { ProductInfo } from "@/features/product-detail/ProductInfo";
import { ProductActions } from "@/features/product-detail/ProductActions";
import { ProductDetails } from "@/features/product-detail/ProductDetails";
import { ShippingInfo } from "@/features/product-detail/ShippingInfo";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem, openCart } = useCartStore();
  const [product, setProduct] = useState<ProductWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch categories and roast levels for display
  // const { data: categoriesResponse } = useQuery({
  //   queryKey: ['categories'],
  //   queryFn: () => categoriesApi.getAllCategories(),
  // });

  // const { data: roastLevelsResponse } = useQuery({
  //   queryKey: ['roast-levels'],
  //   queryFn: () => roastLevelsApi.getAllRoastLevels(),
  // });

  // const categories: Category[] = categoriesResponse?.data || [];
  // const roastLevels: RoastLevel[] = roastLevelsResponse?.data || [];

  const loadProduct = useCallback(async () => {
    if (!slug) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsApi.getProductBySlug(slug);
      
      if (response.success && response.data) {
        const productData: ProductWithRelations = response.data;
        
        setProduct(productData);
        
        // Set first active variant as selected by default
        const activeVariants = productData.variants?.filter(v => v.is_active) || [];
        if (activeVariants.length > 0) {
          setSelectedVariant(activeVariants[0]);
        }
      } else {
        setError('Product not found');
      }
    } catch (err) {
      logger.error('Failed to load product', { error: err });
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

  const handleVariantChange = (variantId: string) => {
    if (product?.variants) {
      const variant = product.variants.find(v => v.id === variantId);
      if (variant) {
        setSelectedVariant(variant);
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
          <p className="text-gray-600 mb-6">{error || "The product you are looking for does not exist."}</p>
          <Button onClick={() => navigate('/products')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const images = selectedVariant?.images || [];
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
    const firstImage = selectedVariant?.images?.[0]?.url || product.variants?.[0]?.images?.[0]?.url;
    return firstImage ? `https://beanmart.com${firstImage}` : '/coffee-placeholder.jpg';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO
        title={`${product.name} - Premium Coffee`}
        description={product.short_description || `${product.name} - Premium coffee beans available at Beanmart. ${product.long_description?.substring(0, 150) || ""}`}
        keywords={`${product.name}, coffee beans, ${product.categories?.map(c => c.name).join(', ')}, ${product.roast_levels?.map(r => r.name).join(', ')}, premium coffee`}
        url={`/product/${product.slug}`}
        type="product"
        image={getProductImage()}
        structuredData={[breadcrumbStructuredData, productStructuredData]}
      />
      
      <ProductBreadcrumb productName={product.name} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <ProductImages images={images} productName={product.name} />

        {/* Product Info */}
        <div className="space-y-6">
          <ProductInfo 
            product={product} 
            selectedVariant={selectedVariant} 
            hasPriceRange={hasPriceRange} 
          />
          
          <ProductActions
            product={product}
            selectedVariant={selectedVariant}
            quantity={quantity}
            hasMultipleVariants={hasMultipleVariants}
            onVariantChange={handleVariantChange}
            onQuantityChange={handleQuantityChange}
            onAddToCart={handleAddToCart}
            onShare={handleShare}
          />

          <ProductDetails product={product} selectedVariant={selectedVariant} />
          <ShippingInfo />
        </div>
      </div>
    </div>
  );
}