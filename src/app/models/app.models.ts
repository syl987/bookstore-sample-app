import { InjectionToken } from '@angular/core';

/**
 * Container for language-specific text elements for conditional use in templates.
 *
 * Supports internationalization (i18n) via `$localize` function (package `@angular/localize`).
 */
export interface AppStrings {
  [key: string]: string; // ready for translation via `$localize`
}

export const APP_STRINGS = new InjectionToken<AppStrings>('APP_STRINGS');

/**
 * App-specific variables.
 */
export interface AppConfig {
  /** Application name to display in header and other places. */
  appName: string;
  /** Name of the legal copyright holder for display in the footer */
  copyrightName: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
