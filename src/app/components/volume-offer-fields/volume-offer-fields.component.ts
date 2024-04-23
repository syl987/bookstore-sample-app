import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { BookDTO } from 'src/app/models/book.models';
import { ImageDTO } from 'src/app/models/image.models';
import { BookConditionPipe } from 'src/app/pipes/book-condition.pipe';

import { VolumeCardComponent } from '../volume-card/volume-card.component';

@Component({
  selector: 'app-volume-offer-fields',
  standalone: true,
  imports: [CommonModule, MatDividerModule, VolumeCardComponent, BookConditionPipe],
  templateUrl: './volume-offer-fields.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeOfferFieldsComponent {
  readonly offer = input<BookDTO | null>();

  getOfferPhotos(offer: BookDTO): ImageDTO[] {
    return Object.values(offer.photos ?? {});
  }
}
