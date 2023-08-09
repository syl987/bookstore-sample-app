import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { BookDTO } from 'src/app/models/book.models';
import { BookConditionPipe } from 'src/app/pipes/book-condition.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { RouterService } from 'src/app/services/router.service';
import { VolumeService } from 'src/app/services/volume.service';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';
import { VolumeCardComponent } from '../volume-card/volume-card.component';
import { VolumeOfferListComponent } from '../volume-offer-list/volume-offer-list.component';

// TODO loading spinner
// TODO buy book => create a confirmation page
// TODO navigate to user books => create a success dialog
// TODO add support for 404
// TODO use async pipe in templates to be able to react to logout change

@Component({
  selector: 'app-volume-detail-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, VolumeCardComponent, BookConditionPipe, TitleBarComponent, VolumeOfferListComponent],
  templateUrl: './volume-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeDetailPageComponent {
  id: string = this.route.snapshot.params['volumeId'];

  readonly volume$ = this.volumeService.entitiyByRoute$;

  readonly loggedIn$ = this.authService.loggedIn$;
  readonly uid$ = this.authService.user$;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly routerService: RouterService,
    private readonly volumeService: VolumeService,
    private readonly dialogService: DialogService,
  ) {
    this.routerService
      .selectRouteParam('volumeId')
      .pipe(takeUntilDestroyed())
      .subscribe(id => {
        if (id) {
          this.id = id;
          this.volumeService.load(id);
        }
      });
  }

  showPhotos(book: BookDTO): void {
    this.dialogService.openVolumeOfferPhotosDialog(book);
  }

  buyBook(book: BookDTO): void {
    throw new Error('Method not implemented.');
  }
}
