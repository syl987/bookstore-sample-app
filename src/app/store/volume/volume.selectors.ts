import { createFeatureSelector, createSelector } from '@ngrx/store';
import { notUndefined } from 'src/app/functions/typeguard.functions';

import { selectRouterParams } from '../router/router.selectors';
import * as fromVolumes from './volume.reducer';

const selectVolumesState = createFeatureSelector<fromVolumes.State>('volumes');

export const selectVolumesAll = createSelector(selectVolumesState, fromVolumes.selectAll);
export const selectVolumesEntities = createSelector(selectVolumesState, fromVolumes.selectEntities);
export const selectVolumesIds = createSelector(selectVolumesState, fromVolumes.selectIds);
export const selectVolumesTotal = createSelector(selectVolumesState, fromVolumes.selectTotal);

export const selectVolumesFilterIds = createSelector(selectVolumesState, ({ filter }) => filter.ids);
export const selectVolumesFilterQuery = createSelector(selectVolumesState, ({ filter }) => filter.query);

export const selectVolumesFiltered = createSelector(selectVolumesEntities, selectVolumesFilterIds, (entities, ids) =>
  ids.map(id => entities[id]).filter(notUndefined),
);

export const selectVolumeByRoute = createSelector(selectVolumesEntities, selectRouterParams, (entities, params) =>
  params?.volumeId ? entities[params.volumeId] : undefined,
);

export const selectVolumesLoadPending = createSelector(selectVolumesState, ({ load }) => load.pending);
export const selectVolumesLoadError = createSelector(selectVolumesState, ({ load }) => load.error);
