import { isDevMode } from '@angular/core';
import { routerReducer, RouterState, StoreRouterConfig } from '@ngrx/router-store';
import { ActionReducerMap, RootStoreConfig } from '@ngrx/store';

import { metaReducers } from './app.meta-reducers';
import { AuthEffects } from './auth/auth.effects';
import { GoogleBooksEffects } from './google-books/google-books.effects';
import { googleBooksFeature } from './google-books/google-books.reducer';
import { UserBooksEffects } from './user-books/user-books.effects';
import { userBooksFeature } from './user-books/user-books.reducer';
import { VolumesEffects } from './volume/volume.effects';
import { volumeFeature } from './volume/volume.reducer';

export const reducers: ActionReducerMap<unknown> = {
  router: routerReducer,
  [googleBooksFeature.name]: googleBooksFeature.reducer,
  [userBooksFeature.name]: userBooksFeature.reducer,
  [volumeFeature.name]: volumeFeature.reducer,
};

export const effects = [AuthEffects, GoogleBooksEffects, UserBooksEffects, VolumesEffects];

export const storeConfig: RootStoreConfig<unknown> = {
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
