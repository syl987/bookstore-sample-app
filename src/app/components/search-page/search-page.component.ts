import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/services/car.service';

@Component({
    selector: 'app-search-page',
    templateUrl: './search-page.component.html',

    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent implements OnInit, OnDestroy {
    readonly filterControl = new FormControl('', { nonNullable: true });

    readonly profiles$ = this.profileService.filteredEntities$;

    private readonly _destroyed$ = new Subject<void>();

    constructor(private readonly profileService: ProfileService) {}

    ngOnInit(): void {
        this.profileService.getAll();

        this.filterControl.valueChanges.pipe(debounceTime(250), takeUntil(this._destroyed$)).subscribe(value => this.profileService.setFilter(value));

        this.profileService.filter$.pipe(takeUntil(this._destroyed$)).subscribe(filter => this.filterControl.setValue(filter, { emitEvent: false }));
    }

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
