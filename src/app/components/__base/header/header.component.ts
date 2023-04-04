import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { APP_CONFIG, AppConfig } from 'src/app/models/app.models';
import { AuthUser } from 'src/app/models/auth.models';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { RouterService } from 'src/app/services/router.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly user$ = this.authService.user$;

  readonly showToggle$ = this.observer.observe([Breakpoints.XSmall]).pipe(
    map(({ matches }) => matches),
    distinctUntilChanged()
  );

  readonly showNavs$ = this.showToggle$.pipe(map(show => !show));

  readonly showLogin$ = this.routerService.url$.pipe(map(url => !url?.startsWith('/login')));

  readonly title$ = this.routerService.title$;

  readonly toolbarTitle$ = combineLatest([this.showNavs$, this.title$]).pipe(
    map(([showNavs, title]) => (showNavs ? this.config.appName : title))
  );

  readonly production = environment.production;

  @Output() readonly sidenavToggle = new EventEmitter<void>();

  constructor(
    @Inject(APP_CONFIG) readonly config: AppConfig,
    private readonly observer: BreakpointObserver,
    private readonly authService: AuthService,
    private readonly routerService: RouterService,
    private readonly dialogService: DialogService
  ) {}

  openUserSettingsDialog(user: AuthUser): void {
    this.dialogService.openUserSettingsDialog(user);
  }

  logout(): void {
    this.authService.logout();
  }
}
