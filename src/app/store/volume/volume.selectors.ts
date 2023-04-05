import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromVolume from './volume.reducer';

const selectVolumeState = createFeatureSelector<fromVolume.State>('volumes');

export const selectVolumeAll = createSelector(selectVolumeState, fromVolume.selectAll);
export const selectVolumeEntities = createSelector(selectVolumeState, fromVolume.selectEntities);
export const selectVolumeIds = createSelector(selectVolumeState, fromVolume.selectIds);
export const selectVolumeTotal = createSelector(selectVolumeState, fromVolume.selectTotal);

export const selectVolumeSearchPending = createSelector(selectVolumeState, ({ searchPending }) => searchPending);
export const selectVolumeSearchError = createSelector(selectVolumeState, ({ searchError }) => searchError);
