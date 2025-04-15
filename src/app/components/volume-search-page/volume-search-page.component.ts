import { ChangeDetectionStrategy, Component, computed, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

import { VolumeService } from 'src/app/services/volume.service';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';
import { VolumeCardComponent } from '../volume-card/volume-card.component';
import { MatIconModule } from '@angular/material/icon';

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

  readonly volumesFiltered = this.volumeService.entitiesFiltered;
  readonly volumesLoading = this.volumeService.loadPending;

  readonly filterQuery = this.volumeService.filterQuery;
  readonly filterQueryEmpty = computed(() => !this.filterQuery().length);

  ngOnInit(): void {
    this.volumeService.loadAll();
  }

  clearSearch(): void {
    this.volumeService.filter('');
  }
}
