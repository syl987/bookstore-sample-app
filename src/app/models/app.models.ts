import { InjectionToken } from '@angular/core';
import { EntityDataModuleConfig, EntityMetadata, HttpResourceUrls } from '@ngrx/data';

import { UserBookDTO } from './book.models';
import { EntityType } from './entity.models';
import { VolumeDTO } from './volume.models';

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

/**
 * Type-safe entity data config.
 */
export interface AppEntityDataModuleConfig extends EntityDataModuleConfig {
  entityMetadata: {
    [EntityType.USER_BOOKS]: Partial<EntityMetadata<UserBookDTO>>;
    [EntityType.VOLUME]: Partial<EntityMetadata<VolumeDTO>>;
  };
}

export interface AppFirebaseDataServiceConfig {
  entityHttpResourceUrls: {
    [EntityType.USER_BOOKS]: Pick<HttpResourceUrls, 'collectionResourceUrl'>;
    [EntityType.VOLUME]: Pick<HttpResourceUrls, 'collectionResourceUrl'>;
  };
}

/**
 * Type-safe entity display name map.
 */
export interface AppEntityDisplayNameMap {
  [EntityType.USER_BOOKS]: string;
  [EntityType.VOLUME]: string;
}

export const APP_ENTITY_NAMES = new InjectionToken<Partial<AppEntityDisplayNameMap>>('APP_ENTITY_NAMES');

export const APP_ENTITY_PLURAL_NAMES = new InjectionToken<Partial<AppEntityDisplayNameMap>>('APP_ENTITY_PLURAL_NAMES');
