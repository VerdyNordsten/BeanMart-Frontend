import { useEffect, useState } from 'react';

interface SEODebugProps {
  enabled?: boolean;
}

export function SEODebug({ enabled = process.env.NODE_ENV === 'development' }: SEODebugProps) {
  const [seoData, setSeoData] = useState<any>({});

  useEffect(() => {
    if (!enabled) return;

    const updateSEOData = () => {
      const title = document.title;
      const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
      const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content');
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
      const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content');
      const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
      const structuredData = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
        .map(script => {
          try {
            return JSON.parse(script.textContent || '');
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      setSeoData({
        title,
        description,
        keywords,
        ogTitle,
        ogDescription,
        ogImage,
        canonical,
        structuredData
      });
    };

    // Initial update
    updateSEOData();

    // Update on DOM changes
    const observer = new MutationObserver(updateSEOData);
    observer.observe(document.head, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: '#000',
      color: '#fff',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      fontFamily: 'monospace',
      maxWidth: '400px',
      maxHeight: '300px',
      overflow: 'auto',
      zIndex: 9999,
      opacity: 0.9
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>SEO Debug Info</div>
      <div><strong>Title:</strong> {seoData.title}</div>
      <div><strong>Description:</strong> {seoData.description?.substring(0, 100)}...</div>
      <div><strong>Keywords:</strong> {seoData.keywords?.substring(0, 50)}...</div>
      <div><strong>OG Title:</strong> {seoData.ogTitle}</div>
      <div><strong>OG Image:</strong> {seoData.ogImage}</div>
      <div><strong>Canonical:</strong> {seoData.canonical}</div>
      <div><strong>Structured Data:</strong> {seoData.structuredData?.length || 0} items</div>
    </div>
  );
}

// Helper function to check SEO health
export function checkSEOHealth() {
  const issues = [];
  
  const title = document.title;
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
  const h1Elements = document.querySelectorAll('h1');
  const images = document.querySelectorAll('img:not([alt])');
  
  if (!title || title.length < 10 || title.length > 60) {
    issues.push('Title should be 10-60 characters');
  }
  
  if (!description || description.length < 120 || description.length > 160) {
    issues.push('Meta description should be 120-160 characters');
  }
  
  if (h1Elements.length !== 1) {
    issues.push('Page should have exactly one H1 tag');
  }
  
  if (images.length > 0) {
    issues.push(`${images.length} images missing alt text`);
  }
  
  return issues;
}
