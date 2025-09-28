import { Link } from "react-router-dom";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Skeleton } from "@/ui/skeleton";
import { ProductCard } from "@/ui/ProductCard";
import { Product } from "@/types/product";
import { ArrowRight } from "lucide-react";

interface BestSellersSectionProps {
  products: Product[];
  loading: boolean;
}

export function BestSellersSection({ products, loading }: BestSellersSectionProps) {
  return (
    <section className="py-16 bg-background">
      <div className="container max-w-screen-2xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-bold text-coffee-dark mb-4">
            Best Sellers
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            These exceptional coffees have won the hearts of our customers
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="coffee-outline" size="lg" asChild>
            <Link to="/products">
              View All Coffee
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
