import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import * as RouterActions from './router.actions';

@Injectable()
export class RouterEffects {
  readonly navigate = createEffect(
    () => {
      return this.actions.pipe(
        ofType(RouterActions.navigate),
        tap(({ url, state }) => this.router.navigateByUrl(url, { state })),
      );
    },
    { dispatch: false },
  );

  constructor(private readonly actions: Actions, private readonly router: Router) {}
}
