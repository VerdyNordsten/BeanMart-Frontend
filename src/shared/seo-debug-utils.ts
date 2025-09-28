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
