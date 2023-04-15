import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { httpError } from 'src/app/models/error.models';
import { GoogleBooksApiService } from 'src/app/services/__api/google-books-api.service';

import * as GoogleBooksActions from './google-books.actions';

@Injectable()
export class GoogleBooksEffects {
  readonly searchGoogleBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GoogleBooksActions.searchGoogleBooks),
      debounceTime(200),
      switchMap(({ query }) =>
        this.googleBooksApi.list(query).pipe(
          map(list => GoogleBooksActions.searchGoogleBooksSuccess({ list })),
          catchError((err: HttpErrorResponse) => of(GoogleBooksActions.searchGoogleBooksError({ error: httpError({ err }) }))),
        ),
      ),
    );
  });

  constructor(private readonly actions$: Actions, private readonly googleBooksApi: GoogleBooksApiService) {}
}
