import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DialogService } from 'src/app/services/dialog.service';
import { UserBooksService } from 'src/app/services/user-books.service';
import { VolumeCardComponent } from '../volume-card/volume-card.component';
import { UserBookCardContentComponent } from '../user-book-card-content/user-book-card-content.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-book-list-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, VolumeCardComponent, UserBookCardContentComponent],
  templateUrl: './user-book-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookListPageComponent implements OnInit {
  readonly userBooksDraft$ = this.userBooksService.entitiesDraft$;
  readonly userBooksPublished$ = this.userBooksService.entitiesPublished$;
  readonly userBooksSold$ = this.userBooksService.entitiesSold$;

  constructor(private readonly router: Router, private readonly userBooksService: UserBooksService, private readonly dialogService: DialogService) {}

  ngOnInit(): void {
    this.userBooksService.loadAll();
  }

  openBookCreateDialog(): void {
    const dialogRef = this.dialogService.openUserBookCreateDialog();

    dialogRef.beforeClosed().subscribe(book => {
      if (book) {
        this.router.navigateByUrl('/user/books/' + book.id + '/edit');
      }
    });
  }
}
