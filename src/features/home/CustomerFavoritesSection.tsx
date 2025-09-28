import { Card, CardContent } from "@/ui/card";
import { Skeleton } from "@/ui/skeleton";
import { ProductCard } from "@/ui/ProductCard";
import { Product } from "@/types/product";

interface CustomerFavoritesSectionProps {
  products: Product[];
  loading: boolean;
}

export function CustomerFavoritesSection({ products, loading }: CustomerFavoritesSectionProps) {
  return (
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

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
