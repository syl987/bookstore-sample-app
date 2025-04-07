import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { NavigationState, QueryParams, RouteParam, RouteParams, RouteQueryParam } from '../models/router.models';
import { getRouterSelectors } from '@ngrx/router-store';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  protected readonly store = inject(Store);
  protected readonly router = inject(Router);

  readonly url = this.store.selectSignal<string | undefined>(getRouterSelectors().selectUrl);
  readonly title = this.store.selectSignal(getRouterSelectors().selectTitle);
  readonly fragment = this.store.selectSignal(getRouterSelectors().selectFragment);

  readonly routeParams = this.store.selectSignal<RouteParams>(getRouterSelectors().selectRouteParams);
  readonly queryParams = this.store.selectSignal<QueryParams>(getRouterSelectors().selectQueryParams);

  getCurrentNavigationState(): NavigationState {
    return (this.router.getCurrentNavigation()?.extras.state ?? {}) as NavigationState;
  }

  selectRouteParam(param: RouteParam): Observable<string | undefined> {
    return this.store.select(getRouterSelectors().selectRouteParam(param));
  }

  selectQueryParam(param: RouteQueryParam): Observable<string | string[] | undefined> {
    return this.store.select(getRouterSelectors().selectQueryParam(param));
  }
}
