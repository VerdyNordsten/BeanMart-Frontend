import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { Pagination, PaginationInfo } from '@/components/ui/Pagination';
import { Filter } from 'lucide-react';

interface ProductResultsProps {
  loading: boolean;
  error: any;
  productsData: any;
  activeFiltersCount: number;
  onRetry: () => void;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
}

export function ProductResults({
  loading,
  error,
  productsData,
  activeFiltersCount,
  onRetry,
  onClearFilters,
  onPageChange,
}: ProductResultsProps) {
  return (
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
          <Button onClick={onRetry} variant="coffee-outline">
            Retry
          </Button>
        </div>
      ) : productsData?.products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            No products found matching your criteria.
          </div>
          <Button onClick={onClearFilters} variant="coffee-outline">
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
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
