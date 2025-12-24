import { ChangeDetectionStrategy, Component, computed, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { concatMap, filter } from 'rxjs';

import { isTrue } from 'src/app/functions/typeguard.functions';
import { BookDTO } from 'src/app/models/book.models';
import { VolumeDTO } from 'src/app/models/volume.models';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { RouterService } from 'src/app/services/router.service';
import { VolumeService } from 'src/app/services/volume.service';

import { TitleBarComponent } from '../../base/title-bar/title-bar.component';
import { VolumeCardComponent } from '../volume-card/volume-card.component';
import { VolumeOfferFieldsComponent } from '../volume-offer-fields/volume-offer-fields.component';

function getBookOfferById(volume?: VolumeDTO, offerId?: string): BookDTO | undefined {
  return offerId ? volume?.publishedBooks?.[offerId] : undefined;
}

@Component({
  selector: 'app-volume-offer-detail-page',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TitleBarComponent,
    VolumeCardComponent,
    VolumeOfferFieldsComponent,
  ],
  templateUrl: './volume-offer-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeOfferDetailPageComponent implements OnInit {
  protected readonly router = inject(Router);
  protected readonly authService = inject(AuthService);
  protected readonly routerService = inject(RouterService);
  protected readonly volumeService = inject(VolumeService);
  protected readonly dialogService = inject(DialogService);

  readonly volumeId = toSignal(this.routerService.params$.volumeId, { requireSync: true }) as Signal<string>; // mandatory param defined by route
  readonly offerId = toSignal(this.routerService.params$.offerId, { requireSync: true }) as Signal<string>; // mandatory param defined by route

  readonly volume = toSignal(this.volumeService.entityByRoute$, { requireSync: true });
  readonly volumeLoading = toSignal(this.volumeService.loadPending$, { requireSync: true });

  readonly uid = toSignal(this.authService.uid$, { requireSync: true });
  readonly user = toSignal(this.authService.user$, { requireSync: true });

  readonly offer = computed(() => getBookOfferById(this.volume(), this.offerId()));
  readonly isUserBook = computed(() => this.uid() && this.offer()?.uid === this.uid());

  ngOnInit(): void {
    this.volumeService.load(this.volumeId());
  }

  buyBookOffer(offer: BookDTO): void {
    if (!this.user()) {
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
        concatMap(_ => this.volumeService.buyOffer(this.volumeId()!, offer.id)), // mandatory param defined by route
      )
      .subscribe(_ => {
        this.router.navigateByUrl(`/user/books`);
      });
  }
}
