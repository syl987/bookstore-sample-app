import { Data } from '@angular/router';
import { getRouterSelectors, MinimalRouterStateSnapshot, RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import { RouteParams, RouteQueryParams } from 'src/app/models/router.models';

const selectRouterState = createFeatureSelector<RouterReducerState<MinimalRouterStateSnapshot>>('router');

// bugfix: casting to undefined because the router state is initially undefined

export const selectRouterUrl = getRouterSelectors(selectRouterState).selectUrl as MemoizedSelector<object, string | undefined>;
export const selectRouterData = getRouterSelectors(selectRouterState).selectRouteData as MemoizedSelector<object, Data | undefined>;
export const selectRouterParams = getRouterSelectors(selectRouterState).selectRouteParams as MemoizedSelector<object, RouteParams | undefined>; // enhancement: typed params
export const selectRouterQueryParams = getRouterSelectors(selectRouterState).selectQueryParams as MemoizedSelector<object, RouteQueryParams | undefined>; // enhancement: typed query params
export const selectRouterFragment = getRouterSelectors(selectRouterState).selectFragment;
export const selectRouterTitle = getRouterSelectors(selectRouterState).selectTitle;
