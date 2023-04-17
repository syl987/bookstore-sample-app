import { createFeatureSelector, createSelector } from '@ngrx/store';

import { selectRouterParams } from '../router/router.selectors';
import * as fromVolumes from './volume.reducer';

const selectVolumesState = createFeatureSelector<fromVolumes.State>('volumes');

export const selectVolumesAll = createSelector(selectVolumesState, fromVolumes.selectAll);
export const selectVolumesEntities = createSelector(selectVolumesState, fromVolumes.selectEntities);
export const selectVolumesIds = createSelector(selectVolumesState, fromVolumes.selectIds);
export const selectVolumesTotal = createSelector(selectVolumesState, fromVolumes.selectTotal);

export const selectVolumeByRoute = createSelector(selectVolumesEntities, selectRouterParams, (entities, params) =>
  params?.volumeId ? entities[params.volumeId] : undefined,
);

export const selectVolumesSearching = createSelector(selectVolumesState, ({ searching }) => searching);
export const selectVolumesLoading = createSelector(selectVolumesState, ({ loading }) => loading);
export const selectVolumesError = createSelector(selectVolumesState, ({ error }) => error);
