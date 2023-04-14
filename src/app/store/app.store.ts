import {
  MinimalRouterStateSnapshot,
  NavigationActionTiming,
  routerReducer,
  RouterReducerState,
  RouterState,
  StoreRouterConfig,
} from '@ngrx/router-store';
import { ActionReducerMap, RootStoreConfig } from '@ngrx/store';
import { environment } from 'src/environments/environment';

import { consoleLogMetaReducer, resetStateMetaReducer } from './app.meta-reducers';
import { resetState } from './auth/auth.actions';
import { AuthEffects } from './auth/auth.effects';
import * as fromAuth from './auth/auth.reducer';
import { GoogleBooksEffects } from './google-books/google-books.effects';
import * as fromGoogleBooks from './google-books/google-books.reducer';
import { RouterEffects } from './router/router.effects';

interface AppState {
  router: RouterReducerState<MinimalRouterStateSnapshot>;
  [fromAuth.authFeatureKey]: fromAuth.State;
  [fromGoogleBooks.googleBooksFeatureKey]: fromGoogleBooks.State;
}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  [fromAuth.authFeatureKey]: fromAuth.reducer,
  [fromGoogleBooks.googleBooksFeatureKey]: fromGoogleBooks.reducer,
};

export const effects = [AuthEffects, GoogleBooksEffects, RouterEffects];

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
