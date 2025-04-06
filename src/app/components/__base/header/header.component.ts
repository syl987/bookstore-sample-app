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
import { Router, RouterModule } from '@angular/router';
import { delay, distinctUntilChanged, map, of, tap } from 'rxjs';
import { getCurrentAppLanguage } from 'src/app/helpers/app.helpers';
import { APP_LANGUAGES, APP_NAV_LINKS, APP_OPTIONS } from 'src/app/models/app.models';
import { AuthUser } from 'src/app/models/auth.models';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { VolumeService } from 'src/app/services/volume.service';

import { HeaderUserInfoComponent } from '../header-user-info/header-user-info.component';

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
export class HeaderComponent {
  readonly options = inject(APP_OPTIONS);
  private readonly router = inject(Router);
  private readonly builder = inject(FormBuilder);
  private readonly observer = inject(BreakpointObserver);
  private readonly authService = inject(AuthService);
  private readonly volumeService = inject(VolumeService);
  private readonly dialogService = inject(DialogService);
  private readonly destroy = inject(DestroyRef);

  readonly user = this.authService.user;

  readonly desktop$ = this.observer.observe([Breakpoints.WebLandscape]).pipe(
    map(({ matches }) => matches),
    distinctUntilChanged(),
  );

  readonly desktop = toSignal(this.desktop$, { requireSync: true });

  readonly searching = signal(false);

  readonly form = this.builder.nonNullable.group({
    query: new FormControl<string>(''),
  });

  readonly LINKS = APP_NAV_LINKS;
  readonly PUBLIC_LINKS = this.LINKS.filter(link => !link.user);
  readonly USER_LINKS = this.LINKS.filter(link => link.user);

  readonly APP_LANGUAGES = APP_LANGUAGES;

  readonly currentLang = getCurrentAppLanguage();

  readonly searchOverlayOpen = signal(false);

  readonly sidenavToggle = output();

  constructor() {
    toObservable(this.volumeService.filterQuery)
      .pipe(takeUntilDestroyed())
      .subscribe(query => {
        this.form.get('query')!.setValue(query, { emitEvent: false });
      });
  }

  openUserSessionInfoDialog(user: AuthUser): void {
    this.dialogService.openUserSessionInfoDialog(user);
  }

  search(): void {
    of(this.form.value.query ?? '')
      .pipe(
        tap(_ => this.searching.set(true)),
        delay(FAKE_RESPONSE_TIME),
        tap(_ => this.searching.set(false)),
        takeUntilDestroyed(this.destroy),
      )
      .subscribe(query => {
        this.volumeService.filter(query);
        this.router.navigateByUrl('/volumes');
      });
  }

  logout(): void {
    this.authService.logout();
  }
}
