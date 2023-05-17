import { createActionGroup, props } from '@ngrx/store';
import { ResponseError } from 'src/app/models/error.models';
import { GoogleBooksListDTO } from 'src/app/models/google-books.models';

export const GoogleBooksActions = createActionGroup({
  source: 'GoogleBooks',
  events: {
    'search': props<{ query: string }>(),
    'search SUCCESS': props<{ query: string; list: GoogleBooksListDTO }>(),
    'search ERROR': props<{ error: ResponseError }>(),
  },
});
