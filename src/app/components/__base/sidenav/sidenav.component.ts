import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { APP_CONFIG, AppConfig } from 'src/app/models/app.models';
import { AuthUser } from 'src/app/models/auth.models';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  readonly user$ = this.authService.user$;
  readonly loggedIn$ = this.authService.loggedIn$;
  readonly loggedOut$ = this.authService.loggedOut$;

  readonly production = environment.production;

  @Output() readonly navigated = new EventEmitter<void>();

  constructor(
    @Inject(APP_CONFIG) readonly config: AppConfig,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly dialogService: DialogService,
  ) {}

  navigateToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  openUserSettingsDialog(user: AuthUser): void {
    this.dialogService.openUserSettingsDialog(user);
  }

  logout(): void {
    this.authService.logout();
  }
}
