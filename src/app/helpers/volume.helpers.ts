import { EntityState } from '@ngrx/entity';

import { VolumeDTO } from '../models/volume.models';

export function filterVolumes(query: string, state: EntityState<VolumeDTO>): string[] | number[] {
  // display all results for empty query
  if (!query) {
    return state.ids;
  }
  return (state.ids as any[]).filter(id => state.entities[id]?.volumeInfo.title.toLowerCase().includes(query));
}
