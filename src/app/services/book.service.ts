import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { map, Observable, shareReplay } from 'rxjs';

import { BookDTO } from '../models/book.models';
import { EntityType } from '../models/entity.models';
import { GoogleBooksVolumeDTO } from '../models/google-books.models';
import { GoogleBooksApiService } from './api/google-books-api.service';

@Injectable({
    providedIn: 'root',
})
export class BookService extends EntityCollectionServiceBase<BookDTO> {
    constructor(f: EntityCollectionServiceElementsFactory, private readonly googleBooksApi: GoogleBooksApiService) {
        super(EntityType.BOOK, f);
    }

    searchVolumes(query: string): Observable<GoogleBooksVolumeDTO[]> {
        return this.googleBooksApi.list(query).pipe(
            map(({ items }) => items),
            shareReplay(1),
        );
    }
}
