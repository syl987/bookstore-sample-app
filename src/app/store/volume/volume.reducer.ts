import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ResponseError } from 'src/app/models/error.models';
import { VolumeDTO } from 'src/app/models/volume.models';

import * as VolumeActions from './volume.actions';

export const volumesFeatureKey = 'volumes';

export interface State extends EntityState<VolumeDTO> {
  pending: boolean;
  error?: ResponseError;
}

const adapter = createEntityAdapter<VolumeDTO>({
  selectId: entity => entity.id,
  sortComparer: (entity1, entity2) => entity2.id.localeCompare(entity1.id),
});

export const initialState: State = adapter.getInitialState({
  pending: false,
});

export const reducer = createReducer(
  initialState,
  on(VolumeActions.loadVolumes, state => ({ ...state, pending: true, error: undefined })),
  on(VolumeActions.loadVolumesSuccess, state => ({ ...state, pending: false, error: undefined })),
  on(VolumeActions.loadVolumesError, (state, { error }) => ({ ...state, pending: false, error })),

  on(VolumeActions.loadVolumesSuccess, (state, { volumes }) => adapter.upsertMany(Object.values(volumes), state)),
);

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
