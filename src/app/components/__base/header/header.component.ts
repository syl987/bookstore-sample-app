import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, DestroyRef, output, signal, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { delay, distinctUntilChanged, map, of, tap } from 'rxjs';

import { getCurrentAppLanguage } from 'src/app/helpers/app.helpers';
import { APP_LANGUAGES, APP_OPTIONS } from 'src/app/models/app.models';
import { VolumeService } from 'src/app/services/volume.service';

import { HeaderUserInfoComponent } from '../header-user-info/header-user-info.component';
import { ThemeService } from 'src/app/services/theme.service';
import { SidenavComponent } from '../sidenav/sidenav.component';

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
    MatToolbarModule,
    HeaderUserInfoComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent extends SidenavComponent {
  protected readonly builder = inject(FormBuilder);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly breakpointObserver = inject(BreakpointObserver);
  protected readonly volumeService = inject(VolumeService);

  readonly themeService = inject(ThemeService);
  readonly options = inject(APP_OPTIONS);

  readonly desktop$ = this.breakpointObserver.observe([Breakpoints.WebLandscape]).pipe(
    map(({ matches }) => matches),
    distinctUntilChanged(),
  );

  readonly desktop = toSignal(this.desktop$, { requireSync: true });

  readonly searching = signal(false);

  readonly form = this.builder.nonNullable.group({
    query: new FormControl<string>(''),
  });

  readonly APP_LANGUAGES = APP_LANGUAGES;

  readonly currentLang = getCurrentAppLanguage();

  readonly searchOverlayOpen = signal(false);

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
