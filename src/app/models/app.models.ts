import { InjectionToken } from '@angular/core';

/**
 * App-specific variables.
 */
export interface AppOptions {
  /** Application name to display in header and other places. */
  applicationName: string;
  /** Name of the legal copyright holder for display in the footer. */
  copyrightName: string;
}

export const APP_OPTIONS = new InjectionToken<AppOptions>('APP_OPTIONS');

/**
 * App-specific router links.
 */
export interface AppNavLink {
  /** Display name. */
  label: string;
  /** Full router path. */
  path: string;
  /** Whether authentication as existing user is required (default: false). */
  user?: boolean;
  /** Whether to hide in non-development builds (default: false). */
  dev?: boolean;
}

export const APP_NAV_LINKS: readonly Readonly<AppNavLink>[] = [
  { label: `Home`, path: '/home' },
  { label: `Search`, path: '/search' },
  { label: `My Books`, path: '/user/books', user: true },
  { label: 'Dev', path: '/dev', dev: true },
];

export interface AppLanguage {
  /** Display name. */
  label: string;
  /** Locale id. */
  locale: string;
  /** Flagpack icon class. */
  icon: string;
}

export const APP_LANGUAGES: readonly Readonly<AppLanguage>[] = [
  { label: 'English', locale: 'en', icon: 'us' },
  // { label: 'Deutsch', locale: 'de', icon: 'de' },
];
