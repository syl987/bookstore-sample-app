import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

import { EntityType } from '../../models/entity.models';
import { VolumeDTO } from '../../models/volume.models';

@Injectable({
  providedIn: 'root',
})
export class VolumeCollectionService extends EntityCollectionServiceBase<VolumeDTO> {
  constructor(f: EntityCollectionServiceElementsFactory) {
    super(EntityType.VOLUME, f);
  }
}
