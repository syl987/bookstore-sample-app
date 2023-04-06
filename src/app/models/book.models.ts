export enum BookStatus {
  DRAFT = 'DRAFT',
  PUBLIC = 'PUBLIC',
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
  sellerUid: string;
  status: BookStatus;
  description?: string;
  imageUrl?: string;
  condition?: BookCondition;
}
