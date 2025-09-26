import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ui/ProductCard';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { productsApi as api } from '@/lib/api';
import { Product } from '@/types/product';
import { ArrowRight, Coffee, Leaf, Award, Mail } from 'lucide-react';
import heroImage from '@/assets/hero-coffee.jpg';
import farmImage from '@/assets/coffee-farm.jpg';
import roastImage from '@/assets/roast-levels.jpg';

export default function Home() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [customerFavorites, setCustomerFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bestSellersData, favoritesData] = await Promise.all([
          api.getProducts({ limit: 3 }), // Get featured products as best sellers
          api.getProducts({ limit: 8 }),
        ]);

        // Use response.data instead of response.products
        const bestSellers = bestSellersData.success && bestSellersData.data ? bestSellersData.data : [];
        const favorites = favoritesData.success && favoritesData.data ? favoritesData.data : [];

        // Transform API data to match frontend Product interface
        interface ApiProduct {
          id: string;
          slug: string;
          name: string;
          short_description?: string;
          long_description?: string;
          base_price: string;
          base_compare_at_price?: string;
          is_active?: boolean;
          created_at: string;
          updated_at: string;
          variants?: Array<Record<string, unknown>>;
        }
        
        const transformProduct = (apiProduct: ApiProduct): Product => ({
          id: apiProduct.id,
          slug: apiProduct.slug,
          name: apiProduct.name,
          short_description: apiProduct.short_description || '',
          long_description: apiProduct.long_description || '',
          price_min: parseFloat(apiProduct.base_price) || 0,
          price_max: parseFloat(apiProduct.base_compare_at_price || apiProduct.base_price) || 0,
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
          images: [{
            id: 'default',
            url: '/api/placeholder/300/300',
            alt_text: apiProduct.name,
            is_primary: true,
            sort_order: 0
          }]
        });

        setBestSellers(bestSellers.slice(0, 3).map(transformProduct));
        setCustomerFavorites(favorites.slice(0, 8).map(transformProduct));
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
    },
    {
      title: 'Medium Roast',
      description: 'Perfect balance of origin flavors and roasted sweetness',
      color: 'bg-coffee-medium/10 border-coffee-medium/30',
      textColor: 'text-coffee-medium',
    },
    {
      title: 'Dark Roast',
      description: 'Rich, bold, and full-bodied with deep chocolate undertones',
      color: 'bg-coffee-dark/10 border-coffee-dark/30',
      textColor: 'text-coffee-dark',
    },
  ];

  return (
    <div className="min-h-screen">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
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
      <section className="py-16 bg-muted/30">
        <div className="container max-w-screen-2xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-coffee-dark mb-4">
              Roast to Your Taste
            </h2>
            <p className="text-muted-foreground text-lg">
              Every roast level offers a unique flavor profile
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {roastFeatures.map((feature, index) => (
              <Card key={index} className={`border-2 ${feature.color} hover:warm-shadow smooth-transition`}>
                <CardContent className="p-6 text-center">
                  <h3 className={`font-display text-2xl font-semibold mb-4 ${feature.textColor}`}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <img
              src={roastImage}
              alt="Different coffee roast levels"
              className="max-w-md mx-auto rounded-lg card-shadow"
            />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {customerFavorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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