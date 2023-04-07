import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VolumeService } from 'src/app/services/volume.service';

// TODO display volume data
// TODO display published books, hightlight own books
// TODO buy book => create a confirmation page
// TODO navigate to user books => create a success dialog

@Component({
  selector: 'app-volume-detail-page',
  templateUrl: './volume-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeDetailPageComponent implements OnInit {
  readonly id: string = this.route.snapshot.params['volumeId'];

  readonly book$ = this.volumeService.entityByRouterParamId$;

  constructor(private readonly route: ActivatedRoute, private readonly volumeService: VolumeService) {}

  ngOnInit(): void {
    this.volumeService.getByKey(this.id);
  }
}
