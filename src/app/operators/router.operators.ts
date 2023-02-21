import { Data } from '@angular/router';
import { RouterNavigatedAction, RouterNavigationAction, RouterRequestAction } from '@ngrx/router-store';
import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

import { collectActivatedRouteSnapshotData, getActivatedRouteSnapshotFragment } from '../helpers/router.helpers';
import { RouteParams, RouteQueryParams } from '../models/router.models';

/**
 * Map a navigation action to the router state `url`. Does not support nested routes.
 */
export function getRouterActionByUrl(): OperatorFunction<RouterRequestAction | RouterNavigationAction | RouterNavigatedAction, string> {
    return map(({ payload }) => payload.routerState.url);
}

/**
 * Map a navigation action to the router state `data`. Does not support nested routes.
 */
export function getRouterActionByData(): OperatorFunction<RouterRequestAction | RouterNavigationAction | RouterNavigatedAction, Data> {
    return map(({ payload }) => collectActivatedRouteSnapshotData(payload.routerState.root, ({ data }) => data));
}

/**
 * Map a navigation action to the router state `params`. Does not support nested routes.
 */
export function getRouterActionParams(): OperatorFunction<RouterRequestAction | RouterNavigationAction | RouterNavigatedAction, RouteParams> {
    return map(({ payload }) => collectActivatedRouteSnapshotData(payload.routerState.root, ({ params }) => params));
}

/**
 * Map a navigation action to the router state `queryParams`. Does not support nested routes.
 */
export function getRouterActionQueryParams(): OperatorFunction<RouterRequestAction | RouterNavigationAction | RouterNavigatedAction, RouteQueryParams> {
    return map(({ payload }) => collectActivatedRouteSnapshotData(payload.routerState.root, ({ queryParams }) => queryParams));
}

/**
 * Map a navigation action to the router state `fragment`. Does not support nested routes.
 */
export function getRouterActionByFragment(): OperatorFunction<RouterRequestAction | RouterNavigationAction | RouterNavigatedAction, string | null> {
    return map(({ payload }) => getActivatedRouteSnapshotFragment(payload.routerState.root));
}
