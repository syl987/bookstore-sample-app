import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, isDevMode, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { APP_LANGUAGES, APP_NAV_LINKS } from 'src/app/models/app.models';
import { AuthUser } from 'src/app/models/auth.models';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';

// TODO add close button or support ESC key

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatListModule, MatMenuModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  readonly user$ = this.authService.user$;

  readonly LINKS = APP_NAV_LINKS.filter(link => !link.dev || isDevMode());
  readonly PUBLIC_LINKS = this.LINKS.filter(link => !link.user);

  readonly APP_LANGUAGES = APP_LANGUAGES;

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
