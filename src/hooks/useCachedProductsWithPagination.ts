import { useState, useEffect, useCallback, useMemo } from "react";
import { productsApi } from "@/lib/api";
import { Product } from "@/types/product";

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
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

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
        console.log(`✅ Using cached data for products page ${page}`, cachedData.data.products.length, 'products');
        setData(cachedData.data);
        setLoading(false);
        return;
      } else if (cachedData) {
        console.log(`⏰ Cache expired for products page ${page}, fetching fresh data`);
      } else {
        console.log(`🔄 No cache found for products page ${page}, fetching fresh data`);
      }

      // If no valid cache, fetch from API
      setLoading(true);
      const response = await productsApi.getAllProducts();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        const transformedProducts = transformApiProducts(response.data);
        
        // Apply client-side filters
        let filteredProducts = [...transformedProducts];
        
        // Search filter
        if (search) {
          filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.short_description.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        // Roast level filter
        if (roast) {
          filteredProducts = filteredProducts.filter(p => 
            p.roastLevels?.some(rl => rl.id === roast)
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
            // Check if ANY variant has weight within the range
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
        
        console.log(`💾 Caching fresh data for products page ${page}`, paginatedProducts.length, 'products');
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
      console.error('Failed to load products:', err);
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
    price: number | string;
    compare_at_price?: number | string;
    stock: number | string;
    weight_gram?: number | string;
    is_active: boolean;
  }>;
  categories?: Array<{
    category_id: string;
    category_slug: string;
    category_name: string;
  }>;
  roastLevels?: Array<{
    roast_level_id: string;
    roast_level_slug: string;
    roast_level_name: string;
  }>;
}

function transformApiProducts(apiProducts: unknown[]): Product[] {
  return (apiProducts as ApiProduct[])
    .filter(apiProduct => apiProduct.is_active !== false)
    .map(apiProduct => {
      // Calculate price range from variants
      const activeVariants = apiProduct.variants?.filter(v => v.is_active).map(v => ({
        ...v,
        price: Number(v.price),
        compare_at_price: v.compare_at_price ? Number(v.compare_at_price) : undefined,
        stock: Number(v.stock),
        weight_gram: v.weight_gram ? Number(v.weight_gram) : undefined
      })) || [];
      
      const minPrice = activeVariants.length > 0 ? Math.min(...activeVariants.map(v => v.price)) : 0;
      const maxPrice = activeVariants.length > 0 ? Math.max(...activeVariants.map(v => v.price)) : 0;
      
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
        is_active: apiProduct.is_active !== false,
        category_id: apiProduct.categories?.[0]?.category_id || "",
        created_at: apiProduct.created_at,
        updated_at: apiProduct.updated_at,
        variants: activeVariants,
        images: [],
        categories: apiProduct.categories?.map(cat => ({
          id: cat.category_id,
          slug: cat.category_slug,
          name: cat.category_name
        })) || [],
        roastLevels: apiProduct.roastLevels?.map(rl => ({
          id: rl.roast_level_id,
          slug: rl.roast_level_slug,
          name: rl.roast_level_name
        })) || []
      };
    });
}

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
    console.warn('Failed to cache data:', error);
  }
}

function isExpired(cachedData: CachedData<PaginationData>): boolean {
  return Date.now() > cachedData.expiry;
}

// Debug function to clear pagination cache
export function clearProductsPaginationCache(): void {
  try {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('products_pagination_'));
    keys.forEach(key => localStorage.removeItem(key));
    console.log('🗑️ Cleared all products pagination cache');
  } catch (error) {
    console.warn('Failed to clear pagination cache:', error);
  }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as Window & { clearProductsPaginationCache?: () => void }).clearProductsPaginationCache = clearProductsPaginationCache;
}
