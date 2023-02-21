import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

import { CarDTO } from '../models/car.models';
import { EntityType } from '../models/entity.models';

@Injectable({
    providedIn: 'root',
})
export class CarService extends EntityCollectionServiceBase<CarDTO> {
    constructor(f: EntityCollectionServiceElementsFactory) {
        super(EntityType.CAR, f);
    }
}
