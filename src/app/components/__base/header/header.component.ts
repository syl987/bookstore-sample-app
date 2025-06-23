import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, DestroyRef, output, signal, inject, LOCALE_ID, OnInit, Injector } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { delay, distinctUntilChanged, map, of, tap } from 'rxjs';

import { AutofocusDirective } from 'src/app/directives/autofocus.directive';
import { getCurrentAppLanguage } from 'src/app/helpers/app.helpers';
import { APP_LANGUAGES } from 'src/app/models/app.models';
import { ThemeService } from 'src/app/services/theme.service';
import { VolumeService } from 'src/app/services/volume.service';

import { HeaderUserInfoComponent } from '../header-user-info/header-user-info.component';
import { SidenavComponent } from '../sidenav/sidenav.component';

const FAKE_RESPONSE_TIME = 750;

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatToolbarModule,
    HeaderUserInfoComponent,
    AutofocusDirective,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-header' },
})
export class HeaderComponent extends SidenavComponent implements OnInit {
  protected readonly locale = inject(LOCALE_ID);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly injector = inject(Injector);
  protected readonly breakpointObserver = inject(BreakpointObserver);
  protected readonly volumeService = inject(VolumeService);

  readonly themeService = inject(ThemeService);
  readonly languages = inject(APP_LANGUAGES);

  readonly large$ = this.breakpointObserver.observe([Breakpoints.Large, Breakpoints.XLarge]).pipe(
    map(({ matches }) => matches),
    distinctUntilChanged(),
  );

  readonly large = toSignal(this.large$, { requireSync: true });

  readonly searching = signal(false);

  readonly form = new FormGroup({
    query: new FormControl<string>('', { nonNullable: true }),
  });

  readonly currentLang = getCurrentAppLanguage(this.languages, this.locale);

  readonly searchOpen = signal(false);

  readonly sidenavToggle = output();

  ngOnInit(): void {
    toObservable(this.volumeService.filterQuery, { injector: this.injector })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(query => {
        this.form.controls.query.setValue(query, { emitEvent: false });
      });
  }

  search(): void {
    of(this.form.value.query ?? '')
      .pipe(
        tap(_ => this.searching.set(true)),
        delay(FAKE_RESPONSE_TIME),
        tap(_ => this.searching.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(query => {
        this.volumeService.filter(query);
        this.router.navigateByUrl('/volumes');
      });
  }
}
