export enum NavigationStateKey {}

export interface NavigationState {}

export type RouteParam = 'volumeId' | 'offerId' | 'bookId';

export interface RouteParams {
  volumeId?: string;
  offerId?: string;
  bookId?: string;
}

export type RouteQueryParam = never;

export interface QueryParams {}
