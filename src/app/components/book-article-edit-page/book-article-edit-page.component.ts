import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookArticleService } from 'src/app/services/book.service';

@Component({
  selector: 'app-book-article-edit-page',
  templateUrl: './book-article-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookArticleEditPageComponent implements OnInit {
  readonly id: string = this.route.snapshot.params['bookArticleId'];

  readonly bookArticle$ = this.bookArticleService.entityByRouterParamId$;

  constructor(private readonly route: ActivatedRoute, private readonly bookArticleService: BookArticleService) {}

  ngOnInit(): void {
    this.bookArticleService.getByKey(this.id);
  }
}
