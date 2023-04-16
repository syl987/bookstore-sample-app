import { MinimalRouterStateSnapshot, NavigationActionTiming, routerReducer, RouterReducerState, RouterState, StoreRouterConfig } from '@ngrx/router-store';
import { ActionReducerMap, RootStoreConfig } from '@ngrx/store';
import { environment } from 'src/environments/environment';

import { consoleLogMetaReducer, resetStateMetaReducer } from './app.meta-reducers';
import { resetState } from './auth/auth.actions';
import { AuthEffects } from './auth/auth.effects';
import { GoogleBooksEffects } from './google-books/google-books.effects';
import * as fromGoogleBooks from './google-books/google-books.reducer';
import { RouterEffects } from './router/router.effects';
import { UserBooksEffects } from './user-books/user-books.effects';
import * as fromUserBooks from './user-books/user-books.reducer';
import { VolumesEffects } from './volume/volume.effects';
import * as fromVolume from './volume/volume.reducer';

interface AppState {
  router: RouterReducerState<MinimalRouterStateSnapshot>;
  [fromGoogleBooks.googleBooksFeatureKey]: fromGoogleBooks.State;
  [fromUserBooks.userBooksFeatureKey]: fromUserBooks.State;
  [fromVolume.volumesFeatureKey]: fromVolume.State;
}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  [fromGoogleBooks.googleBooksFeatureKey]: fromGoogleBooks.reducer,
  [fromUserBooks.userBooksFeatureKey]: fromUserBooks.reducer,
  [fromVolume.volumesFeatureKey]: fromVolume.reducer,
};

export const effects = [AuthEffects, RouterEffects, GoogleBooksEffects, UserBooksEffects, VolumesEffects];

export const storeConfig: RootStoreConfig<AppState> = {
  metaReducers: [resetStateMetaReducer(resetState.type), consoleLogMetaReducer],
  runtimeChecks: {
    strictActionTypeUniqueness: !environment.production,
    strictActionImmutability: !environment.production,
    strictActionSerializability: false,
    strictActionWithinNgZone: !environment.production,
    strictStateImmutability: !environment.production,
    strictStateSerializability: false, // angular fire auth guard uses functions as route data
  },
};

export const routerStoreConfig: StoreRouterConfig = {
  routerState: RouterState.Minimal,
  navigationActionTiming: NavigationActionTiming.PostActivation,
};
