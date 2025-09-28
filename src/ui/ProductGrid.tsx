import { ProductWithRelations } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: ProductWithRelations[];
  loading?: boolean;
  className?: string;
}

export function ProductGrid({ 
  products, 
  loading = false, 
  className = '' 
}: ProductGridProps) {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-muted rounded-lg mb-4"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded w-3/4 mb-3"></div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-muted rounded w-16"></div>
              <div className="h-8 bg-muted rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="font-display text-xl text-coffee-dark mb-2">
            No coffee found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria to find the perfect beans.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}