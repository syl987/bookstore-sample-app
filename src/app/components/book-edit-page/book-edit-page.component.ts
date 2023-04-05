import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-book-edit-page',
  templateUrl: './book-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookEditPageComponent implements OnInit {
  readonly id: string = this.route.snapshot.params['bookId'];

  readonly book$ = this.bookService.entityByRouterParamId$;

  constructor(private readonly route: ActivatedRoute, private readonly bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getByKey(this.id);
  }
}
