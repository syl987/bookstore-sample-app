import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { switchMap } from 'rxjs';

import { httpError, internalError } from 'src/app/models/error.models';
import { GoogleBooksApiService } from 'src/app/services/__api/google-books-api.service';

import { GoogleBooksActions } from './google-books.actions';

@Injectable()
export class GoogleBooksEffects {
  protected readonly actions = inject(Actions);
  protected readonly googleBooksApi = inject(GoogleBooksApiService);

  readonly search = createEffect(() => {
    return this.actions.pipe(
      ofType(GoogleBooksActions.search),
      switchMap(({ query }) =>
        this.googleBooksApi.list(query, { maxResults: 20 }).pipe(
          mapResponse({
            next: list => GoogleBooksActions.searchSUCCESS({ list }),
            error: (err: unknown) => {
              if (err instanceof HttpErrorResponse) {
                return GoogleBooksActions.searchERROR({ error: httpError({ err }) });
              }
              return GoogleBooksActions.searchERROR({ error: internalError({ err: new Error('Connection Error.') }) });
            },
          }),
        ),
      ),
    );
  });
}
