import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { VolumeDTO } from 'src/app/models/volume.models';

// TODO loading appearence

@Component({
  selector: 'app-volume-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule],
  templateUrl: './volume-card.component.html',
  styles: ['.mat-mdc-card-sm-image { width: inherit; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeCardComponent {
  @Input({ required: true }) volume?: VolumeDTO | null;

  getPublishedBooksTotal(): number {
    return Object.keys(this.volume?.publishedBooks ?? {}).length;
  }

  getPublishedBooksCheapestPrice(): number | null {
    return Object.values(this.volume?.publishedBooks ?? {}).reduce<number | null>((price, book) => {
      if (book.price && price === null) {
        return book.price;
      }
      if (price && book.price && book.price < price) {
        return book.price;
      }
      return price;
    }, null);
  }
}
