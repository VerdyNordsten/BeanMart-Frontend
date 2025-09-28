import { useState, useEffect } from "react";
import { productsApi } from "@/lib/api";
import { Product } from "@/types/product";

interface CachedData<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export function useCachedProducts(limit: number, cacheKey: string) {
  const [data, setData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check cache first
        const cachedData = getCachedData(cacheKey);
        if (cachedData && !isExpired(cachedData)) {
          console.log(`✅ Using cached data for ${cacheKey}`, cachedData.data.length, 'products');
          setData(cachedData.data);
          setLoading(false);
          return;
        } else if (cachedData) {
          console.log(`⏰ Cache expired for ${cacheKey}, fetching fresh data`);
        } else {
          console.log(`🔄 No cache found for ${cacheKey}, fetching fresh data`);
        }

        // If no valid cache, fetch from API
        setLoading(true);
        const response = await productsApi.getProducts({ limit });
        
        if (response.success && response.data) {
          const productData = response.data;
          console.log(`💾 Caching fresh data for ${cacheKey}`, productData.length, 'products');
          setData(productData);
          
          // Cache the data
          setCachedData(cacheKey, productData);
        } else {
          setData([]);
        }
      } catch (err) {
        setError(err as Error);
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [limit, cacheKey]);

  return { data, loading, error };
}

function getCachedData(key: string): CachedData<Product[]> | null {
  try {
    const cached = localStorage.getItem(`products_${key}`);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function setCachedData(key: string, data: Product[]): void {
  try {
    const cacheData: CachedData<Product[]> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + CACHE_DURATION
    };
    localStorage.setItem(`products_${key}`, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to cache data:', error);
  }
}

function isExpired(cachedData: CachedData<Product[]>): boolean {
  return Date.now() > cachedData.expiry;
}

// Debug function to clear cache (can be called from browser console)
export function clearProductsCache(): void {
  try {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('products_'));
    keys.forEach(key => localStorage.removeItem(key));
    console.log('🗑️ Cleared all products cache');
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as Window & { clearProductsCache?: () => void }).clearProductsCache = clearProductsCache;
}
