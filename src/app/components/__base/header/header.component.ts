import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, DestroyRef, output, signal, inject, LOCALE_ID } from '@angular/core';
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

import { getCurrentAppLanguage } from 'src/app/helpers/app.helpers';
import { APP_LANGUAGES } from 'src/app/models/app.models';
import { VolumeService } from 'src/app/services/volume.service';

import { HeaderUserInfoComponent } from '../header-user-info/header-user-info.component';
import { ThemeService } from 'src/app/services/theme.service';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { AutofocusDirective } from 'src/app/directives/autofocus.directive';

const FAKE_RESPONSE_TIME = 750;

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    ReactiveFormsModule,
    OverlayModule,
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
export class HeaderComponent extends SidenavComponent {
  protected readonly locale = inject(LOCALE_ID);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly breakpointObserver = inject(BreakpointObserver);
  protected readonly volumeService = inject(VolumeService);

  readonly themeService = inject(ThemeService);
  readonly languages = inject(APP_LANGUAGES);

  readonly desktop$ = this.breakpointObserver.observe([Breakpoints.WebLandscape]).pipe(
    map(({ matches }) => matches),
    distinctUntilChanged(),
  );

  readonly desktop = toSignal(this.desktop$, { requireSync: true });

  readonly searching = signal(false);

  readonly form = new FormGroup({
    query: new FormControl<string>('', { nonNullable: true }),
  });

  readonly currentLang = getCurrentAppLanguage(this.languages, this.locale);

  readonly searchOpen = signal(false);

  readonly sidenavToggle = output();

  ngOnInit(): void {
    toObservable(this.volumeService.filterQuery)
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
