import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
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

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';
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

  readonly volumeId = computed(() => this.routerService.routeParams().volumeId!); // mandatory param defined by route
  readonly offerId = computed(() => this.routerService.routeParams().offerId!); // mandatory param defined by route

  readonly volume = this.volumeService.entityByRoute;
  readonly volumeLoading = this.volumeService.loadPending;

  readonly offer = computed(() => getBookOfferById(this.volume(), this.offerId()));

  readonly isUserBook = computed(() => this.authService.uid() && this.offer()?.uid === this.authService.uid());

  ngOnInit(): void {
    this.volumeService.load(this.volumeId());
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
        concatMap(_ => this.volumeService.buyOffer(this.volumeId(), offer.id)),
      )
      .subscribe(_ => {
        this.router.navigateByUrl(`/user/books`);
      });
  }
}
