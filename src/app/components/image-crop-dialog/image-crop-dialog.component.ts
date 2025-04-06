import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

export interface ImageCropDialogData {
  file: File;
}

@Component({
  selector: 'app-image-crop-dialog',
  imports: [MatButtonModule, MatDialogModule, ImageCropperComponent],
  templateUrl: './image-crop-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCropDialogComponent {
  protected readonly data = inject<ImageCropDialogData>(MAT_DIALOG_DATA);

  readonly file = this.data.file;

  loadError?: boolean;

  result?: Blob;

  async setResult(event: ImageCroppedEvent): Promise<void> {
    this.result = event.blob ?? undefined; // TODO remove null conditional
  }
}
