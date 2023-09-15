import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCarouselModule } from '@magloft/material-carousel';
import { ImageDTO } from 'src/app/models/image.models';

export interface CarouselDialogData {
  title: string;
  images: ImageDTO[];
}

@Component({
  selector: 'app-carousel-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatCarouselModule],
  templateUrl: './carousel-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) readonly data: CarouselDialogData) {}
}
