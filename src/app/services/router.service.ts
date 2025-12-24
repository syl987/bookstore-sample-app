import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { getRouterSelectors } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { NavigationState, QueryParams, RouteParams } from '../models/router.models';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  protected readonly store = inject(Store);
  protected readonly router = inject(Router);

  readonly url$ = this.store.select<string | undefined>(getRouterSelectors().selectUrl);
  readonly title$ = this.store.select(getRouterSelectors().selectTitle);
  readonly fragment$ = this.store.select(getRouterSelectors().selectFragment);

  readonly routeParams$ = this.store.select<RouteParams>(getRouterSelectors().selectRouteParams);
  readonly queryParams$ = this.store.select<QueryParams>(getRouterSelectors().selectQueryParams);

  getCurrentNavigationState(): NavigationState {
    return (this.router.currentNavigation()?.extras.state ?? {}) as NavigationState;
  }
}
