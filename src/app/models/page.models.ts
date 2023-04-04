import { HttpRequestParams } from './http.models';

/** Page request params. */
export interface PageParams extends HttpRequestParams {
  /** Page number (0-based). */
  page?: number;
  /** Maximum number of elements per page. */
  size?: number;
  /** Property name to sort by. Optionally accepts the sort direction. */
  sort?: string | [string, 'asc' | 'desc'];
}

/** Page response body. */
export interface Page<T> {
  /** Elements representing the current page. */
  content: T[];
  /** Whether the current page is last. */
  last: boolean;
  /** Total number of pages. */
  totalPages: number;
  /** Total number of elements. */
  totalElements: number;
  /** Sort state of the elements. */
  sort: PageSort;
  /** Whether the current page is first. */
  first: boolean;
  /** Current page (0-based). */
  number: number;
  /** Number of elements on the current page. */
  numberOfElements: number;
  /** Maximum number of elements per page. */
  size: number;
  /** Whether the total number of elements is 0. */
  empty: boolean;
}

/** Page response body sort state. */
export interface PageSort {
  /** Whether the elements are sorted. */
  sorted: boolean;
  /** Whether the elements are unsorted. */
  unsorted: boolean;
  /** Whether the total number of elements is 0. */
  empty: boolean;
}

/** Sort change event. */
export interface Sort {
  /** Key to sort by. Often, it is a property name. */
  active: string;
  /** Direction key to sort by, ascending or descending. */
  direction: 'asc' | 'desc';
}
