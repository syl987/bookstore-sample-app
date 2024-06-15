import { Injectable, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { NavigationState, QueryParams, RouteParam, RouteParams, RouteQueryParam } from '../models/router.models';
import * as RouterSelectors from '../store/router/router.selectors';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  readonly url = this.store.selectSignal(RouterSelectors.selectUrl);
  readonly title = this.store.selectSignal(RouterSelectors.selectTitle);
  readonly fragment = this.store.selectSignal(RouterSelectors.selectFragment);

  readonly routeParams: Signal<RouteParams> = this.store.selectSignal(RouterSelectors.selectRouteParams);
  readonly queryParams: Signal<QueryParams> = this.store.selectSignal(RouterSelectors.selectQueryParams);

  constructor(
    private readonly store: Store,
    private readonly router: Router,
  ) {}

  getCurrentNavigationState(): NavigationState {
    return (this.router.getCurrentNavigation()?.extras.state ?? {}) as NavigationState;
  }

  selectRouteParam(param: RouteParam): Observable<string | undefined> {
    return this.store.select(RouterSelectors.selectRouteParam(param));
  }

  selectQueryParam(param: RouteQueryParam): Observable<string | string[] | undefined> {
    return this.store.select(RouterSelectors.selectQueryParam(param));
  }
}
