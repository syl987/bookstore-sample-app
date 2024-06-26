import { FullMetadata, UploadMetadata, UploadTaskSnapshot } from '@angular/fire/storage';

export type FirebaseUploadRequestMetadata = Pick<UploadMetadata, 'contentType' | 'contentEncoding'>;

export interface FirebaseUploadData {
  /** The metadata sent back from the server. */
  metadata: FullMetadata;
  /** The URL to access the resource. */
  downloadUrl: string;
}

export interface FirebaseUploadDataWithProgress {
  /** Data about the current state of the upload task. */
  snapshot: Pick<UploadTaskSnapshot, 'state' | 'metadata' | 'bytesTransferred' | 'totalBytes'>;
  /** After the upload completes, contains the URL to access the resource. */
  downloadUrl?: string;
  /** Whether all data has been uploaded. */
  complete: boolean;
}
