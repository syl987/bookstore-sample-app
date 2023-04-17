import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { VolumeDTO } from 'src/app/models/volume.models';

// TODO loading appearence

@Component({
  selector: 'app-volume-card',
  templateUrl: './volume-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeCardComponent {
  @Input() volume?: VolumeDTO | null;

  getPublishedBooksTotal(volume: VolumeDTO): number {
    return Object.keys(volume.publishedBooks ?? {}).length;
  }
}
