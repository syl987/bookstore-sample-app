import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getEntityById } from '../helpers/entity.helpers';
import { RouteParams } from '../models/router.models';
import { selectRouterParams } from '../store/router/router.selectors';

/**
 * Listen for entities by the specified route param. Return `undefined` if none was found.
 */
export function getEntityByRouterParam<T>(store: Store, entityMap$: Observable<Dictionary<T>>, param: keyof RouteParams): Observable<T | undefined> {
  return combineLatest([entityMap$, store.select(selectRouterParams).pipe(map(params => params?.[param]))]).pipe(map(getEntityById));
}
