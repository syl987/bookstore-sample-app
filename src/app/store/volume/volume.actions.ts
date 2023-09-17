import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserBookDTO } from 'src/app/models/book.models';
import { ResponseError } from 'src/app/models/error.models';
import { VolumeDTO } from 'src/app/models/volume.models';

export const VolumeActions = createActionGroup({
  source: 'Volume',
  events: {
    'load': props<{ id: string }>(),
    'load SUCCESS': props<{ volume: VolumeDTO }>(),
    'load ERROR': props<{ error: ResponseError }>(),

    'load all': emptyProps(),
    'load all SUCCESS': props<{ volumes: VolumeDTO[] }>(),
    'load all ERROR': props<{ error: ResponseError }>(),

    'apply filter INTERNAL': emptyProps(),

    'filter': props<{ query: string }>(),

    'buy offer': props<{ id: string; offerId: string }>(),
    'buy offer SUCCESS': props<{ volume: VolumeDTO; book: UserBookDTO }>(),
    'buy offer ERROR': props<{ error: ResponseError }>(),
  },
});
