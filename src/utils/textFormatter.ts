/**
 * Utility functions for formatting text content
 */

/**
 * Format description text with basic markdown-like formatting
 * Supports:
 * - Line breaks (\n -> <br />)
 * - Bold text (**text** -> <strong>text</strong>)
 * - Italic text (*text* -> <em>text</em>)
 * - Inline code (`code` -> <code>code</code>)
 * - Bullet points (- item -> <li>item</li>)
 * - Numbered lists (1. item -> <li>item</li>)
 */
export function formatDescription(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let formatted = text;

  // Handle line breaks first
  formatted = formatted.replace(/\n/g, '<br />');

  // Handle bold text (**text**)
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Handle italic text (*text*)
  formatted = formatted.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');

  // Handle inline code (`code`)
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');

  // Handle bullet points (- item or * item)
  formatted = formatted.replace(/^[\s]*[-*]\s+(.+)$/gm, '<li class="ml-4 list-disc">$1</li>');

  // Handle numbered lists (1. item, 2. item, etc.)
  formatted = formatted.replace(/^[\s]*\d+\.\s+(.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');

  // Wrap consecutive <li> elements in <ul> or <ol>
  formatted = formatted.replace(/(<li class="ml-4 list-disc">.*?<\/li>)/gs, '<ul class="space-y-1 mb-4">$1</ul>');
  formatted = formatted.replace(/(<li class="ml-4 list-decimal">.*?<\/li>)/gs, '<ol class="space-y-1 mb-4">$1</ol>');

  // Handle paragraphs (double line breaks)
  formatted = formatted.replace(/(<br\s*\/?>\s*){2,}/g, '</p><p class="mb-4">');
  
  // Wrap in paragraph tags if not already formatted
  if (!formatted.includes('<p>') && !formatted.includes('<ul>') && !formatted.includes('<ol>')) {
    formatted = `<p class="mb-4">${formatted}</p>`;
  } else if (!formatted.startsWith('<p>') && !formatted.startsWith('<ul>') && !formatted.startsWith('<ol>')) {
    formatted = `<p class="mb-4">${formatted}`;
  }

  return formatted;
}

/**
 * Strip HTML tags from formatted text
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Truncate formatted text to specified length
 */
export function truncateFormatted(html: string, maxLength: number): string {
  const plainText = stripHtml(html);
  if (plainText.length <= maxLength) {
    return html;
  }
  
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  const finalText = lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated;
  
  return `${finalText}...`;
}
