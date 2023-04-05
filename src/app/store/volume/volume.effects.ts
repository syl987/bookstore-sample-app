import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { httpError } from 'src/app/models/error.models';
import { GoogleBooksApiService } from 'src/app/services/__api/google-books-api.service';

import * as VolumeActions from './volume.actions';

@Injectable()
export class VolumeEffects {
  readonly searchVolumes$ = this.actions$.pipe(
    ofType(VolumeActions.searchVolumes),
    debounceTime(200),
    switchMap(({ query }) =>
      this.googleBooksApi.list(query).pipe(
        map(({ items }) => VolumeActions.searchVolumesSuccess({ items })),
        catchError((err: HttpErrorResponse) => of(VolumeActions.searchVolumesError({ error: httpError({ error: err }) })))
      )
    )
  );

  constructor(private readonly actions$: Actions, private readonly googleBooksApi: GoogleBooksApiService) {}
}
