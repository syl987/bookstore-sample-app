import { isDevMode } from '@angular/core';
import { routerReducer, RouterState, StoreRouterConfig } from '@ngrx/router-store';
import { ActionReducerMap, RootStoreConfig } from '@ngrx/store';

import { metaReducers } from './app.meta-reducers';
import { AuthEffects } from './auth/auth.effects';
import { GoogleBooksEffects } from './google-books/google-books.effects';
import * as fromGoogleBooks from './google-books/google-books.reducer';
import { LoggerEffects } from './logger/logger.effects';
import { UserBooksEffects } from './user-books/user-books.effects';
import * as fromUserBooks from './user-books/user-books.reducer';
import { VolumesEffects } from './volume/volume.effects';
import * as fromVolume from './volume/volume.reducer';

export const reducers: ActionReducerMap<unknown> = {
  router: routerReducer,
  [fromGoogleBooks.googleBooksFeatureKey]: fromGoogleBooks.reducer,
  [fromUserBooks.userBooksFeatureKey]: fromUserBooks.reducer,
  [fromVolume.volumeFeatureKey]: fromVolume.reducer,
};

export const effects = [AuthEffects, LoggerEffects, GoogleBooksEffects, UserBooksEffects, VolumesEffects];

export const storeConfig: RootStoreConfig<unknown> = {
  metaReducers,
  runtimeChecks: {
    strictActionTypeUniqueness: isDevMode(),
    strictActionImmutability: isDevMode(),
    strictStateImmutability: isDevMode(),
  },
};

export const routerStoreConfig: StoreRouterConfig = {
  routerState: RouterState.Minimal,
};
