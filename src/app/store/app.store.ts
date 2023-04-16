import { PropsFilterFnFactory } from '@ngrx/data';
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

import { AppEntityDataModuleConfig } from '../models/app.models';
import { EntityType } from '../models/entity.models';
import { consoleLogMetaReducer, resetStateMetaReducer } from './app.meta-reducers';
import { resetState } from './auth/auth.actions';
import { AuthEffects } from './auth/auth.effects';
import { EntityToastEffects } from './entity/entity-toast.effects';
import { EntityUndoEffects } from './entity/entity-undo.effects';
import { GoogleBooksEffects } from './google-books/google-books.effects';
import * as fromGoogleBooks from './google-books/google-books.reducer';
import { RouterEffects } from './router/router.effects';

interface AppState {
  router: RouterReducerState<MinimalRouterStateSnapshot>;
  [fromGoogleBooks.googleBooksFeatureKey]: fromGoogleBooks.State;
}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  [fromGoogleBooks.googleBooksFeatureKey]: fromGoogleBooks.reducer,
};

export const entityDataConfig: AppEntityDataModuleConfig = {
  entityMetadata: {
    [EntityType.VOLUME]: {
      selectId: entity => entity.id,
      // sortComparer: stringPropComparerDesc('createdAt'), // TODO add more meta props
      filterFn: PropsFilterFnFactory(['id']), // TODO sub-props?
    },
  },
};

export const effects = [AuthEffects, RouterEffects, GoogleBooksEffects, EntityUndoEffects, EntityToastEffects];

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
