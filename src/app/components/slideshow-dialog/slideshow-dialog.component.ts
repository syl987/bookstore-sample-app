import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ImageDTO } from 'src/app/models/image.models';

export interface SlideshowDialogData {
  title: string;
  images: ImageDTO[];
}

@Component({
  selector: 'app-slideshow-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './slideshow-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideshowDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) readonly data: SlideshowDialogData) {}
}
