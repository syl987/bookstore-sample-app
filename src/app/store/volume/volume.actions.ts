import { createAction, props } from '@ngrx/store';
import { ResponseError } from 'src/app/models/error.models';
import { VolumesDTO } from 'src/app/models/volume.models';

// TODO stream actions and effect processing

export const loadVolumes = createAction('[Volume] load all');
export const loadVolumesSuccess = createAction('[Volume] load all SUCCESS', props<{ volumes: VolumesDTO }>());
export const loadVolumesError = createAction('[Volume] load all ERROR', props<{ error: ResponseError }>());
