import { InjectionToken } from '@angular/core';

/**
 * App-specific variables.
 */
export interface AppOptions {
  /** Application name to display in header and other places. */
  readonly applicationName: string;
  /** Name of the legal copyright holder for display in the footer. */
  readonly copyrightName: string;
  /** Year of the last update for display in the footer. */
  readonly copyrightYear: string;
}

export const APP_OPTIONS = new InjectionToken<AppOptions>('APP_OPTIONS');

/**
 * App-specific router link.
 */
export interface AppLink {
  /** Display name. */
  readonly label: string;
  /** Router path. */
  readonly path: string;
  /** Fragment for a specific router path. */
  readonly fragment?: string;
  /** Whether authentication as existing user is required (default: false). */
  readonly userSpecific?: boolean;
}

/**
 * App-specific router links.
 */
export type AppLinks = readonly AppLink[];

export const APP_LINKS = new InjectionToken<AppLinks>('APP_LINKS');

export interface AppLanguage {
  /** Display name. */
  readonly label: string;
  /** Locale id. */
  readonly locale: string;
  /** Flagpack icon class. */
  readonly icon: string;
}

export const APP_LANGUAGES: readonly AppLanguage[] = [
  { label: 'English', locale: 'en', icon: 'us' },
  { label: 'Deutsch', locale: 'de', icon: 'de' },
  { label: 'Español', locale: 'es', icon: 'es' },
];
