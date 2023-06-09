import { FullMetadata, UploadMetadata, UploadTaskSnapshot } from '@angular/fire/storage';

export type FirebaseUploadRequestMetadata = Pick<UploadMetadata, 'contentType' | 'contentEncoding'>;

export type FirebaseUploadResponseMetadata = FirebaseUploadRequestMetadata & Pick<FullMetadata, 'bucket' | 'fullPath' | 'size'>;

export interface FirebaseUploadData extends Pick<UploadTaskSnapshot, 'bytesTransferred' | 'totalBytes'> {
  /** Whether the task is complete or in progress. */
  status: 'progress' | 'complete';
  /** Before the upload completes, contains the metadata sent to the server. After the upload completes, contains the metadata sent back from the server. */
  metadata: FirebaseUploadResponseMetadata;
  /** After the upload completes, contains the URL to access the resource. */
  downloadUrl?: string;
}