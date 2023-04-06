import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { NavigationState } from '../models/router.models';
import { navigate } from '../store/router/router.actions';
import * as RouterSelectors from '../store/router/router.selectors';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  readonly url$ = this.store.select(RouterSelectors.selectRouterUrl);
  readonly data$ = this.store.select(RouterSelectors.selectRouterData);
  readonly params$ = this.store.select(RouterSelectors.selectRouterParams);
  readonly queryParams$ = this.store.select(RouterSelectors.selectRouterQueryParams);
  readonly fragment$ = this.store.select(RouterSelectors.selectRouterFragment);
  readonly title$ = this.store.select(RouterSelectors.selectRouterTitle);

  readonly navigated$ = this.actions.pipe(
    ofType(routerNavigatedAction),
    map(({ payload }) => payload.event)
  );

  constructor(private readonly store: Store, private readonly actions: Actions) {}

  /**
   * Trigger navigation by URL with an optional state parameter.
   */
  navigate(url: string, state?: NavigationState): void {
    this.store.dispatch(navigate({ url, state }));
  }
}
