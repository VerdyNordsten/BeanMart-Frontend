import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { productsApi as api, categoriesApi, roastLevelsApi } from '@/lib/api';
import { Product, ProductsResponse, Category, RoastLevel } from '@/types/product';
import { Search, Filter, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function ProductPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productsData, setProductsData] = useState<ProductsResponse>({
    products: [],
    pagination: { page: 1, limit: 12, total: 0, total_pages: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [roastFilter, setRoastFilter] = useState(searchParams.get('roast') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [weightFilter, setWeightFilter] = useState(searchParams.get('weight') || '');

  // Fetch categories and roast levels
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

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.getAllProducts();

      // Transform API response to match frontend expectations
      let products: Product[] = [];
      if (response.success && response.data && Array.isArray(response.data)) {
        products = response.data
          // Filter out inactive products
          .filter((apiProduct: unknown) => (apiProduct as { is_active?: boolean }).is_active !== false)
          .map((apiProduct: unknown) => {
            const product = apiProduct as {
              id: string;
              slug: string;
              name: string;
              short_description?: string;
              long_description?: string;
              currency: string;
              is_active: boolean;
              created_at: string;
              updated_at: string;
              categories?: Array<{
                id: string;
                name: string;
                slug: string;
              }>;
              roastLevels?: Array<{
                id: string;
                name: string;
                slug: string;
              }>;
              variants?: Array<{
                id: string;
                product_id: string;
                price: string;
                compare_at_price?: string;
                stock: number;
                weight_gram?: number;
                is_active: boolean;
                created_at: string;
                updated_at: string;
                images?: Array<{
                  id: string;
                  variant_id: string;
                  url: string;
                  position: number;
                  created_at: string;
                  updated_at: string;
                }>;
              }>;
            };
            
            // Calculate price range from variants
            const activeVariants = product.variants?.filter(v => v.is_active).map(v => ({
              ...v,
              price: Number(v.price),
              compare_at_price: v.compare_at_price ? Number(v.compare_at_price) : undefined,
              stock: Number(v.stock),
              weight_gram: v.weight_gram ? Number(v.weight_gram) : undefined
            })) || [];
            const minPrice = activeVariants.length > 0 ? Math.min(...activeVariants.map(v => v.price)) : 0;
            const maxPrice = activeVariants.length > 0 ? Math.max(...activeVariants.map(v => v.price)) : 0;
            
            return {
              id: product.id,
              slug: product.slug,
              name: product.name,
              short_description: product.short_description || '',
              long_description: product.long_description || '',
              price_min: minPrice,
              price_max: maxPrice,
              origin: '', // Not available in current API
              roast_level: 'medium' as const, // Default value - will be overridden by actual roast levels
              tasting_notes: [], // Not available in current API
              processing_method: '', // Not available in current API
              altitude: '', // Not available in current API
              producer: '', // Not available in current API
              harvest_date: '', // Not available in current API
              is_featured: false, // Not available in current API
              is_active: product.is_active !== false,
              category_id: '', // Not available in current API
              created_at: product.created_at,
              updated_at: product.updated_at,
              variants: activeVariants,
              images: [], // Images are now part of variants
              categories: product.categories || [],
              roastLevels: product.roastLevels || []
            };
          });
      }
      
      // Apply client-side filters
      let filteredProducts = [...products];
      
      // Search filter
      if (searchQuery) {
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.short_description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Category filter
      if (categoryFilter) {
        filteredProducts = filteredProducts.filter(p => 
          p.categories?.some((cat: { category_id: string }) => cat.category_id === categoryFilter)
        );
      }
      
      // Roast level filter
      if (roastFilter) {
        filteredProducts = filteredProducts.filter(p => 
          p.roastLevels?.some((roast: { roast_level_id: string }) => roast.roast_level_id === roastFilter)
        );
      }
      
      // Weight filter (client-side)
      if (weightFilter) {
        const [min, max] = weightFilter.split('-').map(Number);
        filteredProducts = filteredProducts.filter(p => {
          return p.variants?.some(v => {
            const weight = v.weight_gram || 0;
            return weight >= min && weight <= max;
          });
        });
      }

      setProductsData({
        products: filteredProducts,
        pagination: {
          page: 1,
          limit: 12,
          total: filteredProducts.length,
          total_pages: 1
        }
      });
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryFilter, roastFilter, weightFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page'); // Reset to first page when filtering
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRoastFilter('');
    setCategoryFilter('');
    setWeightFilter('');
    setSearchParams({});
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters('search', searchQuery);
  };

  const activeFiltersCount = [
    searchQuery,
    roastFilter,
    categoryFilter,
    weightFilter
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-muted/30 py-12">
        <div className="container max-w-screen-2xl">
          <h1 className="font-display text-4xl font-bold text-coffee-dark mb-4">
            Coffee Products
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover our complete collection of premium coffee beans
          </p>
        </div>
      </section>

      <div className="container max-w-screen-2xl py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 space-y-6">
            <div className="bg-card p-6 rounded-lg card-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-coffee-dark flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    Clear all
                    <X className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>

              {/* Search */}
              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium text-coffee-dark">
                  Search
                </label>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    placeholder="Search coffee..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" variant="coffee">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>

              {/* Category */}
              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium text-coffee-dark">
                  Category
                </label>
                <Select value={categoryFilter} onValueChange={(value) => {
                  setCategoryFilter(value === 'all' ? '' : value);
                  updateFilters('category', value === 'all' ? '' : value);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((category: Category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Roast Level */}
              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium text-coffee-dark">
                  Roast Level
                </label>
                <Select value={roastFilter} onValueChange={(value) => {
                  setRoastFilter(value === 'all' ? '' : value);
                  updateFilters('roast', value === 'all' ? '' : value);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All roasts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roasts</SelectItem>
                    {roastLevels.map((roastLevel: RoastLevel) => (
                      <SelectItem key={roastLevel.id} value={roastLevel.id}>
                        {roastLevel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Weight Range */}
              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium text-coffee-dark">
                  Weight Range
                </label>
                <Select value={weightFilter} onValueChange={(value) => {
                  setWeightFilter(value === 'all' ? '' : value);
                  updateFilters('weight', value === 'all' ? '' : value);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All weights" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All weights</SelectItem>
                    <SelectItem value="0-250">Under 250g</SelectItem>
                    <SelectItem value="250-500">250g - 500g</SelectItem>
                    <SelectItem value="500-1000">500g - 1kg</SelectItem>
                    <SelectItem value="1000-10000">1kg+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </aside>

          {/* Products */}
          <main className="flex-1">
            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchQuery && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Search: {searchQuery}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => {
                        setSearchQuery('');
                        updateFilters('search', '');
                      }}
                    />
                  </Badge>
                )}
                {categoryFilter && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    {categories.find((cat: Category) => cat.id === categoryFilter)?.name || 'Category'}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => {
                        setCategoryFilter('');
                        updateFilters('category', '');
                      }}
                    />
                  </Badge>
                )}
                {roastFilter && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    {roastLevels.find((roast: RoastLevel) => roast.id === roastFilter)?.name || 'Roast'}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => {
                        setRoastFilter('');
                        updateFilters('roast', '');
                      }}
                    />
                  </Badge>
                )}
                {weightFilter && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    {weightFilter.replace('-', ' - ')}g
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => {
                        setWeightFilter('');
                        updateFilters('weight', '');
                      }}
                    />
                  </Badge>
                )}
              </div>
            )}

            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                {!loading && (
                  <p className="text-muted-foreground">
                    Showing {productsData.products.length} products
                  </p>
                )}
              </div>
            </div>

            {/* Product Grid */}
            <ProductGrid 
              products={productsData.products} 
              loading={loading}
              className="mb-8"
            />

            {/* Pagination - Simple implementation for now */}
            {productsData.products.length > 0 && productsData.pagination.total_pages > 1 && (
              <div className="flex justify-center space-x-2">
                {Array.from({ length: productsData.pagination.total_pages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={productsData.pagination.page === i + 1 ? "coffee" : "outline"}
                    size="sm"
                    onClick={() => updateFilters('page', (i + 1).toString())}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}