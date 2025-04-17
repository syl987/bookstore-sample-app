import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

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
        this.googleBooksApi.list(query).pipe(
          map(list => GoogleBooksActions.searchSUCCESS({ query, list })),
          catchError((err: unknown) => {
            if (err instanceof HttpErrorResponse) {
              return of(GoogleBooksActions.searchERROR({ error: httpError({ err }) }));
            }
            return of(GoogleBooksActions.searchERROR({ error: internalError({ err: new Error('Connection Error.') }) }));
          }),
        ),
      ),
    );
  });
}
