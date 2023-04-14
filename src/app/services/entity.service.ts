import { Injectable } from '@angular/core';
import { Database } from '@angular/fire/database';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';

import { GoogleBooksVolumeDTO } from '../models/google-books.models';
import { VolumeDTO } from '../models/volume.models';

interface IEntityService {
  /** Stream of volumes with published books by search params. */
  readonly volumesWithPublishedBooks$: Observable<VolumeDTO[]>;
  /** Stream of volumes with bought books. */
  readonly volumesWithBoughtBooks$: Observable<VolumeDTO[]>;
  /** Stream of volumes with user books. */
  readonly volumesWithUserBooks$: Observable<VolumeDTO[]>;
  /** Stream of a volume with books by router volume id. */
  readonly volume$: Observable<VolumeDTO>;
  /** Stream of a book with volume data by user id and router book id. */
  readonly book$: Observable<VolumeDTO>;
  /** Apply search params to the stream of volumes with published books. */
  searchVolumes(params?: unknown): Observable<void>;
  /** Create a new volume from google books if missing and add a new book with initial data to it. */
  createBook(volume: GoogleBooksVolumeDTO): Observable<void>;
  /** Edit specific data of a book before publishing. Returns the volume containing the book. */
  editBook(volumeId: string, id: string, data: unknown): Observable<VolumeDTO>;
  /** Delete a book. Delete the volume if not containing any books. */
  deleteBook(volumeId: string, id: string): Observable<void>;
  /** Publish a book. */
  publishBook(volumeId: string, id: string): Observable<void>;
  /** Buy a book. */
  buyBook(volumeId: string, id: string): Observable<void>;
}

@Injectable({
  providedIn: 'root',
})
export class EntityService implements IEntityService {
  readonly volumesWithPublishedBooks$: Observable<VolumeDTO[]> = EMPTY;

  readonly volumesWithBoughtBooks$: Observable<VolumeDTO[]> = EMPTY;

  readonly volumesWithUserBooks$: Observable<VolumeDTO[]> = EMPTY;

  readonly volume$: Observable<VolumeDTO> = EMPTY;

  readonly book$: Observable<VolumeDTO> = EMPTY;

  constructor(private readonly store: Store, private readonly database: Database, private readonly storage: Storage) {}

  searchVolumes(params?: unknown): Observable<void> {
    throw new Error('Method not implemented.');
  }
  createBook(volume: GoogleBooksVolumeDTO): Observable<void> {
    throw new Error('Method not implemented.');
  }
  editBook(volumeId: string, id: string, data: unknown): Observable<VolumeDTO> {
    throw new Error('Method not implemented.');
  }
  deleteBook(volumeId: string, id: string): Observable<void> {
    throw new Error('Method not implemented.');
  }
  publishBook(volumeId: string, id: string): Observable<void> {
    throw new Error('Method not implemented.');
  }
  buyBook(volumeId: string, id: string): Observable<void> {
    throw new Error('Method not implemented.');
  }
}
