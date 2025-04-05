import { Injectable, inject } from '@angular/core';
import { deleteObject, getDownloadURL, listAll, ref, Storage, uploadBytes, uploadBytesResumable } from '@angular/fire/storage';
import { concatMap, from, map, Observable, of, retry, startWith } from 'rxjs';
import { toFirebaseUploadDataWithProgress } from 'src/app/helpers/firebase.helpers';
import { FirebaseUploadData, FirebaseUploadDataWithProgress, FirebaseUploadRequestMetadata } from 'src/app/models/firebase.models';

@Injectable({
  providedIn: 'root',
})
export class FirebaseFileService {
  private readonly storage = inject(Storage);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  uploadFile(path: string, data: Blob | Uint8Array | ArrayBuffer, options: FirebaseUploadRequestMetadata = {}): Observable<FirebaseUploadData> {
    const task = uploadBytes(ref(this.storage, path), data, options);

    return from(task.then(result => getDownloadURL(ref(this.storage, path)).then(downloadUrl => ({ metadata: result.metadata, downloadUrl }))));
  }

  uploadFileWithProgress(path: string, data: Blob | Uint8Array | ArrayBuffer, options: FirebaseUploadRequestMetadata = {}): Observable<FirebaseUploadDataWithProgress> {
    const task = uploadBytesResumable(ref(this.storage, path), data, options);

    return new Observable<FirebaseUploadDataWithProgress>(subscriber => {
      task.on('state_changed', {
        next: snapshot => subscriber.next(toFirebaseUploadDataWithProgress(snapshot)),
        error: err => subscriber.error(err),
        complete: () => subscriber.complete(),
      });
    }).pipe(
      concatMap(uploadData => {
        if (uploadData.snapshot.bytesTransferred === uploadData.snapshot.totalBytes) {
          // workaround: often times, the download url call needs to be delayed by varying time length to succeed
          return new Observable<string>(subscriber => {
            setTimeout(async () => {
              try {
                subscriber.next(await getDownloadURL(ref(this.storage, path)));
                subscriber.complete();
              } catch (e) {
                subscriber.error(e);
              }
            }, 250);
          }).pipe(
            retry(4),
            map(downloadUrl => ({ ...uploadData, downloadUrl, complete: true })),
            // pass the last emitted upload data unchanged to indicate 100% completion just in time
            startWith(uploadData),
          );
        }
        return of(uploadData);
      }),
    );
  }

  deleteFiles(path: string): Observable<void> {
    const task = listAll(ref(this.storage, path)).then(result => {
      result.items.forEach(item => deleteObject(ref(this.storage, item.fullPath)));
    });
    return from(task);
  }

  deleteFile(path: string): Observable<void> {
    const task = deleteObject(ref(this.storage, path));

    return from(task);
  }
}
