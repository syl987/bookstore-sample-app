import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, isDevMode, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { APP_NAV_LINKS, APP_OPTIONS, AppOptions } from 'src/app/models/app.models';
import { AuthUser } from 'src/app/models/auth.models';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { RouterService } from 'src/app/services/router.service';

import { HeaderUserInfoComponent } from '../header-user-info/header-user-info.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatDividerModule, MatIconModule, MatToolbarModule, HeaderUserInfoComponent],
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

  readonly title$ = this.routerService.title$;

  readonly toolbarTitle$ = combineLatest([this.desktop$, this.title$]).pipe(map(([desktop, title]) => (desktop ? this.options.applicationName : title)));

  readonly LINKS = APP_NAV_LINKS.filter(link => !link.dev || isDevMode());
  readonly PUBLIC_LINKS = this.LINKS.filter(link => !link.user);
  readonly USER_LINKS = this.LINKS.filter(link => link.user);

  @Output() readonly sidenavToggle = new EventEmitter<void>();

  constructor(
    @Inject(APP_OPTIONS) readonly options: AppOptions,
    private readonly observer: BreakpointObserver,
    private readonly authService: AuthService,
    private readonly routerService: RouterService,
    private readonly dialogService: DialogService,
  ) {}

  openUserSettingsDialog(user: AuthUser): void {
    this.dialogService.openUserSettingsDialog(user);
  }

  logout(): void {
    this.authService.logout();
  }
}
