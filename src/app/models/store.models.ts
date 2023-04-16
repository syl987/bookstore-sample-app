import { ResponseError } from './error.models';

/**
 * Action payload with correlation id.
 *
 * @property {number} cid - correlation id
 */
export interface Payload {
  cid: number;
}

/**
 * Action payload with correlation id.
 *
 * @property {number} cid - correlation id
 */
export type Payload<T> = {
  cid: number;
} & T;

/**
 * Action payload with correlation id.
 *
 * @property {number} cid - correlation id
 * @property id
 */
export interface IdPayload<T = string> {
  cid: number;
  id: T;
}

/**
 * Action payload with correlation id.
 *
 * @property {number} cid - correlation id
 * @property data
 */
export interface DataPayload<T> {
  cid: number;
  data: T;
}

/**
 * Action payload with correlation id.
 *
 * @property {number} cid - correlation id
 * @property id
 * @property data
 */
export interface IdDataPayload<T> {
  cid: number;
  id: T;
  data: T;
}

/**
 * Action payload with correlation id.
 *
 * @property {number} cid - correlation id
 * @property error
 */
export interface ErrorPayload {
  cid: number;
  error: ResponseError;
}
