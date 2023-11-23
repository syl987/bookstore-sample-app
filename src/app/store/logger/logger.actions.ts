import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ResponseError } from 'src/app/models/error.models';

export const LoggerActions = createActionGroup({
  source: 'Logger',
  events: {
    'log error': props<{ data: object }>(),
    'log error SUCCESS': emptyProps(),
    'log error ERROR': props<{ error: ResponseError }>(),
  },
});
