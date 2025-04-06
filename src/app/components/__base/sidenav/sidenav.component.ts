import { ChangeDetectionStrategy, Component, output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { APP_NAV_LINKS } from 'src/app/models/app.models';
import { AuthUser } from 'src/app/models/auth.models';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-sidenav',
  imports: [RouterModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  protected readonly router = inject(Router);
  protected readonly authService = inject(AuthService);
  protected readonly dialogService = inject(DialogService);

  readonly user = this.authService.user;

  readonly USER_LINKS = APP_NAV_LINKS.filter(link => link.user);
  readonly PUBLIC_LINKS = APP_NAV_LINKS.filter(link => !link.user);

  readonly navigated = output();

  navigateToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  openUserSessionInfoDialog(user: AuthUser): void {
    this.dialogService.openUserSessionInfoDialog(user);
  }

  logout(): void {
    this.authService.logout();
  }
}
