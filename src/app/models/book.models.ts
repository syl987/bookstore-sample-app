import { VolumeDTO } from './volume.models';

export enum BookStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  SOLD = 'SOLD',
}

export enum BookCondition {
  NEW = 'NEW',
  VERY_GOOD = 'VERY_GOOD',
  VISIBLY_USED = 'VISIBLY_USED',
  DAMAGED = 'DAMAGED',
}

export interface BookDTO {
  id: string;
  uid: string;
  status: BookStatus;
  description?: string | null;
  condition?: BookCondition | null;
  imageUrl?: string | null;
  price?: number | null;
}

export interface UserBookDTO extends BookDTO {
  volume: VolumeDTO;
}

export type UserBookEditDraftDTO = Pick<UserBookDTO, 'condition' | 'description' | 'price'>;

export interface UserBooksDTO {
  [bookId: string]: UserBookDTO;
}
