import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { getRouterSelectors } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { NavigationState, QueryParam, RouteParam } from '../models/router.models';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  protected readonly store = inject(Store);
  protected readonly router = inject(Router);

  readonly url$ = this.store.select<string | undefined>(getRouterSelectors().selectUrl); // fix type on startup
  readonly title$ = this.store.select(getRouterSelectors().selectTitle);
  readonly fragment$ = this.store.select(getRouterSelectors().selectFragment);

  readonly params$ = Object.freeze<Record<RouteParam, Observable<string | undefined>>>({
    bookId: this.store.select(getRouterSelectors().selectRouteParam('bookId')),
    offerId: this.store.select(getRouterSelectors().selectRouteParam('offerId')),
    volumeId: this.store.select(getRouterSelectors().selectRouteParam('volumeId')),
  });

  readonly queryParams$ = Object.freeze<Record<QueryParam, Observable<string | undefined>>>({});

  getCurrentNavigationState(): NavigationState {
    return (this.router.currentNavigation()?.extras.state ?? {}) as NavigationState;
  }
}
