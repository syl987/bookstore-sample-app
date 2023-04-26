import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
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
          map(list => GoogleBooksActions.searchSuccess({ query, list })),
          catchError((err: HttpErrorResponse) => of(GoogleBooksActions.searchError({ error: httpError({ err }) }))),
        ),
      ),
    );
  });

  constructor(private readonly actions: Actions, private readonly googleBooksApi: GoogleBooksApiService) {}
}
