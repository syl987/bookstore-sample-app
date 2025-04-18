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
  readonly copyrightYear: number;
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
  /** Display icon. Used in the sidenav. */
  readonly icon: string;
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

/**
 * Language available in the app.
 */
export interface AppLanguage {
  /** Display name. */
  readonly label: string;
  /** Locale id. */
  readonly locale: string;
  /** Flagpack icon class. */
  readonly icon: string;
}

export type AppLanguages = readonly AppLanguage[];

export const APP_LANGUAGES = new InjectionToken<AppLanguages>('APP_LANGUAGES');

/**
 * Tech-stack item.
 */
export interface AppTechStackItem {
  /** Display name. */
  readonly title: string;
  /** Short description. */
  readonly subtitle: string;
  /** Block description. */
  readonly description: string;
  /** Image URL. */
  readonly image: string;
  /** Image element classes. Intended for layout adjustments. */
  readonly imageClass?: string;
}

/**
 * App-specific technical feature.
 */
export interface AppTechnicalFeature {
  /** Display name. */
  readonly title: string;
  /** Block description. */
  readonly description: string;
}
