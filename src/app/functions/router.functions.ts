import { Router } from '@angular/router';

import { NavigationState } from '../models/router.models';

/**
 * Get navigation extras - navigation state value by key.
 */
export function getNavigationStateValue<T extends keyof NavigationState>(router: Router, key: T): NavigationState[T] | undefined {
  return router.currentNavigation()?.extras.state?.[key];
}

/**
 * Get navigation extras - navigation query param by key.
 */
export function getNavigationQueryParams(router: Router, key: string): any {
  return router.currentNavigation()?.extras.queryParams?.[key];
}

/**
 * Get navigation extras - navigation fragment.
 */
export function getNavigationFragment(router: Router): string | undefined {
  return router.currentNavigation()?.extras.fragment;
}
