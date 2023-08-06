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
  host: { class: 'd-block' },
})
export class VolumeCardComponent {
  @Input({ required: true }) set volume(value: VolumeDTO | null | undefined) {
    this.#volume = value;
    this.#booksTotal = Object.keys(value?.publishedBooks ?? {}).length;
    this.#lowestPrice = Object.values(this.volume?.publishedBooks ?? {})
      .map(book => book.price)
      .reduce<number | undefined>((result, price) => {
        if (price == null) {
          return result;
        }
        if (result == null || price < result) {
          return price;
        }
        return result;
      }, undefined);
  }
  get volume(): VolumeDTO | null | undefined {
    return this.#volume;
  }
  #volume?: VolumeDTO | null;

  get booksTotal(): number | undefined {
    return this.#booksTotal;
  }
  #booksTotal?: number;

  get lowestPrice(): number | undefined {
    return this.#lowestPrice;
  }
  #lowestPrice?: number;
}
