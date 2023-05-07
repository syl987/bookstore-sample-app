import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatExpansionModule } from '@angular/material/expansion';
import { BookDTO } from 'src/app/models/book.models';
import { VolumeDTO } from 'src/app/models/volume.models';
import { AuthService } from 'src/app/services/auth.service';
import { RouterService } from 'src/app/services/router.service';
import { VolumeService } from 'src/app/services/volume.service';
import { VolumeCardComponent } from '../volume-card/volume-card.component';
import { BookConditionPipe } from 'src/app/pipes/book-condition.pipe';
import { MatButtonModule } from '@angular/material/button';

// TODO loading spinner
// TODO buy book => create a confirmation page
// TODO navigate to user books => create a success dialog
// TODO filter offers
// TODO sort offers
// TODO add support for 404
// TODO use async pipe in templates to be able to react to logout change

@Component({
  selector: 'app-volume-detail-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatExpansionModule, VolumeCardComponent, BookConditionPipe],
  templateUrl: './volume-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeDetailPageComponent {
  readonly volume$ = this.volumeService.entitiyByRoute$;

  readonly loggedIn$ = this.authService.loggedIn$;
  readonly uid$ = this.authService.user$;

  constructor(private readonly authService: AuthService, private readonly routerService: RouterService, private readonly volumeService: VolumeService) {
    this.routerService
      .selectRouteParam('volumeId')
      .pipe(takeUntilDestroyed())
      .subscribe(id => {
        if (id) {
          this.volumeService.load(id);
        }
      });
  }

  getPublishedBooks(volume: VolumeDTO): BookDTO[] {
    return Object.values(volume.publishedBooks ?? {}); // TODO sorting
  }

  buyBook(book: BookDTO): void {
    throw new Error('Method not implemented.');
  }
}
