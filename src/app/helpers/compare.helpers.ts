import { Comparer } from '@ngrx/entity';

/**
 * Compare two objects by the specified string property in ascending order.
 *
 * @param propName name of the string property
 *
 * @experimental
 */
export function stringPropComparerAsc<T, P extends keyof T>(propName: P): T[P] extends string | null | undefined ? Comparer<T> : unknown {
  const result: Comparer<T> = (a, b) => (a[propName] && b[propName] ? (a[propName] as any).localeCompare(b[propName]) : 0);
  return result as any;
}

/**
 * Compare two objects by the specified string property in descending order.
 *
 * @param propName name of the string property
 *
 * @experimental
 */
export function stringPropComparerDesc<T, P extends keyof T>(propName: P): T[P] extends string | null | undefined ? Comparer<T> : unknown {
  const result: Comparer<T> = (b, a) => (a[propName] && b[propName] ? (a[propName] as any).localeCompare(b[propName]) : 0);
  return result as any;
}
