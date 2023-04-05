import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { createSelector, select } from '@ngrx/store';
import { combineLatest, map, Observable, shareReplay } from 'rxjs';

import { getEntityById } from '../helpers/entity.helpers';
import { BookDTO } from '../models/book.models';
import { EntityType } from '../models/entity.models';
import { GoogleBooksVolumeDTO } from '../models/google-books.models';
import { selectRouterParams } from '../store/router/router.selectors';
import { GoogleBooksApiService } from './__api/google-books-api.service';

const selectKeyByRouterParamId = createSelector(selectRouterParams, params => params?.bookId);

@Injectable({
  providedIn: 'root',
})
export class BookService extends EntityCollectionServiceBase<BookDTO> {
  readonly keyByRouterParamId$ = this.store.pipe(select(selectKeyByRouterParamId));

  readonly entityByRouterParamId$ = combineLatest([this.selectors$.entityMap$, this.keyByRouterParamId$]).pipe(map(getEntityById));

  constructor(f: EntityCollectionServiceElementsFactory, private readonly googleBooksApi: GoogleBooksApiService) {
    super(EntityType.BOOK_ARTICLE, f);
  }

  searchVolumes(query: string): Observable<GoogleBooksVolumeDTO[]> {
    return this.googleBooksApi.list(query).pipe(
      map(({ items }) => items),
      shareReplay(1)
    );
  }
}
