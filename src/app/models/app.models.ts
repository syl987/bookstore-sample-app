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
 * App-specific router links.
 */
export interface AppNavLink {
  /** Display name. */
  readonly label: string;
  /** Full router path. */
  readonly path: string;
  /** Whether authentication as existing user is required (default: false). */
  readonly user?: boolean;
}

export const APP_NAV_LINKS: readonly AppNavLink[] = [
  { label: $localize`Home`, path: '/home' },
  { label: $localize`Search`, path: '/search' },
  { label: $localize`My Books`, path: '/user/books', user: true },
  { label: 'Dev', path: '/dev' },
];

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
];
