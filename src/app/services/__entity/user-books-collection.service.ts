import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { UserBookDTO } from 'src/app/models/book.models';

import { EntityType } from '../../models/entity.models';

@Injectable({
  providedIn: 'root',
})
export class UserBooksCollectionService extends EntityCollectionServiceBase<UserBookDTO> {
  constructor(f: EntityCollectionServiceElementsFactory) {
    super(EntityType.USER_BOOKS, f);
  }
}
