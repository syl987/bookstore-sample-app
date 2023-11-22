import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { BookConditionPipe } from 'src/app/pipes/book-condition.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { RouterService } from 'src/app/services/router.service';
import { VolumeService } from 'src/app/services/volume.service';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';
import { VolumeCardComponent } from '../volume-card/volume-card.component';
import { VolumeOfferListComponent } from '../volume-offer-list/volume-offer-list.component';

@Component({
  selector: 'app-volume-detail-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, TitleBarComponent, VolumeCardComponent, VolumeOfferListComponent, BookConditionPipe],
  templateUrl: './volume-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeDetailPageComponent {
  id: string = this.route.snapshot.params['volumeId'];

  readonly volume = this.volumeService.entitiyByRoute;

  readonly loggedIn = this.authService.loggedIn;
  readonly uid = this.authService.uid;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly routerService: RouterService,
    private readonly volumeService: VolumeService,
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
}
