import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { VolumeService } from 'src/app/services/volume.service';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';
import { VolumeCardComponent } from '../volume-card/volume-card.component';

@Component({
  selector: 'app-volume-search-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, TitleBarComponent, VolumeCardComponent],
  templateUrl: './volume-search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeSearchPageComponent implements OnInit {
  readonly volumesFiltered = toSignal(this.volumeService.entitiesFiltered$, { requireSync: true });
  readonly volumesLoadPending = toSignal(this.volumeService.loadPending$, { requireSync: true });

  readonly volumesFilteredEmpty = computed(() => !this.volumesFiltered().length && !this.volumesLoadPending());

  readonly filterQuery = toSignal(this.volumeService.filterQuery$, { requireSync: true });
  readonly filterQueryEmpty = computed(() => !this.filterQuery().length);

  constructor(private readonly volumeService: VolumeService) {}

  ngOnInit(): void {
    this.volumeService.loadAll();
  }

  clearSearch(): void {
    this.volumeService.filter('');
  }
}
