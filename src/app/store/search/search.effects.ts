import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import { VolumeActions } from '../volume/volume.actions';
import { SearchActions } from './search.actions';

@Injectable()
export class SearchEffects {
  readonly filterOnLoadSuccess = createEffect(() => {
    return this.actions.pipe(
      ofType(VolumeActions.loadAllSuccess),
      map(_ => SearchActions.filter({ query: '' })),
    );
  });

  constructor(private readonly actions: Actions) {}
}
