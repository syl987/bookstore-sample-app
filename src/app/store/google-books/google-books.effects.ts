import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { httpError } from 'src/app/models/error.models';
import { GoogleBooksApiService } from 'src/app/services/__api/google-books-api.service';

import { GoogleBooksActions } from './google-books.actions';

@Injectable()
export class GoogleBooksEffects {
  readonly search = createEffect(() => {
    return this.actions.pipe(
      ofType(GoogleBooksActions.search),
      switchMap(({ query }) =>
        this.googleBooksApi.list(query).pipe(
          map(list => GoogleBooksActions.searchSUCCESS({ query, list })),
          catchError((err: HttpErrorResponse) => of(GoogleBooksActions.searchERROR({ error: httpError({ err }) }))),
        ),
      ),
    );
  });

  constructor(
    private readonly actions: Actions,
    private readonly googleBooksApi: GoogleBooksApiService,
  ) {}
}
