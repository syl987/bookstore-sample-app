import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ResponseError } from 'src/app/models/error.models';
import { GoogleBooksVolumeDTO } from 'src/app/models/google-books.models';

import * as VolumeActions from './volume.actions';

export const volumeFeatureKey = 'volumes';

export interface State extends EntityState<GoogleBooksVolumeDTO> {
  searchPending: boolean;
  searchError?: ResponseError;
}

const adapter = createEntityAdapter<GoogleBooksVolumeDTO>({
  selectId: item => item.id,
});

export const initialState: State = adapter.getInitialState({
  searchPending: false,
});

export const reducer = createReducer(
  initialState,
  on(VolumeActions.searchVolumes, state => ({
    ...state,
    searchPending: true,
    searchError: undefined,
  })),
  on(VolumeActions.searchVolumesSuccess, (state, { items }) =>
    adapter.setAll(items, {
      ...state,
      searchPending: false,
      searchError: undefined,
    })
  ),
  on(VolumeActions.searchVolumesError, (state, { error }) => ({
    ...state,
    searchPending: false,
    searchError: error,
  }))
);

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
