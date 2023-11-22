import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, OnInit } from '@angular/core';
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
  readonly volumesFiltered = this.volumeService.entitiesFiltered;
  readonly volumesLoadPending = this.volumeService.loadPending;

  readonly volumesFilteredEmpty = computed(() => !this.volumesFiltered().length && !this.volumesLoadPending());

  readonly filterQuery = this.volumeService.filterQuery;
  readonly filterQueryEmpty = computed(() => !this.filterQuery().length);

  constructor(private readonly volumeService: VolumeService) {}

  ngOnInit(): void {
    this.volumeService.loadAll();
  }

  clearSearch(): void {
    this.volumeService.filter('');
  }
}
