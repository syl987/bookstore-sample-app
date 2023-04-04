/**
 * Create a new array and pass the value as its content.
 *
 * If the value is `null` or `undefined`, return an empty array.
 *
 * If the value is an array, return a shallow copy.
 *
 * In any other case, return a new array with the value as its single element.
 */
export function asArray<T>(value: T[] | T | null | undefined): T[] {
  return value == null ? [] : Array.isArray(value) ? [...value] : [value];
}
