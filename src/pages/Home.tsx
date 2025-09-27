import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO, generateBreadcrumbStructuredData } from '@/components/SEO';
import { Button } from '@/components/atoms/button';
import { Badge } from '@/components/atoms/badge';
import { ProductCard } from '@/components/molecules/ProductCard';
import { Card, CardContent } from '@/components/molecules/card';
import { Input } from '@/components/atoms/input';
import { Skeleton } from '@/components/atoms/skeleton';

import { Product } from '@/types/product';
import { ArrowRight, Coffee, Leaf, Award, Mail } from 'lucide-react';
import { useCachedProducts } from '@/hooks/useCachedProducts';
import heroImage from '@/assets/hero-coffee.jpg';
import farmImage from '@/assets/coffee-farm.jpg';
import lightRoastImage from '@/assets/light-roast-coffee.png';
import mediumRoastImage from '@/assets/medium-roast-coffee.png';
import darkRoastImage from '@/assets/dark-roast-coffee.png';

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
    short_description: apiProduct.short_description || '',
    long_description: apiProduct.long_description || '',
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
    category_id: apiProduct.categories?.[0]?.id || '',
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
  const [email, setEmail] = useState('');

  // Use custom caching hook for products
  const { data: bestSellersData, loading: bestSellersLoading } = useCachedProducts(3, 'best-sellers');
  const { data: favoritesData, loading: favoritesLoading } = useCachedProducts(8, 'favorites');

  // Transform the data
  const bestSellers = bestSellersData?.slice(0, 3).map(transformProduct) || [];
  const customerFavorites = favoritesData?.slice(0, 8).map(transformProduct) || [];
  const loading = bestSellersLoading || favoritesLoading;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  const roastFeatures = [
    {
      title: 'Light Roast',
      description: 'Bright, floral, and citrusy notes that highlight the origin characteristics',
      color: 'bg-caramel/10 border-caramel/30',
      textColor: 'text-caramel',
      image: lightRoastImage,
      features: ['Bright acidity', 'Floral notes', 'Citrusy finish'],
      temperature: '356-401°F',
    },
    {
      title: 'Medium Roast',
      description: 'Perfect balance of origin flavors and roasted sweetness',
      color: 'bg-coffee-medium/10 border-coffee-medium/30',
      textColor: 'text-coffee-medium',
      image: mediumRoastImage,
      features: ['Balanced body', 'Sweet caramel', 'Nutty undertones'],
      temperature: '410-428°F',
    },
    {
      title: 'Dark Roast',
      description: 'Rich, bold, and full-bodied with deep chocolate undertones',
      color: 'bg-coffee-dark/10 border-coffee-dark/30',
      textColor: 'text-coffee-dark',
      image: darkRoastImage,
      features: ['Full body', 'Bold flavor', 'Chocolate notes'],
      temperature: '437-446°F',
    },
  ];

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
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Premium coffee beans"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient opacity-90" />
        </div>
        
        <div className="relative z-10 text-center text-cream px-4 max-w-4xl mx-auto">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            From Bean to
            <span className="block text-caramel">Perfect Cup</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-cream/90 max-w-2xl mx-auto">
            Discover exceptional coffee sourced directly from farmers, 
            roasted to perfection, and delivered fresh to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/products">
                Shop Beans
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="coffee-outline" size="xl" asChild>
              <Link to="/story">Our Story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-background">
        <div className="container max-w-screen-2xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-coffee-dark mb-4">
              Best Sellers
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These exceptional coffees have won the hearts of our customers
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <CardContent className="p-3 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button variant="coffee-outline" size="lg" asChild>
              <Link to="/products">
                View All Coffee
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Roast Levels */}
      <section className="py-20 bg-gradient-to-br from-muted/20 to-muted/40">
        <div className="container max-w-screen-2xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl font-bold text-coffee-dark mb-6">
              Roast to Your Taste
            </h2>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
              Every roast level offers a unique flavor profile. Discover which roast 
              matches your perfect cup of coffee.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {roastFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className={`group border-2 ${feature.color} hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden`}
              >
                <div className="relative">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={feature.image}
                      alt={`${feature.title} coffee beans`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <Badge className={`${feature.textColor} bg-white/90 backdrop-blur-sm`}>
                      {feature.temperature}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-8">
                  <h3 className={`font-display text-3xl font-bold mb-4 ${feature.textColor} group-hover:scale-105 transition-transform duration-300`}>
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-coffee-dark text-lg">Key Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {feature.features.map((feat, featIndex) => (
                        <Badge 
                          key={featIndex} 
                          variant="secondary" 
                          className="bg-white/80 text-coffee-dark hover:bg-coffee-medium/20 transition-colors duration-200"
                        >
                          {feat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    variant="coffee-outline" 
                    className="w-full group-hover:bg-coffee-medium group-hover:text-white transition-all duration-300"
                    asChild
                  >
                    <Link to="/products">
                      Explore {feature.title}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Roast Comparison */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <h3 className="font-display text-3xl font-bold text-coffee-dark text-center mb-8">
              Roast Level Comparison
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {roastFeatures.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-lg"
                       style={{ 
                         backgroundColor: feature.title === 'Light Roast' ? '#D4A574' : 
                                        feature.title === 'Medium Roast' ? '#8B4513' : '#2F1B14' 
                       }}>
                    {index + 1}
                  </div>
                  <h4 className={`font-semibold text-lg mb-2 ${feature.textColor}`}>
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {feature.temperature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* From Farm to Cup */}
      <section className="py-16 bg-background">
        <div className="container max-w-screen-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold text-coffee-dark mb-6">
                From Farm to Cup
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                We work directly with coffee farmers around the world, ensuring fair trade practices 
                and sustainable farming methods. Every bean is carefully selected, roasted in small 
                batches, and shipped fresh to preserve the unique flavors of each origin.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Leaf className="h-6 w-6 text-coffee-medium mt-1" />
                  <div>
                    <h3 className="font-semibold text-coffee-dark mb-1">Sustainable Sourcing</h3>
                    <p className="text-muted-foreground">Direct partnerships with farmers committed to environmental stewardship</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Coffee className="h-6 w-6 text-coffee-medium mt-1" />
                  <div>
                    <h3 className="font-semibold text-coffee-dark mb-1">Expert Roasting</h3>
                    <p className="text-muted-foreground">Small-batch roasting to bring out the unique characteristics of each bean</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Award className="h-6 w-6 text-coffee-medium mt-1" />
                  <div>
                    <h3 className="font-semibold text-coffee-dark mb-1">Quality Guaranteed</h3>
                    <p className="text-muted-foreground">Every batch is cupped and approved by our quality control team</p>
                  </div>
                </div>
              </div>

              <Button variant="coffee" size="lg" className="mt-8" asChild>
                <Link to="/story">Learn Our Story</Link>
              </Button>
            </div>
            
            <div className="lg:order-first">
              <img
                src={farmImage}
                alt="Coffee farm in the mountains"
                className="w-full rounded-lg card-shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Customer Favorites */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-screen-2xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-coffee-dark mb-4">
              Customer Favorites
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover what other coffee lovers are enjoying
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <CardContent className="p-3 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {customerFavorites.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-coffee-dark text-cream">
        <div className="container max-w-screen-2xl text-center">
          <Mail className="h-12 w-12 text-caramel mx-auto mb-6" />
          <h2 className="font-display text-3xl font-bold mb-4">
            Stay Connected
          </h2>
          <p className="text-cream/80 text-lg mb-8 max-w-2xl mx-auto">
            Get the latest updates on new arrivals, brewing tips, and exclusive offers 
            delivered straight to your inbox.
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-cream text-coffee-dark border-0"
            />
            <Button type="submit" variant="caramel">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}