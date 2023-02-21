import { Data } from '@angular/router';
import { getSelectors, MinimalRouterStateSnapshot, RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import { RouteParams, RouteQueryParams } from 'src/app/models/router.models';

const selectRouterState = createFeatureSelector<RouterReducerState<MinimalRouterStateSnapshot>>('router');

// bugfix: casting to undefined because the router state is initially undefined

export const selectRouterUrl = getSelectors(selectRouterState).selectUrl as MemoizedSelector<object, string | undefined>;
export const selectRouterData = getSelectors(selectRouterState).selectRouteData as MemoizedSelector<object, Data | undefined>;
export const selectRouterParams = getSelectors(selectRouterState).selectRouteParams as MemoizedSelector<object, RouteParams | undefined>; // enhancement: typed params
export const selectRouterQueryParams = getSelectors(selectRouterState).selectQueryParams as MemoizedSelector<object, RouteQueryParams | undefined>; // enhancement: typed query params
export const selectRouterFragment = getSelectors(selectRouterState).selectFragment as MemoizedSelector<object, string | undefined>;
export const selectRouterTitle = getSelectors(selectRouterState).selectTitle as MemoizedSelector<object, string | undefined>;
