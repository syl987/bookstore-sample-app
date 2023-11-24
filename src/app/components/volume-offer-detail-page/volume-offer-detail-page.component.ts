import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, filter } from 'rxjs';
import { isTrue } from 'src/app/functions/typeguard.functions';
import { BookDTO } from 'src/app/models/book.models';
import { VolumeDTO } from 'src/app/models/volume.models';
import { BookConditionPipe } from 'src/app/pipes/book-condition.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { RouterService } from 'src/app/services/router.service';
import { VolumeService } from 'src/app/services/volume.service';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';
import { VolumeCardComponent } from '../volume-card/volume-card.component';
import { VolumeOfferFieldsComponent } from '../volume-offer-fields/volume-offer-fields.component';

function getBookOfferById(volume?: VolumeDTO, offerId?: string): BookDTO | undefined {
  return offerId ? volume?.publishedBooks?.[offerId] : undefined;
}

@Component({
  selector: 'app-volume-offer-detail-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule, TitleBarComponent, VolumeCardComponent, VolumeOfferFieldsComponent, BookConditionPipe],
  templateUrl: './volume-offer-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeOfferDetailPageComponent {
  id: string = this.route.snapshot.params['volumeId'];

  readonly volume = this.volumeService.entitiyByRoute;
  readonly volumeLoading = this.volumeService.loadPending;

  readonly offer = computed(() => getBookOfferById(this.volumeService.entitiyByRoute(), this.routerService.routeParams()['offerId']));

  readonly isUserBook = computed(() => this.authService.uid() && this.offer()?.uid === this.authService.uid());

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
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

  buyBookOffer(offer: BookDTO): void {
    if (!this.authService.user()) {
      this.dialogService
        .openLoginRequiredDialog()
        .beforeClosed()
        .pipe(filter(isTrue))
        .subscribe(_ => {
          this.router.navigateByUrl(`/login`);
        });
      return;
    }
    this.dialogService
      .openUserBookBuyDialog()
      .beforeClosed()
      .pipe(
        filter(isTrue),
        concatMap(_ => this.volumeService.buyOffer(this.id, offer.id)),
      )
      .subscribe(_ => {
        this.router.navigateByUrl(`/user/books`);
      });
  }
}
