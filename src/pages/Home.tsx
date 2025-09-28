import { SEO } from "@/shared/SEO";
import { generateBreadcrumbStructuredData } from "@/shared/seo-utils";
import { useCachedProducts } from "@/hooks/useCachedProducts";
import { HeroSection } from "@/features/home/HeroSection";
import { BestSellersSection } from "@/features/home/BestSellersSection";
import { RoastFeaturesSection } from "@/features/home/RoastFeaturesSection";
import { FarmToCupSection } from "@/features/home/FarmToCupSection";
import { CustomerFavoritesSection } from "@/features/home/CustomerFavoritesSection";
import { NewsletterSection } from "@/features/home/NewsletterSection";
import { Product } from "@/types/product";

// Transform API data to match frontend Product interface
interface ApiProduct {
  id: string;
  slug: string;
  name: string;
  short_description?: string;
  long_description?: string;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  variants?: Array<{
    id: string;
    product_id: string;
    price: number;
    compare_at_price?: number;
    stock: number;
    weight_gram?: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    images?: Array<{
      id: string;
      url: string;
      position: number;
      variant_id: string;
    }>;
  }>;
  categories?: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
  roastLevels?: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
  images?: Array<{
    id: string;
    url: string;
    position: number;
    variant_id: string;
  }>;
}

const transformProduct = (apiProduct: ApiProduct): Product => {
  // Calculate price range from variants
  const activeVariants = apiProduct.variants?.filter(v => v.is_active) || [];
  const prices = activeVariants.map(v => v.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  
  // Get primary image from variants or product images
  const primaryImage = activeVariants[0]?.images?.[0] || apiProduct.images?.[0];
  
  return {
    id: apiProduct.id,
    slug: apiProduct.slug,
    name: apiProduct.name,
    short_description: apiProduct.short_description || "",
    long_description: apiProduct.long_description || "",
    currency: apiProduct.currency,
    price_min: minPrice,
    price_max: maxPrice,
    origin: '',
    roast_level: 'medium' as const,
    tasting_notes: [],
    processing_method: '',
    altitude: '',
    producer: '',
    harvest_date: '',
    is_featured: false,
    is_active: apiProduct.is_active,
    category_id: apiProduct.categories?.[0]?.id || "",
    created_at: apiProduct.created_at,
    updated_at: apiProduct.updated_at,
    variants: activeVariants.map(variant => ({
      id: variant.id,
      product_id: variant.product_id,
      price: variant.price,
      compare_at_price: variant.compare_at_price,
      stock: variant.stock,
      weight_gram: variant.weight_gram,
      is_active: variant.is_active,
      created_at: variant.created_at,
      updated_at: variant.updated_at,
      images: variant.images?.map(img => ({
        id: img.id,
        variant_id: img.variant_id,
        url: img.url,
        position: img.position,
        created_at: '',
        updated_at: ''
      })) || []
    })),
    categories: apiProduct.categories || [],
    roastLevels: apiProduct.roastLevels || [],
    images: primaryImage ? [{
      id: primaryImage.id,
      variant_id: primaryImage.variant_id,
      url: primaryImage.url,
      position: primaryImage.position,
      created_at: '',
      updated_at: ''
    }] : []
  };
};

export default function Home() {
  // Use custom caching hook for products
  const { data: bestSellersData, loading: bestSellersLoading } = useCachedProducts(3, 'best-sellers');
  const { data: favoritesData, loading: favoritesLoading } = useCachedProducts(8, 'favorites');

  // Transform the data
  const bestSellers = bestSellersData?.slice(0, 3).map(transformProduct) || [];
  const customerFavorites = favoritesData?.slice(0, 8).map(transformProduct) || [];
  const loading = bestSellersLoading || favoritesLoading;

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' }
  ]);

  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Beanmart",
    "url": "https://beanmart.com",
    "logo": "https://beanmart.com/logo.png",
    "description": "Premium coffee beans and brewing equipment from around the world",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-COFFEE",
      "contactType": "Customer Service"
    },
    "sameAs": [
      "https://facebook.com/beanmart",
      "https://instagram.com/beanmart", 
      "https://twitter.com/beanmart"
    ]
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Beanmart - Premium Coffee Beans & Brewing Equipment"
        description="Discover premium coffee beans from around the world. From light to dark roast, single origin to blends. Shop the finest coffee beans and brewing equipment at Beanmart."
        keywords="coffee beans, premium coffee, single origin, coffee roasting, brewing equipment, coffee shop, specialty coffee, arabica, robusta"
        url="/"
        type="website"
        structuredData={[breadcrumbStructuredData, organizationStructuredData]}
      />
      
      <HeroSection />
      <BestSellersSection products={bestSellers} loading={loading} />
      <RoastFeaturesSection />
      <FarmToCupSection />
      <CustomerFavoritesSection products={customerFavorites} loading={loading} />
      <NewsletterSection />
    </div>
  );
}