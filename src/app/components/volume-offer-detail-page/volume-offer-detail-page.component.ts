import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, filter } from 'rxjs';
import { isTrue } from 'src/app/functions/typeguard.functions';
import { BookDTO } from 'src/app/models/book.models';
import { VolumeDTO } from 'src/app/models/volume.models';
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
  imports: [MatButtonModule, MatProgressSpinnerModule, TitleBarComponent, VolumeCardComponent, VolumeOfferFieldsComponent],
  templateUrl: './volume-offer-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeOfferDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly routerService = inject(RouterService);
  private readonly volumeService = inject(VolumeService);
  private readonly dialogService = inject(DialogService);

  id: string = this.route.snapshot.params['volumeId'];

  readonly volume = this.volumeService.entityByRoute;
  readonly volumeLoading = this.volumeService.loadPending;

  readonly offer = computed(() => getBookOfferById(this.volume(), this.routerService.routeParams().offerId));

  readonly isUserBook = computed(() => this.authService.uid() && this.offer()?.uid === this.authService.uid());

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
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
