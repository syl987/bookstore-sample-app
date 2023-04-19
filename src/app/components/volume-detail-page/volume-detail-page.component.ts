import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookDTO } from 'src/app/models/book.models';
import { VolumeDTO } from 'src/app/models/volume.models';
import { VolumeService } from 'src/app/services/volume.service';

// TODO display volume data
// TODO display published books, hightlight own books
// TODO buy book => create a confirmation page
// TODO navigate to user books => create a success dialog
// TODO filter offers
// TODO sort offers
// TODO display some sort of 404 message if the volume is not found

@Component({
  selector: 'app-volume-detail-page',
  templateUrl: './volume-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeDetailPageComponent implements OnInit {
  readonly id: string = this.route.snapshot.params['volumeId'];

  readonly volume$ = this.volumeService.volumeByRoute$;

  constructor(private readonly route: ActivatedRoute, private readonly volumeService: VolumeService) {}

  ngOnInit(): void {
    this.volumeService.load(this.id);
  }

  getVolumePublishedBooks(volume: VolumeDTO): BookDTO[] {
    // TODO sorting
    return Object.values(volume.publishedBooks ?? {});
  }
}
