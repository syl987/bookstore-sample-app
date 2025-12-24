import { ChangeDetectionStrategy, Component, computed, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

import { VolumeService } from 'src/app/services/volume.service';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';
import { VolumeCardComponent } from '../volume-card/volume-card.component';

@Component({
  selector: 'app-volume-search-page',
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TitleBarComponent,
    VolumeCardComponent,
  ],
  templateUrl: './volume-search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeSearchPageComponent implements OnInit {
  protected readonly volumeService = inject(VolumeService);

  readonly volumesFiltered = toSignal(this.volumeService.entitiesFiltered$, { requireSync: true });
  readonly volumesLoading = toSignal(this.volumeService.loadPending$, { requireSync: true });

  readonly filterQuery = toSignal(this.volumeService.filterQuery$, { requireSync: true });
  readonly filterQueryEmpty = computed(() => !this.filterQuery().length);

  ngOnInit(): void {
    this.volumeService.loadAll();
  }

  clearSearch(): void {
    this.volumeService.filter('');
  }
}
