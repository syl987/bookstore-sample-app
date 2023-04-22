import { createAction, props } from '@ngrx/store';
import { ResponseError } from 'src/app/models/error.models';
import { GoogleBooksListDTO } from 'src/app/models/google-books.models';

export const searchGoogleBooks = createAction('[GoogleBooks] search', props<{ query: string }>());
export const searchGoogleBooksSuccess = createAction('[GoogleBooks] search SUCCESS', props<{ query: string; list: GoogleBooksListDTO }>());
export const searchGoogleBooksError = createAction('[GoogleBooks] search ERROR', props<{ error: ResponseError }>());
