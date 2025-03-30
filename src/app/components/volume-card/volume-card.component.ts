import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { VolumeDTO } from 'src/app/models/volume.models';

@Component({
  selector: 'app-volume-card',
  imports: [CommonModule, MatCardModule, MatDividerModule],
  templateUrl: './volume-card.component.html',
  styles: ['.mat-mdc-card-sm-image { width: inherit; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block' },
})
export class VolumeCardComponent {
  readonly volume = input<VolumeDTO | null>();

  readonly booksTotal = computed(() => Object.keys(this.volume()?.publishedBooks ?? {}).length);

  readonly lowestPrice = computed(() =>
    Object.values(this.volume()?.publishedBooks ?? {})
      .map(book => book.price)
      .reduce<number | undefined>((result, price) => {
        if (price == null) {
          return result;
        }
        if (result == null || price < result) {
          return price;
        }
        return result;
      }, undefined),
  );
}
