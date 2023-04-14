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
import { UserBooksEffects } from './user-books/user-books.effects';
import * as fromUserBooks from './user-books/user-books.reducer';

interface AppState {
  router: RouterReducerState<MinimalRouterStateSnapshot>;
  [fromAuth.authFeatureKey]: fromAuth.State;
  [fromGoogleBooks.googleBooksFeatureKey]: fromGoogleBooks.State;
  [fromUserBooks.userBooksFeatureKey]: fromUserBooks.State;
}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  [fromAuth.authFeatureKey]: fromAuth.reducer,
  [fromGoogleBooks.googleBooksFeatureKey]: fromGoogleBooks.reducer,
  [fromUserBooks.userBooksFeatureKey]: fromUserBooks.reducer,
};

export const effects = [AuthEffects, RouterEffects, GoogleBooksEffects, UserBooksEffects];

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
