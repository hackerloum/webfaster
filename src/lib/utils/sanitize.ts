import DOMPurify from 'dompurify';

export function sanitizeHTML(html: string): string {
  if (typeof window === 'undefined') {
    // Server-side: return as-is (DOMPurify needs DOM)
    return html;
  }
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'a',
      'span',
      'div',
      'img',
    ],
    ALLOWED_ATTR: ['href', 'target', 'class', 'style', 'src', 'alt'],
  });
}
