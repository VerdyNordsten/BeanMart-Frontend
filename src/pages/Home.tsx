import { SEO } from "@/shared/SEO";
import { generateBreadcrumbStructuredData } from "@/shared/seo-utils";
import { useCachedProducts } from "@/hooks/useCachedProducts";
import { HeroSection } from "@/features/home/HeroSection";
import { BestSellersSection } from "@/features/home/BestSellersSection";
import { RoastFeaturesSection } from "@/features/home/RoastFeaturesSection";
import { FarmToCupSection } from "@/features/home/FarmToCupSection";
import { CustomerFavoritesSection } from "@/features/home/CustomerFavoritesSection";
import { NewsletterSection } from "@/features/home/NewsletterSection";
import { ProductWithRelations } from "@/types";

// No transformation needed - API already returns ProductWithRelations

export default function Home() {
  // Use custom caching hook for products
  const { data: bestSellersData, loading: bestSellersLoading } = useCachedProducts(3, 'best-sellers');
  const { data: favoritesData, loading: favoritesLoading } = useCachedProducts(8, 'favorites');

  // Use data directly - already typed as ProductWithRelations[]
  const bestSellers: ProductWithRelations[] = bestSellersData?.slice(0, 3) || [];
  const customerFavorites: ProductWithRelations[] = favoritesData?.slice(0, 8) || [];
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