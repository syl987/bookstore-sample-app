import { HttpRequest } from '@angular/common/http';

import { HttpEndpointUrl } from '../models/http.models';

/**
 * Converts an object to a sequence of valid Uniform Resource Identifier (URI) key-value pairs, omitting `undefined` and empty string values.
 *
 * In addition, to conform with 'application/x-www-form-urlencoded', also replaces spaces with `'+'`.
 *
 * Uses `'='` to join a key with its value and `'&'` to separate key-value pairs. Joins array values with a comma.
 */
export function toXwwwEncodedString(object?: Record<string, string | number | boolean | (string | number | boolean)[] | null | undefined> | null): string {
  if (object == null) {
    return '';
  }
  return Object.entries(object)
    .reduce<string[]>((result, [key, value]) => {
      if (value != null && value !== '') {
        return [...result, `${encodeURIComponent(key)}=${Array.isArray(value) ? value.map(encodeXwwwComponent).join() : encodeXwwwComponent(value)}`];
      }
      return result;
    }, [])
    .join('&');
}

/**
 * Encodes a text string as a valid component of a Uniform Resource Identifier (URI) by calling `encodeURIComponent()` function.
 *
 * In addition, to conform with 'application/x-www-form-urlencoded', also replaces spaces with `'+'`.
 */
export function encodeXwwwComponent(uriComponent: string | number | boolean): string {
  return encodeURIComponent(uriComponent).replace(/%20/g, _ => '+');
}

/**
 * Converts an object to `FormData`, omitting `undefined` and empty string values.
 */
export function toFormData(object?: Record<string, string | Blob | null | undefined> | null): FormData {
  if (object == null) {
    return new FormData();
  }
  return Object.entries(object).reduce((data, [key, value]) => {
    if (value != null && value !== '') {
      data.append(key, value);
    }
    return data;
  }, new FormData());
}

/**
 * Converts an http params compatible object, omitting `undefined` and empty string values.
 */
export function toUrlParams(object?: Record<string, string | number | boolean | (string | number | boolean)[] | null | undefined> | null): Record<string, string | string[]> {
  if (object == null) {
    return {};
  }
  return Object.entries(object).reduce((result, [key, value]) => {
    if (value != null && value !== '') {
      return { ...result, [key]: Array.isArray(value) ? value.map(encodeURIComponent) : encodeURIComponent(value) };
    }
    return result;
  }, {});
}

/**
 * Test whether a request matches any endpoint definition. An empty or omitted array of methods is interpreted as match.
 */
export function matchesEndpointUrl(request: HttpRequest<unknown>, { url, httpMethods }: HttpEndpointUrl): boolean {
  return new RegExp(url).test(request.url) && (!httpMethods || httpMethods.length === 0 || httpMethods.join().includes(request.method.toUpperCase()));
}
