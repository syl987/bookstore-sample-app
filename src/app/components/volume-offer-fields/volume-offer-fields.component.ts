import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { BookDTO } from 'src/app/models/book.models';
import { ImageDTO } from 'src/app/models/image.models';
import { BookConditionPipe } from 'src/app/pipes/book-condition.pipe';

import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-volume-offer-fields',
  imports: [MatDividerModule, BookConditionPipe, CurrencyPipe],
  templateUrl: './volume-offer-fields.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeOfferFieldsComponent {
  readonly offer = input<BookDTO | null>();

  getOfferPhotos(offer: BookDTO): ImageDTO[] {
    return Object.values(offer.photos ?? {});
  }
}
