/**
 * Safely convert any value to a string. Returns `'function'` if the value is a function and `'object'` if its an object.
 */
export function safeToString(value: unknown): string {
  if (value == null) {
    return '';
  }
  switch (typeof value) {
    case 'object':
      return 'object';
    case 'function':
      return 'function';
    default:
      return value + '';
  }
}

export function removeHtmlXmlAnnotations(value: string): string;
export function removeHtmlXmlAnnotations(value?: string | null): string | null;
export function removeHtmlXmlAnnotations(value?: string | null): string | null {
  if (value == null) {
    return null;
  }
  return value.replace(/(<([^>]+)>)/g, '');
}
