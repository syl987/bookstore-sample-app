import { createAction, props } from '@ngrx/store';
import { ResponseError } from 'src/app/models/error.models';
import { GoogleBooksVolumeDTO } from 'src/app/models/google-books.models';

export const searchVolumes = createAction('[Volume] search', props<{ query: string }>());
export const searchVolumesSuccess = createAction('[Volume] search SUCCESS', props<{ items: GoogleBooksVolumeDTO[] }>());
export const searchVolumesError = createAction('[Volume] search ERROR', props<{ error: ResponseError }>());
