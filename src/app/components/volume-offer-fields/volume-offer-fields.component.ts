import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BookDTO } from 'src/app/models/book.models';
import { ImageDTO } from 'src/app/models/image.models';
import { BookConditionPipe } from 'src/app/pipes/book-condition.pipe';

import { VolumeCardComponent } from '../volume-card/volume-card.component';

@Component({
  selector: 'app-volume-offer-fields',
  standalone: true,
  imports: [CommonModule, VolumeCardComponent, BookConditionPipe],
  templateUrl: './volume-offer-fields.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeOfferFieldsComponent {
  @Input({ required: true }) offer?: BookDTO | null;

  getOfferPhotos(offer: BookDTO): ImageDTO[] {
    return Object.values(offer.photos ?? {});
  }
}
