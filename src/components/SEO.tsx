import { Helmet } from 'react-helmet-async';
import { Product, VariantImage } from '@/types/product';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  siteName?: string;
  structuredData?: object;
}

const defaultProps: SEOProps = {
  title: 'Beanmart - Premium Coffee Beans & Brewing Equipment',
  description: 'Discover premium coffee beans from around the world. From light to dark roast, single origin to blends. Shop the finest coffee beans and brewing equipment at Beanmart.',
  keywords: 'coffee beans, premium coffee, single origin, coffee roasting, brewing equipment, coffee shop, specialty coffee',
  image: '/og-image.jpg',
  url: 'https://beanmart.com',
  type: 'website',
  siteName: 'Beanmart'
};

export function SEO({
  title = defaultProps.title,
  description = defaultProps.description,
  keywords = defaultProps.keywords,
  image = defaultProps.image,
  url = defaultProps.url,
  type = defaultProps.type,
  author,
  publishedTime,
  modifiedTime,
  siteName = defaultProps.siteName,
  structuredData
}: SEOProps) {
  const fullTitle = title === defaultProps.title ? title : `${title} | Beanmart`;
  const fullUrl = url?.startsWith('http') ? url : `https://beanmart.com${url}`;
  const fullImage = image?.startsWith('http') ? image : `https://beanmart.com${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Article specific meta tags */}
      {type === 'article' && author && (
        <meta name="author" content={author} />
      )}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {/* Additional SEO meta tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

// Helper function to generate product structured data
export function generateProductStructuredData(product: Product) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.map((img: VariantImage) => `https://beanmart.com${img.url}`) || [],
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
      "availability": product.variants?.some((v) => v.stock > 0) 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock"
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.review_count || 1
    } : undefined,
    "category": product.categories?.map((cat) => cat.name).join(", "),
    "additionalProperty": [
      ...(product.roastLevels?.map((roast) => ({
        "@type": "PropertyValue",
        "name": "Roast Level",
        "value": roast.name
      })) || []),
      ...(product.variants?.map((variant: any) => ({
        "@type": "PropertyValue", 
        "name": "Weight",
        "value": `${variant.weight_gram}g`
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
