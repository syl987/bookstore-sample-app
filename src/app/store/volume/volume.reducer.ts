import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { notUndefined } from 'src/app/functions/typeguard.functions';
import { filterVolumes } from 'src/app/helpers/volume.helpers';
import { OperationState } from 'src/app/models/store.models';
import { VolumeDTO } from 'src/app/models/volume.models';

import { selectRouteParam } from '../router/router.selectors';
import { SearchActions } from '../search/search.actions';
import { VolumeActions } from './volume.actions';

export const volumeFeatureKey = 'volumes';

export interface State extends EntityState<VolumeDTO> {
  filteredIds: string[] | number[];
  load: OperationState;
}

const adapter = createEntityAdapter<VolumeDTO>({
  selectId: entity => entity.id,
  sortComparer: (e1, e2) => e2.id.localeCompare(e1.id),
});

const initialState: State = adapter.getInitialState({
  filteredIds: [],
  load: { pending: false },
});

export const reducer = createReducer(
  initialState,
  on(VolumeActions.load, state => ({
    ...state,
    load: { ...state.load, pending: true, error: undefined },
  })),
  on(VolumeActions.loadSUCCESS, (state, { volume }) => ({
    ...adapter.upsertOne(volume, state),
    load: { ...state.load, pending: false, error: undefined },
  })),
  on(VolumeActions.loadERROR, (state, { error }) => ({
    ...state,
    load: { ...state.load, pending: false, error },
  })),
  on(VolumeActions.loadAll, state => ({
    ...state,
    load: { ...state.load, pending: true, error: undefined },
  })),
  on(VolumeActions.loadAllSUCCESS, (state, { volumes }) => ({
    ...adapter.upsertMany(volumes, state),
    load: { ...state.load, pending: false, error: undefined },
  })),
  on(VolumeActions.loadAllERROR, (state, { error }) => ({
    ...state,
    load: { ...state.load, pending: false, error },
  })),
  on(SearchActions.applyFilterINTERNAL, (state, { query }) => ({
    ...state,
    filteredIds: filterVolumes(query, state),
  })),
  on(SearchActions.filter, (state, { query }) => ({
    ...state,
    filteredIds: filterVolumes(query, state),
  })),
);

export const volumeFeature = createFeature({
  name: volumeFeatureKey,
  reducer,
  extraSelectors: ({ selectVolumesState, selectEntities, selectFilteredIds, selectLoad }) => ({
    selectAll: createSelector(selectVolumesState, adapter.getSelectors().selectAll),
    selectEntities: createSelector(selectVolumesState, adapter.getSelectors().selectEntities),
    selectIds: createSelector(selectVolumesState, adapter.getSelectors().selectIds),
    selectTotal: createSelector(selectVolumesState, adapter.getSelectors().selectTotal),

    selectAllFiltered: createSelector(selectEntities, selectFilteredIds, (entities, ids) => ids.map(id => entities[id]).filter(notUndefined)),

    selectByRoute: createSelector(selectEntities, selectRouteParam('volumeId'), (entities, id) => (id ? entities[id] : undefined)),

    selectLoadPending: createSelector(selectLoad, ({ pending }) => pending),
    selectLoadError: createSelector(selectLoad, ({ error }) => error),
  }),
});
