import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { RouteParam, RouteQueryParam } from '../models/router.models';
import * as RouterSelectors from '../store/router/router.selectors';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  readonly url$ = this.store.select(RouterSelectors.selectUrl);
  readonly title$ = this.store.select(RouterSelectors.selectTitle);
  readonly fragment$ = this.store.select(RouterSelectors.selectFragment);

  constructor(private readonly store: Store) {}

  selectRouteParam(param: RouteParam): Observable<string | undefined> {
    return this.store.select(RouterSelectors.selectRouteParam(param));
  }

  selectQueryParam(param: RouteQueryParam): Observable<string | undefined> {
    return this.store.select(RouterSelectors.selectQueryParam(param));
  }
}
