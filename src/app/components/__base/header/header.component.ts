import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Inject, isDevMode, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { delay, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { APP_NAV_LINKS, APP_OPTIONS, AppOptions } from 'src/app/models/app.models';
import { AuthUser } from 'src/app/models/auth.models';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { RouterService } from 'src/app/services/router.service';
import { VolumeService } from 'src/app/services/volume.service';

import { HeaderUserInfoComponent } from '../header-user-info/header-user-info.component';

const FAKE_RESPONSE_TIME = 750;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
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
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly user$ = this.authService.user$;

  readonly desktop$ = this.observer.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(
    map(({ matches }) => !matches),
    distinctUntilChanged(),
  );

  readonly displayLogin$ = this.routerService.url$.pipe(map(url => !url?.startsWith('/login')));

  readonly searching$ = new BehaviorSubject<boolean>(false);

  readonly form = this.builder.nonNullable.group({
    query: new FormControl<string>(''),
  });

  readonly LINKS = APP_NAV_LINKS.filter(link => !link.dev || isDevMode());
  readonly PUBLIC_LINKS = this.LINKS.filter(link => !link.user);
  readonly USER_LINKS = this.LINKS.filter(link => link.user);

  @Output() readonly sidenavToggle = new EventEmitter<void>();

  constructor(
    @Inject(APP_OPTIONS) readonly options: AppOptions,
    private readonly router: Router,
    private readonly builder: FormBuilder,
    private readonly observer: BreakpointObserver,
    private readonly authService: AuthService,
    private readonly volumeService: VolumeService,
    private readonly routerService: RouterService,
    private readonly dialogService: DialogService,
    private readonly destroy: DestroyRef,
  ) {
    this.volumeService.filterQuery$.pipe(takeUntilDestroyed()).subscribe(query => {
      this.form.get('query')!.setValue(query, { emitEvent: false });
    });
  }

  openUserSessionInfoDialog(user: AuthUser): void {
    this.dialogService.openUserSessionInfoDialog(user);
  }

  search(): void {
    of(this.form.value.query ?? '')
      .pipe(
        tap(_ => this.searching$.next(true)),
        delay(FAKE_RESPONSE_TIME),
        tap(_ => this.searching$.next(false)),
        takeUntilDestroyed(this.destroy),
      )
      .subscribe(query => {
        this.volumeService.filter(query);
        this.router.navigateByUrl('/search');
      });
  }

  logout(): void {
    this.authService.logout();
  }
}
