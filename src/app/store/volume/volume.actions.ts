import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ResponseError } from 'src/app/models/error.models';
import { VolumeDTO } from 'src/app/models/volume.models';

export const volumeActions = createActionGroup({
  source: 'Volume',
  events: {
    'load': props<{ id: string }>(),
    'load SUCCESS': props<{ volume: VolumeDTO }>(),
    'load ERROR': props<{ error: ResponseError }>(),

    'load all': emptyProps(),
    'load all SUCCESS': props<{ volumes: VolumeDTO[] }>(),
    'load all ERROR': props<{ error: ResponseError }>(),

    'filter': props<{ query: string }>(),
  },
});
