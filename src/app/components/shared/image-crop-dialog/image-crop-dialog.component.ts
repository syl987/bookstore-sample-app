import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ImageCropperComponent } from 'ngx-image-cropper';

export interface ImageCropDialogData {
  file: File;
}

@Component({
  selector: 'app-image-crop-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    ImageCropperComponent,
  ],
  templateUrl: './image-crop-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCropDialogComponent {
  readonly data = inject<ImageCropDialogData>(MAT_DIALOG_DATA);

  loadError?: boolean;

  result?: Blob | null;
}
