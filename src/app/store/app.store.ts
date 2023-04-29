import { isDevMode } from '@angular/core';
import { MinimalRouterStateSnapshot, routerReducer, RouterReducerState, RouterState, StoreRouterConfig } from '@ngrx/router-store';
import { ActionReducerMap, RootStoreConfig } from '@ngrx/store';

import { metaReducers } from './app.meta-reducers';
import { AuthEffects } from './auth/auth.effects';
import { GoogleBooksEffects } from './google-books/google-books.effects';
import * as fromGoogleBooks from './google-books/google-books.reducer';
import { UserBooksEffects } from './user-books/user-books.effects';
import * as fromUserBooks from './user-books/user-books.reducer';
import { VolumesEffects } from './volume/volume.effects';
import * as fromVolume from './volume/volume.reducer';

interface AppState {
  router: RouterReducerState<MinimalRouterStateSnapshot>;
  [fromGoogleBooks.googleBooksFeatureKey]: fromGoogleBooks.State;
  [fromUserBooks.userBooksFeatureKey]: fromUserBooks.State;
  [fromVolume.volumeFeatureKey]: fromVolume.State;
}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  [fromGoogleBooks.googleBooksFeatureKey]: fromGoogleBooks.reducer,
  [fromUserBooks.userBooksFeatureKey]: fromUserBooks.reducer,
  [fromVolume.volumeFeatureKey]: fromVolume.reducer,
};

export const effects = [AuthEffects, GoogleBooksEffects, UserBooksEffects, VolumesEffects];

export const storeConfig: RootStoreConfig<AppState> = {
  metaReducers,
  runtimeChecks: {
    strictActionTypeUniqueness: isDevMode(),
    strictActionImmutability: isDevMode(),
    strictActionWithinNgZone: isDevMode(),
    strictStateImmutability: isDevMode(),
  },
};

export const routerStoreConfig: StoreRouterConfig = {
  routerState: RouterState.Minimal,
};
