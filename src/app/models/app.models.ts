import { InjectionToken } from '@angular/core';

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

/**
 * App-specific variables.
 */
export interface AppOptions {
  /** Application name to display in header and other places. */
  applicationName: string;
  /** Name of the legal copyright holder for display in the footer */
  copyrightName: string;
}

export const APP_OPTIONS = new InjectionToken<AppOptions>('APP_OPTIONS');

/**
 * Container for language-specific text elements for conditional use in templates.
 *
 * Supports internationalization (i18n) via `$localize` function (package `@angular/localize`).
 */
export interface AppStrings {
  [key: string]: string; // ready for translation via `$localize`
}

export const APP_STRINGS = new InjectionToken<AppStrings>('APP_STRINGS');
