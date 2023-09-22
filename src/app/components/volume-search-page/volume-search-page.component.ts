import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { combineLatest, map } from 'rxjs';
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
  readonly volumesFiltered$ = this.volumeService.entitiesFiltered$;
  readonly volumesLoadPending$ = this.volumeService.loadPending$;

  readonly volumesFilteredEmpty$ = combineLatest([this.volumesFiltered$, this.volumesLoadPending$]).pipe(map(([v, p]) => !v.length && !p));

  readonly noFilterQuery$ = this.volumeService.filterQuery$.pipe(map(q => !q.length));

  constructor(private readonly volumeService: VolumeService) {}

  ngOnInit(): void {
    this.volumeService.loadAll();
  }

  clearSearch(): void {
    this.volumeService.filter('');
  }
}
