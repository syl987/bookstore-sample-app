import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, concatMap, filter, map } from 'rxjs';
import { isTrue } from 'src/app/functions/typeguard.functions';
import { BookDTO } from 'src/app/models/book.models';
import { ImageDTO } from 'src/app/models/image.models';
import { VolumeDTO } from 'src/app/models/volume.models';
import { BookConditionPipe } from 'src/app/pipes/book-condition.pipe';
import { DialogService } from 'src/app/services/dialog.service';
import { RouterService } from 'src/app/services/router.service';
import { VolumeService } from 'src/app/services/volume.service';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';
import { VolumeCardComponent } from '../volume-card/volume-card.component';

function getBookOfferById(arg: [VolumeDTO | undefined, string | undefined]): BookDTO | undefined {
  const [volume, offerId] = arg;
  return volume && volume.publishedBooks && offerId ? volume.publishedBooks[offerId] : undefined;
}

@Component({
  selector: 'app-volume-offer-detail-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, VolumeCardComponent, BookConditionPipe, TitleBarComponent],
  templateUrl: './volume-offer-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeOfferDetailPageComponent {
  id: string = this.route.snapshot.params['volumeId'];
  offerId: string = this.route.snapshot.params['offerId'];

  readonly volume$ = this.volumeService.entitiyByRoute$;
  readonly offer$ = combineLatest([this.volume$, this.routerService.selectRouteParam('offerId')]).pipe(map(getBookOfferById));

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
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
    this.routerService
      .selectRouteParam('offerId')
      .pipe(takeUntilDestroyed())
      .subscribe(offerId => {
        if (offerId) {
          this.offerId = offerId;
        }
      });
  }

  getOfferPhotos(offer: BookDTO): ImageDTO[] {
    return Object.values(offer.photos ?? {});
  }

  buyBookOffer(offer: BookDTO): void {
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
