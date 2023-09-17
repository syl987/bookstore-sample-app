import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { comparePublishedBooks } from 'src/app/helpers/book.helpers';
import { BookDTO } from 'src/app/models/book.models';
import { VolumeDTO } from 'src/app/models/volume.models';
import { BookConditionPipe } from 'src/app/pipes/book-condition.pipe';

@Component({
  selector: 'app-volume-offer-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatTableModule, BookConditionPipe],
  templateUrl: './volume-offer-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeOfferListComponent {
  @Input({ required: true }) set volume(value: VolumeDTO | null | undefined) {
    this.publishedBooks = Object.values(value?.publishedBooks ?? {}).sort(comparePublishedBooks);
    this.volumeId = value?.id;
  }

  publishedBooks: readonly BookDTO[] = [];
  volumeId?: string;

  getPhotosTotal(book: BookDTO): number {
    return Object.keys(book.photos ?? {}).length;
  }
}
