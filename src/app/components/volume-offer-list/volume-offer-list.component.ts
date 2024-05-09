import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
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
  readonly volume = input.required<VolumeDTO | null>();

  readonly publishedBooks = computed(() => Object.values(this.volume()?.publishedBooks ?? {}).sort(comparePublishedBooks));

  readonly uid = input<string | null>();

  getPhotosTotal(book: BookDTO): number {
    return Object.keys(book.photos ?? {}).length;
  }
}
