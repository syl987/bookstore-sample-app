import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { OperationState } from 'src/app/models/store.models';
import { VolumeDTO } from 'src/app/models/volume.models';

import * as VolumeActions from './volume.actions';

export const volumesFeatureKey = 'volumes';

export interface State extends EntityState<VolumeDTO> {
  load: OperationState;
}

const adapter = createEntityAdapter<VolumeDTO>({
  selectId: entity => entity.id,
  sortComparer: (e1, e2) => e2.id.localeCompare(e1.id),
});

export const initialState: State = adapter.getInitialState({
  load: { pending: false },
});

export const reducer = createReducer(
  initialState,
  on(VolumeActions.loadVolume, state => ({
    ...state,
    load: { ...state.load, pending: true, error: undefined },
  })),
  on(VolumeActions.loadVolumeSuccess, (state, { volume }) => ({
    ...adapter.upsertOne(volume, state),
    load: { ...state.load, pending: false, error: undefined },
  })),
  on(VolumeActions.loadVolumeError, (state, { error }) => ({
    ...state,
    load: { ...state.load, pending: false, error },
  })),
  on(VolumeActions.loadVolumes, state => ({
    ...state,
    load: { ...state.load, pending: true, error: undefined },
  })),
  on(VolumeActions.loadVolumesSuccess, (state, { volumes }) => ({
    ...adapter.upsertMany(volumes, state),
    load: { ...state.load, pending: false, error: undefined },
  })),
  on(VolumeActions.loadVolumesError, (state, { error }) => ({
    ...state,
    load: { ...state.load, pending: false, error },
  })),
);

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
