import { Injectable, Signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { NavigationState, QueryParams, RouteParam, RouteParams, RouteQueryParam } from '../models/router.models';
import * as RouterSelectors from '../store/router/router.selectors';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly url = this.store.selectSignal(RouterSelectors.selectUrl);
  readonly title = this.store.selectSignal(RouterSelectors.selectTitle);
  readonly fragment = this.store.selectSignal(RouterSelectors.selectFragment);

  readonly routeParams: Signal<RouteParams> = this.store.selectSignal(RouterSelectors.selectRouteParams);
  readonly queryParams: Signal<QueryParams> = this.store.selectSignal(RouterSelectors.selectQueryParams);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

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
