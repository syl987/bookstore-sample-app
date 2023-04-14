import { UserBookDTO } from './book.models';

export interface UserProfileDTO {
  id: string;
  createdAt: number;
  updatedAt: number;
  version: number;

  photoUrl?: string | null;
  displayName: string;
  description: string;
}

export interface UserBooksDTO {
  [bookId: string]: UserBookDTO;
}
