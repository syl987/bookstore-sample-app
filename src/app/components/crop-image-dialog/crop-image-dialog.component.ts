import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { base64ToBlob } from 'base64-blob';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import { BookPhotoUploadData } from 'src/app/models/book.models';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const base64BufferThumbnail = require('base64-buffer-thumbnail-no-cache');

export interface CropImageDialogData {
  file: File;
}

@Component({
  selector: 'app-crop-image-dialog',
  standalone: true,
  imports: [CommonModule, ImageCropperModule, MatButtonModule, MatDialogModule],
  templateUrl: './crop-image-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CropImageDialogComponent {
  readonly file = this.data.file;

  result?: BookPhotoUploadData;

  constructor(@Inject(MAT_DIALOG_DATA) private readonly data: CropImageDialogData) {}

  async setResult(event: ImageCroppedEvent): Promise<void> {
    if (!event.base64) {
      return;
    }
    this.result = {
      image: await base64ToBlob(event.base64),
      thumbnail: new Blob(await base64BufferThumbnail(event.base64, { height: 256, jpegOptions: { force: true, quality: 90 } })),
    };
  }

  loadImageFailed(): void {
    // TODO implement
  }
}
