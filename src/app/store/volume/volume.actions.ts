import { createAction, props } from '@ngrx/store';
import { ResponseError } from 'src/app/models/error.models';
import { VolumeDTO } from 'src/app/models/volume.models';

// TODO stream actions and effect processing

export const loadVolumes = createAction('[Volume] load all', props<{ cid: number }>());
export const loadVolumesSuccess = createAction('[Volume] load all SUCCESS', props<{ cid: number; volumes: VolumeDTO[] }>());
export const loadVolumesError = createAction('[Volume] load all ERROR', props<{ cid: number; error: ResponseError }>());
