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
  description?: string;
  imageUrl?: string;
  condition?: BookCondition;
}

export interface UserBookDTO extends BookDTO {
  volume: VolumeDTO;
}

export type UserBookEditDTO = Pick<UserBookDTO, 'condition' | 'description' | 'imageUrl'>;

export interface UserBooksDTO {
  [bookId: string]: UserBookDTO;
}
