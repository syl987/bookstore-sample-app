import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ResponseError } from 'src/app/models/error.models';
import { VolumeDTO } from 'src/app/models/volume.models';

import * as VolumeActions from './volume.actions';

export const volumesFeatureKey = 'volumes';

export interface State extends EntityState<VolumeDTO> {
  loading: boolean;
  searching: boolean;
  error?: ResponseError;
}

const adapter = createEntityAdapter<VolumeDTO>({
  selectId: entity => entity.id,
  sortComparer: (entity1, entity2) => entity2.id.localeCompare(entity1.id),
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  searching: false,
});

export const reducer = createReducer(
  initialState,
  on(VolumeActions.loadVolume, state => ({ ...state, loading: true, error: undefined })),
  on(VolumeActions.loadVolumeSuccess, (state, { volume }) => adapter.upsertOne(volume, { ...state, loading: false, error: undefined })),
  on(VolumeActions.loadVolumeError, (state, { error }) => ({ ...state, loading: false, error })),
  on(VolumeActions.loadVolumes, state => ({ ...state, loading: true, error: undefined })),
  on(VolumeActions.loadVolumesSuccess, (state, { volumes }) => adapter.upsertMany(volumes, { ...state, loading: false, error: undefined })),
  on(VolumeActions.loadVolumesError, (state, { error }) => ({ ...state, loading: false, error })),
  on(VolumeActions.searchVolumes, state => ({ ...state, searching: true, error: undefined })),
  on(VolumeActions.searchVolumesSuccess, (state, { volumes }) => adapter.upsertMany(volumes, { ...state, searching: false, error: undefined })),
  on(VolumeActions.searchVolumesError, (state, { error }) => ({ ...state, searching: false, error })),
);

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
