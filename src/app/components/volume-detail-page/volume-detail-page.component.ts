import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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

  readonly volumeId = computed(() => this.routerService.routeParams().volumeId!); // mandatory param defined by route

  readonly volume = this.volumeService.entityByRoute;
  readonly volumeLoading = this.volumeService.loadPending;

  readonly uid = this.authService.uid;

  ngOnInit(): void {
    this.volumeService.load(this.volumeId());
  }
}
