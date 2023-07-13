import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { base64ToBlob } from 'base64-blob';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';

export interface ImageCropDialogData {
  file: File;
}

@Component({
  selector: 'app-image-crop-dialog',
  standalone: true,
  imports: [CommonModule, ImageCropperModule, MatButtonModule, MatDialogModule],
  templateUrl: './image-crop-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCropDialogComponent {
  readonly file = this.data.file;

  result?: Blob | null;

  constructor(@Inject(MAT_DIALOG_DATA) private readonly data: ImageCropDialogData) {}

  async setResult(event: ImageCroppedEvent): Promise<void> {
    this.result = event.base64 ? await base64ToBlob(event.base64) : null;
  }

  loadImageFailed(): void {
    // TODO implement
  }
}
