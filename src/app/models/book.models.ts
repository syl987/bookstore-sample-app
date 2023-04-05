import { GoogleBooksVolumeDTO } from './google-books.models';

export interface BookDTO {
  id: string;
  volumeInfo: GoogleBooksVolumeDTO['volumeInfo'];
}
