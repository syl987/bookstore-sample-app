import { FullMetadata, UploadMetadata, UploadTaskSnapshot } from '@angular/fire/storage';

export type FirebaseUploadRequestMetadata = Pick<UploadMetadata, 'contentType' | 'contentEncoding'>;

export type FirebaseUploadResponseMetadata = Pick<FullMetadata, 'bucket' | 'fullPath' | 'size'>;

export interface FirebaseUploadData extends Pick<UploadTaskSnapshot, 'state' | 'bytesTransferred' | 'totalBytes'> {
  metadata: FirebaseUploadResponseMetadata;
}

export type FirebaseUploadProgressData = Pick<UploadTaskSnapshot, 'bytesTransferred' | 'totalBytes'>;

export type FirebaseUploadResponseData = Pick<UploadTaskSnapshot, 'bytesTransferred' | 'totalBytes'> & {
  metadata: FirebaseUploadResponseMetadata;
};
