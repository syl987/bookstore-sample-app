import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { VolumeService } from 'src/app/services/volume.service';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';
import { VolumeCardComponent } from '../volume-card/volume-card.component';

// TODO open as firebase database stream

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, TitleBarComponent, VolumeCardComponent],
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent implements OnInit {
  readonly volumesFiltered$ = this.volumeService.entitiesFiltered$;
  readonly volumesFilteredEmpty$ = this.volumeService.entitiesFiltered$.pipe(map(v => !v.length));

  readonly noFilterQuery$ = this.volumeService.filterQuery$.pipe(map(q => !q.length));

  constructor(private readonly volumeService: VolumeService) {}

  ngOnInit(): void {
    this.volumeService.loadAll();
  }

  clearSearch(): void {
    this.volumeService.filter('');
  }
}
