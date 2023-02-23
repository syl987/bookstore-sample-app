import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { BookArticleService } from 'src/app/services/book.service';

@Component({
    selector: 'app-search-page',
    templateUrl: './search-page.component.html',

    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent implements OnInit, OnDestroy {
    readonly filterControl = new FormControl('', { nonNullable: true });

    readonly bookArticles$ = this.bookArticleService.filteredEntities$;

    private readonly _destroyed$ = new Subject<void>();

    constructor(private readonly bookArticleService: BookArticleService) {}

    ngOnInit(): void {
        this.bookArticleService.getAll();

        this.filterControl.valueChanges.pipe(debounceTime(250), takeUntil(this._destroyed$)).subscribe(value => this.bookArticleService.setFilter(value));

        this.bookArticleService.filter$.pipe(takeUntil(this._destroyed$)).subscribe(filter => this.filterControl.setValue(filter, { emitEvent: false }));
    }

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
