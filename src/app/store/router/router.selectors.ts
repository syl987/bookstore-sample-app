import { getRouterSelectors } from '@ngrx/router-store';
import { MemoizedSelector } from '@ngrx/store';

// bugfix: casting selector types because router state is initially undefined

export const selectUrl = getRouterSelectors().selectUrl as MemoizedSelector<object, string | undefined>;

export const { selectTitle, selectFragment, selectRouteParam, selectQueryParam } = getRouterSelectors();
