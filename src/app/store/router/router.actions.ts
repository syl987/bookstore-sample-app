import { createAction, props } from '@ngrx/store';
import { NavigationState } from 'src/app/models/router.models';

export const navigate = createAction('[Router] navigate', props<{ url: string; state?: NavigationState }>());
