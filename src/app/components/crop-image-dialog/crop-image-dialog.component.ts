import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { base64ToBlob } from 'base64-blob';
import { ImageCroppedEvent } from 'ngx-image-cropper';

export interface CropImageDialogData {
  file: File;
}

@Component({
  selector: 'app-crop-image-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crop-image-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CropImageDialogComponent {
  readonly file = this.data.file;

  result?: Blob | null;

  constructor(@Inject(MAT_DIALOG_DATA) private readonly data: CropImageDialogData) {}

  async setResult(event: ImageCroppedEvent): Promise<void> {
    this.result = event.base64 ? await base64ToBlob(event.base64) : null;
  }

  loadImageFailed(): void {
    // TODO implement
  }
}
