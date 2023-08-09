import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCarouselModule } from '@nunomeirelesjumia/material-carousel';

export interface CarouselDialogData {
  title: string;
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
