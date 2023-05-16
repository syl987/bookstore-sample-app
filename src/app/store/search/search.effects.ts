import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class SearchEffects {
  constructor(private readonly actions: Actions) {}
}
