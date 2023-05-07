import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, isDevMode, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { AuthUser } from 'src/app/models/auth.models';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  readonly user$ = this.authService.user$;
  readonly loggedIn$ = this.authService.loggedIn$;
  readonly loggedOut$ = this.authService.loggedOut$;

  readonly development = isDevMode();

  @Output() readonly navigated = new EventEmitter<void>();

  constructor(private readonly router: Router, private readonly authService: AuthService, private readonly dialogService: DialogService) {}

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
