interface ProductForStructuredData {
  name: string;
  images?: Array<{ image_url: string }>;
  short_description: string;
  price_min: number;
  price_max: number;
  variants?: Array<{ stock_quantity: number }>;
  rating?: number;
  review_count?: number;
  categories?: Array<{ name: string }>;
  roastLevels?: Array<{ name: string }>;
}

// Helper function to generate product structured data
export function generateProductStructuredData(product: ProductForStructuredData) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.map(img => `https://beanmart.com${img.image_url}`) || [],
    "description": product.short_description,
    "brand": {
      "@type": "Brand",
      "name": "Beanmart"
    },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": product.price_min,
      "highPrice": product.price_max,
      "priceCurrency": "USD",
      "availability": product.variants?.some(v => v.stock_quantity > 0) 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock"
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.review_count || 1
    } : undefined,
    "category": product.categories?.map(cat => cat.name).join(", "),
    "additionalProperty": [
      ...(product.roastLevels?.map(roast => ({
        "@type": "PropertyValue",
        "name": "Roast Level",
        "value": roast.name
      })) || [])
    ]
  };
}

// Helper function to generate breadcrumb structured data
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.name,
      "item": `https://beanmart.com${breadcrumb.url}`
    }))
  };
}
