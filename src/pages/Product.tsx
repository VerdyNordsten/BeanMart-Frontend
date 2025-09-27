import { useSearchParams } from 'react-router-dom';
import { SEO, generateBreadcrumbStructuredData } from '@/components/SEO';
import { categoriesApi, roastLevelsApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useCachedProductsWithPagination } from '@/hooks/useCachedProductsWithPagination';
import { ProductPageHeader } from '@/components/products/ProductPageHeader';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductResults } from '@/components/products/ProductResults';

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
      
      <ProductPageHeader />

      <div className="container max-w-screen-2xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters
              searchQuery={searchQuery}
              categoryFilterSlug={categoryFilterSlug}
              roastFilterSlug={roastFilterSlug}
              weightFilter={weightFilter}
              activeFiltersCount={activeFiltersCount}
              categories={categories}
              roastLevels={roastLevels}
              onSearch={handleSearch}
              onFilterChange={updateFilters}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Products Results */}
          <ProductResults
            loading={loading}
            error={error}
            productsData={productsData}
            activeFiltersCount={activeFiltersCount}
            onRetry={() => refetch()}
            onClearFilters={clearFilters}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}