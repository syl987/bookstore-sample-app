import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ResponseError } from 'src/app/models/error.models';

import { AuthProviderId } from '../../models/auth.models';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'login with provider': props<{ providerId: AuthProviderId }>(),
    'login with provider SUCCESS': emptyProps(),
    'login with provider ERROR': props<{ error: ResponseError }>(),

    'logout': emptyProps(),
    'logout SUCCESS': emptyProps(),
    'logout ERROR': props<{ error: ResponseError }>(),

    'authenticated': emptyProps(),
    'unauthenticated': emptyProps(),

    'auth refresh ERROR': emptyProps(),
    'auth response ERROR': emptyProps(),
    'auth token not found': emptyProps(),
    'auth reset state': emptyProps(),
  },
});
