import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { RouterService } from 'src/app/services/router.service';
import { VolumeService } from 'src/app/services/volume.service';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';
import { VolumeCardComponent } from '../volume-card/volume-card.component';
import { VolumeOfferListComponent } from '../volume-offer-list/volume-offer-list.component';

@Component({
  selector: 'app-volume-detail-page',
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    TitleBarComponent,
    VolumeCardComponent,
    VolumeOfferListComponent,
  ],
  templateUrl: './volume-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeDetailPageComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  protected readonly routerService = inject(RouterService);
  protected readonly volumeService = inject(VolumeService);

  readonly volumeId = toSignal(this.routerService.routeParams$.pipe(map(({ volumeId }) => volumeId!)), { requireSync: true }); // mandatory param defined by route

  readonly volume = toSignal(this.volumeService.entityByRoute$, { requireSync: true });
  readonly volumeLoading = toSignal(this.volumeService.loadPending$, { requireSync: true });

  readonly uid = toSignal(this.authService.uid$, { requireSync: true });

  ngOnInit(): void {
    this.volumeService.load(this.volumeId());
  }
}
