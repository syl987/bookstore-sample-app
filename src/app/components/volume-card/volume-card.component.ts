import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { VolumeDTO } from 'src/app/models/volume.models';

// TODO loading appearence

@Component({
  selector: 'app-volume-card',
  templateUrl: './volume-card.component.html',
  styles: ['.mat-mdc-card-sm-image { width: inherit; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeCardComponent {
  @Input() volume?: VolumeDTO | null;

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
