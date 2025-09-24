import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { productsApi as api } from '@/lib/api';
import { Product, ProductsResponse } from '@/types/product';
import { Search, Filter, X } from 'lucide-react';

export default function ProductPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productsData, setProductsData] = useState<ProductsResponse>({
    products: [],
    pagination: { page: 1, limit: 12, total: 0, total_pages: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [roastFilter, setRoastFilter] = useState(searchParams.get('roast') || '');
  const [priceFilter, setPriceFilter] = useState(searchParams.get('price') || '');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('in_stock') === 'true');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: searchParams.get('search') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '12'),
        roast_level: searchParams.get('roast') || undefined,
      };

      const response = await api.getProducts(params);

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
              base_price?: number;
              base_compare_at_price?: number;
              currency: string;
              is_active: boolean;
              sku?: string;
              weight_gram?: number;
              created_at: string;
              updated_at: string;
              variants?: unknown[];
              images?: unknown[];
            };
            return {
            id: product.id,
            slug: product.slug,
            name: product.name,
            short_description: product.short_description || '',
            long_description: product.long_description || '',
            price_min: product.base_price || 0,
            price_max: product.base_compare_at_price || product.base_price || 0,
            origin: '', // Not available in current API
            roast_level: 'medium' as const, // Default value, would need to be extracted from product data
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
            variants: product.variants || [],
            images: product.images || []
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
      
      // Price filter (client-side)
      if (priceFilter) {
        const [min, max] = priceFilter.split('-').map(Number);
        filteredProducts = filteredProducts.filter(p => {
          const minPrice = p.price_min;
          return minPrice >= min && minPrice <= max;
        });
      }
      
      // Note: Other filters like roast level, in stock, etc. would need to be implemented
      // based on actual product data from the API

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
  }, [searchParams, searchQuery, priceFilter]);

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
    setPriceFilter('');
    setInStockOnly(false);
    setSearchParams({});
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters('search', searchQuery);
  };

  const activeFiltersCount = [
    searchQuery,
    roastFilter,
    priceFilter,
    inStockOnly ? 'in_stock' : ''
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
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium text-coffee-dark">
                  Price Range
                </label>
                <Select value={priceFilter} onValueChange={(value) => {
                  setPriceFilter(value === 'all' ? '' : value);
                  updateFilters('price', value === 'all' ? '' : value);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All prices</SelectItem>
                    <SelectItem value="0-50000">Under 50K</SelectItem>
                    <SelectItem value="50000-100000">50K - 100K</SelectItem>
                    <SelectItem value="100000-150000">100K - 150K</SelectItem>
                    <SelectItem value="150000-1000000">150K+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* In Stock */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="in-stock"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    updateFilters('in_stock', e.target.checked ? 'true' : '');
                  }}
                  className="rounded border-coffee-light"
                />
                <label htmlFor="in-stock" className="text-sm text-coffee-dark">
                  In stock only
                </label>
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
                {roastFilter && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    {roastFilter} roast
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => {
                        setRoastFilter('');
                        updateFilters('roast', '');
                      }}
                    />
                  </Badge>
                )}
                {priceFilter && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    {priceFilter.replace('-', ' - ')}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => {
                        setPriceFilter('');
                        updateFilters('price', '');
                      }}
                    />
                  </Badge>
                )}
                {inStockOnly && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    In stock
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => {
                        setInStockOnly(false);
                        updateFilters('in_stock', '');
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