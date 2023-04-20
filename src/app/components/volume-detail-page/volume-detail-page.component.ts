import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BookDTO } from 'src/app/models/book.models';
import { VolumeDTO } from 'src/app/models/volume.models';
import { AuthService } from 'src/app/services/auth.service';
import { VolumeService } from 'src/app/services/volume.service';

// TODO loading spinner
// TODO buy book => create a confirmation page
// TODO navigate to user books => create a success dialog
// TODO filter offers
// TODO sort offers
// TODO add support for 404

@Component({
  selector: 'app-volume-detail-page',
  templateUrl: './volume-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeDetailPageComponent implements OnInit, OnDestroy {
  readonly id: string = this.route.snapshot.params['volumeId'];

  readonly volume$ = this.volumeService.volumeByRoute$;

  private readonly _destroyed$ = new Subject<void>();

  constructor(private readonly route: ActivatedRoute, private readonly authService: AuthService, private readonly volumeService: VolumeService) {}

  ngOnInit(): void {
    this.volumeService.load(this.id);
    this.volume$.pipe(takeUntil(this._destroyed$)).subscribe(volume => volume && this.volumeService.load(volume.id));
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  isUserBook(book: BookDTO): boolean {
    return book.uid === this.authService.uid;
  }

  getPublishedBooks(volume: VolumeDTO): BookDTO[] {
    return Object.values(volume.publishedBooks ?? {}); // TODO sorting
  }

  buyBook(book: BookDTO): void {
    throw new Error('Method not implemented.');
  }
}
