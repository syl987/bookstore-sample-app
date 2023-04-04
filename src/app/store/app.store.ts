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
import { consoleLogMetaReducer } from './app.meta-reducers';
import { AuthEffects } from './auth/auth.effects';
import * as fromAuth from './auth/auth.reducer';
import { EntityToastEffects } from './entity/entity-toast.effects';
import { EntityUndoEffects } from './entity/entity-undo.effects';
import { RouterEffects } from './router/router.effects';

interface AppState {
  router: RouterReducerState<MinimalRouterStateSnapshot>;
  [fromAuth.authFeatureKey]: fromAuth.State;
}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  [fromAuth.authFeatureKey]: fromAuth.reducer,
};

export const entityDataConfig: AppEntityDataModuleConfig = {
  entityMetadata: {
    [EntityType.BOOK_ARTICLE]: {
      selectId: entity => entity.id,
      // sortComparer: stringPropComparerDesc('createdAt'), // TODO add more meta props
      filterFn: PropsFilterFnFactory(['id']), // TODO sub-props?
    },
  },
};

export const effects = [AuthEffects, RouterEffects, EntityUndoEffects, EntityToastEffects];

export const storeConfig: RootStoreConfig<AppState> = {
  metaReducers: environment.production ? [] : [consoleLogMetaReducer],
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
