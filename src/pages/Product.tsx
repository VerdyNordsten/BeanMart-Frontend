import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEO, generateBreadcrumbStructuredData } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { Pagination, PaginationInfo } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { categoriesApi, roastLevelsApi } from '@/lib/api';
import { Category, RoastLevel } from '@/types/product';
import { Search, Filter, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useCachedProductsWithPagination } from '@/hooks/useCachedProductsWithPagination';

export default function ProductPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get current page from URL params
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('search') || '';
  const roastFilterSlug = searchParams.get('roast') || '';
  const categoryFilterSlug = searchParams.get('category') || '';
  const weightFilter = searchParams.get('weight') || '';
  const itemsPerPage = 12;

  // Fetch categories and roast levels with caching
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAllCategories(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });

  const { data: roastLevelsResponse } = useQuery({
    queryKey: ['roast-levels'],
    queryFn: () => roastLevelsApi.getAllRoastLevels(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });

  const categories = (categoriesResponse as any)?.data || [];
  const roastLevels = (roastLevelsResponse as any)?.data || [];

  // Convert slugs to IDs for filtering
  const roastFilter = roastLevels.find((rl: any) => rl.slug === roastFilterSlug)?.id || '';
  const categoryFilter = categories.find((cat: any) => cat.slug === categoryFilterSlug)?.id || '';

  // Use cached products with pagination
  const { data: productsData, loading, error, refetch } = useCachedProductsWithPagination(
    currentPage,
    itemsPerPage,
    searchQuery,
    roastFilter,
    categoryFilter,
    weightFilter
  );

  // Update URL params when filters change
  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === '' || value === 'all') {
      newParams.delete(key);
    } else {
      // For category and roast, use slug instead of ID
      if (key === 'category') {
        const category = categories.find(cat => cat.id === value);
        newParams.set(key, category?.slug || value);
      } else if (key === 'roast') {
        const roastLevel = roastLevels.find(rl => rl.id === value);
        newParams.set(key, roastLevel?.slug || value);
      } else {
        newParams.set(key, value);
      }
    }
    newParams.delete('page'); // Reset to page 1 when filters change
    setSearchParams(newParams);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const searchValue = formData.get('search') as string;
    updateFilters('search', searchValue);
  };

  const activeFiltersCount = [
    searchQuery,
    roastFilterSlug,
    categoryFilterSlug,
    weightFilter
  ].filter(Boolean).length;

  // Generate SEO data
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' }
  ]);

  const getPageTitle = () => {
    const parts = ['Coffee Products'];
    if (searchQuery) parts.unshift(`"${searchQuery}"`);
    if (categoryFilterSlug && categories) {
      const category = categories.find(c => c.slug === categoryFilterSlug);
      if (category) parts.unshift(category.name);
    }
    if (roastFilterSlug && roastLevels) {
      const roast = roastLevels.find(r => r.slug === roastFilterSlug);
      if (roast) parts.unshift(roast.name);
    }
    return parts.join(' - ');
  };

  const getPageDescription = () => {
    let description = 'Browse our premium collection of coffee beans. ';
    if (searchQuery) description += `Search results for "${searchQuery}". `;
    if (categoryFilterSlug && categories) {
      const category = categories.find(c => c.slug === categoryFilterSlug);
      if (category) description += `${category.name} coffee beans. `;
    }
    if (roastFilterSlug && roastLevels) {
      const roast = roastLevels.find(r => r.slug === roastFilterSlug);
      if (roast) description += `${roast.name} coffee beans. `;
    }
    description += 'From single origin to blends, light to dark roast.';
    return description;
  };

  const getPageUrl = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (categoryFilterSlug) params.set('category', categoryFilterSlug);
    if (roastFilterSlug) params.set('roast', roastFilterSlug);
    if (weightFilter) params.set('weight', weightFilter);
    if (currentPage > 1) params.set('page', currentPage.toString());
    return `/products${params.toString() ? '?' + params.toString() : ''}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={getPageTitle()}
        description={getPageDescription()}
        keywords="coffee products, coffee beans, single origin, coffee blends, light roast, medium roast, dark roast, premium coffee, specialty coffee"
        url={getPageUrl()}
        type="website"
        structuredData={breadcrumbStructuredData}
      />
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-lg font-semibold text-coffee-dark">
                  Filters
                  </h2>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                      className="text-muted-foreground hover:text-coffee-dark"
                  >
                      <X className="h-4 w-4 mr-1" />
                      Clear ({activeFiltersCount})
                  </Button>
                )}
              </div>

                <div className="space-y-6">
              {/* Search */}
                  <form onSubmit={handleSearch} className="space-y-2">
                <label className="text-sm font-medium text-coffee-dark">
                  Search
                </label>
                    <div className="flex gap-2">
                  <Input
                        name="search"
                        placeholder="Search products..."
                        defaultValue={searchQuery}
                    className="flex-1"
                  />
                      <Button type="submit" size="sm" variant="coffee-outline">
                    <Search className="h-4 w-4" />
                  </Button>
                    </div>
                </form>

              {/* Category */}
                  <div className="space-y-2">
                <label className="text-sm font-medium text-coffee-dark">
                  Category
                </label>
                    <Select value={categoryFilterSlug} onValueChange={(value) => {
                      if (value === 'all') {
                        updateFilters('category', '');
                      } else {
                        const category = categories.find(cat => cat.slug === value);
                        updateFilters('category', category?.id || '');
                      }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((category: Category) => (
                          <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Roast Level */}
                  <div className="space-y-2">
                <label className="text-sm font-medium text-coffee-dark">
                  Roast Level
                </label>
                    <Select value={roastFilterSlug} onValueChange={(value) => {
                      if (value === 'all') {
                        updateFilters('roast', '');
                      } else {
                        const roastLevel = roastLevels.find(rl => rl.slug === value);
                        updateFilters('roast', roastLevel?.id || '');
                      }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All roasts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roasts</SelectItem>
                    {roastLevels.map((roastLevel: RoastLevel) => (
                          <SelectItem key={roastLevel.id} value={roastLevel.slug}>
                        {roastLevel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Weight Range */}
                  <div className="space-y-2">
                <label className="text-sm font-medium text-coffee-dark">
                  Weight Range
                </label>
                <Select value={weightFilter} onValueChange={(value) => {
                      updateFilters('weight', value);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All weights" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All weights</SelectItem>
                        <SelectItem value="100-250">100g - 250g</SelectItem>
                    <SelectItem value="250-500">250g - 500g</SelectItem>
                    <SelectItem value="500-1000">500g - 1kg</SelectItem>
                        <SelectItem value="1000-2000">1kg - 2kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="font-display text-xl font-semibold text-coffee-dark">
                  Products
                </h2>
            {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="bg-coffee-medium/10 text-coffee-medium">
                    {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {productsData?.pagination.total || 0} products
                </span>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
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
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  Failed to load products. Please try again.
                </div>
                <Button onClick={() => refetch()} variant="coffee-outline">
                  Retry
                </Button>
              </div>
            ) : productsData?.products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  No products found matching your criteria.
                </div>
                <Button onClick={clearFilters} variant="coffee-outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <ProductGrid products={productsData?.products || []} />
                
                {/* Pagination */}
                {productsData && productsData.pagination.total_pages > 1 && (
                  <div className="mt-12 space-y-4">
                    <PaginationInfo
                      currentPage={productsData.pagination.page}
                      totalPages={productsData.pagination.total_pages}
                      totalItems={productsData.pagination.total}
                      itemsPerPage={productsData.pagination.limit}
                      className="text-center"
                    />
                    <Pagination
                      currentPage={productsData.pagination.page}
                      totalPages={productsData.pagination.total_pages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}