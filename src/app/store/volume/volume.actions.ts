import { createAction, props } from '@ngrx/store';
import { ResponseError } from 'src/app/models/error.models';
import { VolumeDTO } from 'src/app/models/volume.models';

export const loadVolume = createAction('[Volume] load', props<{ id: string }>());
export const loadVolumeSuccess = createAction('[Volume] load SUCCESS', props<{ volume: VolumeDTO }>());
export const loadVolumeError = createAction('[Volume] load ERROR', props<{ error: ResponseError }>());

export const loadVolumes = createAction('[Volume] load all');
export const loadVolumesSuccess = createAction('[Volume] load all SUCCESS', props<{ volumes: VolumeDTO[] }>());
export const loadVolumesError = createAction('[Volume] load all ERROR', props<{ error: ResponseError }>());

export const filterVolumes = createAction('[Volume] filter', props<{ query: string }>());
