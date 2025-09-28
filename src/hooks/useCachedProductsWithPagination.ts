import { useState, useEffect, useCallback, useMemo } from "react";
import { productsApi } from "@/lib/api";
import { ProductWithRelations } from "@/types";
import { logger } from "@/utils/logger";

interface CachedData<T> {
  data: T;
  timestamp: number;
  expiry: number;
  filters: {
    search: string;
    roast: string;
    category: string;
    weight: string;
  };
}

interface PaginationData {
  products: ProductWithRelations[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Helper functions
function getCachedData(key: string): CachedData<PaginationData> | null {
  try {
    const cached = localStorage.getItem(`products_pagination_${key}`);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function setCachedData(key: string, data: PaginationData, filters: { search: string; roast: string; category: string; weight: string }): void {
  try {
    const cacheData: CachedData<PaginationData> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + CACHE_DURATION,
      filters
    };
    localStorage.setItem(`products_pagination_${key}`, JSON.stringify(cacheData));
  } catch (error) {
    logger.warn('Failed to cache data', { error });
  }
}

function isExpired(cachedData: CachedData<PaginationData>): boolean {
  return Date.now() > cachedData.expiry;
}

export function useCachedProductsWithPagination(
  page: number = 1,
  limit: number = 12,
  search: string = '',
  roast: string = '',
  category: string = '',
  weight: string = ''
) {
  const [data, setData] = useState<PaginationData>({
    products: [],
    pagination: { page: 1, limit: 12, total: 0, total_pages: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const filters = useMemo(() => ({ search, roast, category, weight }), [search, roast, category, weight]);
  const cacheKey = `products_page_${page}_limit_${limit}_${JSON.stringify(filters)}`;

  const loadProducts = useCallback(async () => {
    try {
      // Check cache first
      const cachedData = getCachedData(cacheKey);
      if (cachedData && !isExpired(cachedData)) {
        logger.debug(`Using cached data for products page ${page}`, { count: cachedData.data.products.length });
        setData(cachedData.data);
        setLoading(false);
        return;
      }

      // If no valid cache, fetch from API
      setLoading(true);
      const response = await productsApi.getAllProducts();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        // Apply client-side filters
        let filteredProducts = [...response.data];
        
        // Search filter
        if (search) {
          filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.short_description && p.short_description.toLowerCase().includes(search.toLowerCase()))
          );
        }
        
        // Roast level filter
        if (roast) {
          filteredProducts = filteredProducts.filter(p => 
            p.roast_levels?.some(rl => rl.id === roast)
          );
        }
        
        // Category filter
        if (category) {
          filteredProducts = filteredProducts.filter(p => 
            p.categories?.some(cat => cat.id === category)
          );
        }
        
        // Weight filter
        if (weight) {
          const [minWeight, maxWeight] = weight.split('-').map(Number);
          filteredProducts = filteredProducts.filter(p => {
            return p.variants?.some(variant => {
              const variantWeight = variant.weight_gram;
              return variantWeight && variantWeight >= minWeight && variantWeight <= maxWeight;
            }) || false;
          });
        }
        
        // Calculate pagination
        const total = filteredProducts.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        
        const paginationData: PaginationData = {
          products: paginatedProducts,
          pagination: {
            page,
            limit,
            total,
            total_pages: totalPages
          }
        };
        
        logger.debug(`Caching fresh data for products page ${page}`, { count: paginatedProducts.length });
        setData(paginationData);
        
        // Cache the data
        setCachedData(cacheKey, paginationData, filters);
      } else {
        setData({
          products: [],
          pagination: { page: 1, limit: 12, total: 0, total_pages: 0 }
        });
      }
    } catch (err) {
      setError(err as Error);
      logger.error('Failed to load products', { error: err });
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, roast, category, weight, cacheKey, filters]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return { 
    data, 
    loading, 
    error, 
    refetch: loadProducts 
  };
}

// Debug function to clear pagination cache
export function clearProductsPaginationCache(): void {
  try {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('products_pagination_'));
    keys.forEach(key => localStorage.removeItem(key));
    logger.debug('Cleared all products pagination cache');
  } catch (error) {
    logger.warn('Failed to clear pagination cache', { error });
  }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as Window & { clearProductsPaginationCache?: () => void }).clearProductsPaginationCache = clearProductsPaginationCache;
}