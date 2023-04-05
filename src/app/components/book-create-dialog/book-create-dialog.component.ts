import { ChangeDetectionStrategy, Component } from '@angular/core';
import { VolumeService } from 'src/app/services/volume.service';

@Component({
  selector: 'app-book-create-dialog',
  templateUrl: './book-create-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCreateDialogComponent {
  readonly volumes$ = this.volumeService.volumes$;
  readonly pending$ = this.volumeService.searchPending$;
  readonly error$ = this.volumeService.searchError$;

  constructor(private readonly volumeService: VolumeService) {}

  searchVolumes(query: string): void {
    this.volumeService.searchVolumes(query);
  }
}
