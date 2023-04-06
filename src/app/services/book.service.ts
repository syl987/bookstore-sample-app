import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { createSelector, select } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';

import { getEntityById } from '../helpers/entity.helpers';
import { BookDTO } from '../models/book.models';
import { EntityType } from '../models/entity.models';
import { selectRouterParams } from '../store/router/router.selectors';

const selectKeyByRouterParamId = createSelector(selectRouterParams, params => params?.bookId);

@Injectable({
  providedIn: 'root',
})
export class BookService extends EntityCollectionServiceBase<BookDTO> {
  readonly keyByRouterParamId$ = this.store.pipe(select(selectKeyByRouterParamId));

  readonly entityByRouterParamId$ = combineLatest([this.selectors$.entityMap$, this.keyByRouterParamId$]).pipe(map(getEntityById));

  constructor(f: EntityCollectionServiceElementsFactory) {
    super(EntityType.BOOK, f);
  }
}
